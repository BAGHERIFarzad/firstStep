const Anthropic = require('@anthropic-ai/sdk');
const { API_CONFIG, SYSTEM_PROMPTS } = require('./constants');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: API_CONFIG.ANTHROPIC_API_KEY,
});

/**
 * Send a message to Claude and get a response
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} systemPrompt - System prompt to use (optional)
 * @returns {Promise<string>} - Claude's response
 */
const sendMessage = async (messages, systemPrompt = SYSTEM_PROMPTS.DEFAULT) => {
  try {
    // Format messages for Anthropic API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Create message with Claude
    const response = await anthropic.messages.create({
      model: API_CONFIG.CLAUDE_MODEL,
      max_tokens: API_CONFIG.MAX_TOKENS,
      system: systemPrompt,
      messages: formattedMessages,
    });

    // Extract text content from response
    const textContent = response.content.find(block => block.type === 'text');
    return textContent ? textContent.text : '';
  } catch (error) {
    console.error('Anthropic API Error:', error);
    throw new Error(`Failed to get response from Claude: ${error.message}`);
  }
};

/**
 * Send a streaming message to Claude
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} systemPrompt - System prompt to use (optional)
 * @param {Function} onChunk - Callback function for each chunk
 * @returns {Promise<string>} - Complete response
 */
const sendStreamingMessage = async (messages, systemPrompt = SYSTEM_PROMPTS.DEFAULT, onChunk) => {
  try {
    // Format messages for Anthropic API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    let fullResponse = '';

    // Create streaming message with Claude
    const stream = await anthropic.messages.stream({
      model: API_CONFIG.CLAUDE_MODEL,
      max_tokens: API_CONFIG.MAX_TOKENS,
      system: systemPrompt,
      messages: formattedMessages,
    });

    // Handle stream events
    stream.on('text', (text) => {
      fullResponse += text;
      if (onChunk) {
        onChunk(text);
      }
    });

    // Wait for stream to complete
    await stream.finalMessage();

    return fullResponse;
  } catch (error) {
    console.error('Anthropic Streaming API Error:', error);
    throw new Error(`Failed to get streaming response from Claude: ${error.message}`);
  }
};

/**
 * Get available system prompts
 * @returns {Object} - Object containing all system prompts
 */
const getSystemPrompts = () => {
  return SYSTEM_PROMPTS;
};

/**
 * Validate API key
 * @returns {Promise<boolean>} - True if API key is valid
 */
const validateApiKey = async () => {
  try {
    // Try a simple API call to validate the key
    await anthropic.messages.create({
      model: API_CONFIG.CLAUDE_MODEL,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hi' }],
    });
    return true;
  } catch (error) {
    console.error('API Key Validation Error:', error);
    return false;
  }
};

/**
 * Format conversation history for Claude
 * @param {Array} messages - Raw messages from database
 * @returns {Array} - Formatted messages for Claude API
 */
const formatConversationHistory = (messages) => {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));
};

/**
 * Truncate conversation history to fit context window
 * @param {Array} messages - Array of messages
 * @param {number} maxMessages - Maximum number of messages to keep
 * @returns {Array} - Truncated messages
 */
const truncateHistory = (messages, maxMessages) => {
  if (messages.length <= maxMessages) {
    return messages;
  }
  
  // Keep the most recent messages
  return messages.slice(-maxMessages);
};

module.exports = {
  sendMessage,
  sendStreamingMessage,
  getSystemPrompts,
  validateApiKey,
  formatConversationHistory,
  truncateHistory,
};

// Made with Bob
