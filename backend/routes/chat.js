const express = require('express');
const router = express.Router();
const { conversationOperations, messageOperations } = require('../database');
const { sendMessage, formatConversationHistory, truncateHistory } = require('../anthropic');
const { 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES, 
  HTTP_STATUS, 
  CONVERSATION_CONFIG,
  SYSTEM_PROMPTS 
} = require('../constants');

router.post('/conversations', async (req, res) => {
  try {
    const { userId, title, systemPrompt } = req.body;
    if (!userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.MISSING_FIELDS });
    }
    const conversationTitle = title || CONVERSATION_CONFIG.DEFAULT_TITLE;
    const validPrompt = systemPrompt && Object.values(SYSTEM_PROMPTS).includes(systemPrompt) ? systemPrompt : SYSTEM_PROMPTS.DEFAULT;
    const result = conversationOperations.create(userId, conversationTitle, validPrompt);
    res.status(HTTP_STATUS.CREATED).json({ success: true, message: SUCCESS_MESSAGES.CONVERSATION_CREATED, conversation: { id: result.lastInsertRowid, title: conversationTitle, systemPrompt: validPrompt } });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.DATABASE_ERROR });
  }
});

router.get('/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = conversationOperations.findByUserId(userId);
    res.json({ success: true, conversations });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.DATABASE_ERROR });
  }
});

router.get('/conversations/:conversationId/details', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.query;
    if (userId && !conversationOperations.verifyOwnership(conversationId, userId)) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED });
    }
    const conversation = conversationOperations.findById(conversationId);
    if (!conversation) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.CONVERSATION_NOT_FOUND });
    }
    res.json({ success: true, conversation });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.DATABASE_ERROR });
  }
});

router.put('/conversations/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title, userId } = req.body;
    if (!title || !userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.MISSING_FIELDS });
    }
    if (!conversationOperations.verifyOwnership(conversationId, userId)) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED });
    }
    conversationOperations.update(conversationId, title);
    res.json({ success: true, message: 'Conversation updated successfully' });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.DATABASE_ERROR });
  }
});

router.delete('/conversations/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.query;
    if (!conversationOperations.verifyOwnership(conversationId, userId)) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED });
    }
    conversationOperations.delete(conversationId);
    res.json({ success: true, message: SUCCESS_MESSAGES.CONVERSATION_DELETED });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.DATABASE_ERROR });
  }
});

router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.query;
    if (userId && !conversationOperations.verifyOwnership(conversationId, userId)) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED });
    }
    const messages = messageOperations.findByConversationId(conversationId);
    res.json({ success: true, messages });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.DATABASE_ERROR });
  }
});

router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, userId } = req.body;
    if (!content || !userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.MISSING_FIELDS });
    }
    if (!conversationOperations.verifyOwnership(conversationId, userId)) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED });
    }
    const conversation = conversationOperations.findById(conversationId);
    if (!conversation) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.CONVERSATION_NOT_FOUND });
    }
    const userMessageResult = messageOperations.create(conversationId, 'user', content);
    const recentMessages = messageOperations.getRecentMessages(conversationId, CONVERSATION_CONFIG.CONTEXT_WINDOW * 2);
    const formattedHistory = formatConversationHistory(recentMessages);
    let aiResponse;
    try {
      aiResponse = await sendMessage(formattedHistory, conversation.system_prompt || SYSTEM_PROMPTS.DEFAULT);
    } catch (error) {
      return res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.API_ERROR });
    }
    const aiMessageResult = messageOperations.create(conversationId, 'assistant', aiResponse);
    conversationOperations.updateTimestamp(conversationId);
    res.json({ success: true, message: SUCCESS_MESSAGES.MESSAGE_SENT, userMessage: { id: userMessageResult.lastInsertRowid, role: 'user', content, created_at: new Date().toISOString() }, aiMessage: { id: aiMessageResult.lastInsertRowid, role: 'assistant', content: aiResponse, created_at: new Date().toISOString() } });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
  }
});

router.get('/system-prompts', (req, res) => {
  res.json({ success: true, prompts: Object.keys(SYSTEM_PROMPTS).map(key => ({ key, name: key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' '), value: SYSTEM_PROMPTS[key] })) });
});

// ✅ SINGLE analyze route - fixed
router.post('/analyze', async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }

    const analysisMessage = `Analyze this ${language} code and respond ONLY with a valid JSON object, no markdown, no backticks:

${code}

Return exactly this JSON structure:
{
  "summary": "plain English explanation of what this code does",
  "components": [{"name": "componentName", "description": "what it does"}],
  "tests": ["test case 1", "test case 2", "test case 3"],
  "documentation": "# Documentation\\n\\nmarkdown formatted docs here"
}`;

    const aiResponse = await sendMessage(
      [{ role: 'user', content: analysisMessage }],
      'You are an expert code analyzer. Always respond with valid JSON only, no markdown formatting around it.'
    );

    let analysisResult;
    try {
      // Remove markdown backticks if present
      const cleaned = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      analysisResult = JSON.parse(cleaned);
    } catch (e) {
      analysisResult = null;
    }

    // Normalize the response structure
    const components = Array.isArray(analysisResult?.components) 
      ? analysisResult.components.map(c => typeof c === 'string' ? {name: c, description: ''} : c)
      : Object.entries(analysisResult?.components || {}).map(([k,v]) => ({name: k, description: String(v)}));

    const tests = Array.isArray(analysisResult?.tests)
      ? analysisResult.tests.map(t => typeof t === 'string' ? t : t.description || JSON.stringify(t))
      : ['Test basic functionality', 'Test edge cases', 'Test error handling'];

    const documentation = typeof analysisResult?.documentation === 'string'
      ? analysisResult.documentation
      : JSON.stringify(analysisResult?.documentation || '', null, 2);

    res.json({
      success: true,
      analysis: {
        summary: analysisResult?.summary || '',
        components,
        tests,
        documentation
      }
    });
  } catch (error) {
    console.error('Code analysis error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

// Made with Boba