require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY 
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/chat/analyze', async (req, res) => {
  const { code, language } = req.body;
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: `Analyze this ${language} code. Return ONLY JSON no backticks: {"summary":"...","components":[{"name":"...","description":"..."}],"tests":["test1","test2","test3"],"documentation":"..."}\n\nCode:\n${code}` }]
    });
    const text = msg.content[0].text;
    const cleaned = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
    const result = JSON.parse(cleaned);
    res.json({ success: true, analysis: result });
  } catch(e) {
    console.error('ERROR:', e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

app.listen(3001, () => console.log('Server on 3001'));