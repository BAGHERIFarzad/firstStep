// API Configuration
const API_CONFIG = {
  PORT: process.env.PORT || 3001,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  CLAUDE_MODEL: 'claude-sonnet-4-20250514', // Update to valid model if needed: claude-3-opus-20240229, claude-3-sonnet-20240229, claude-3-haiku-20240307
  MAX_TOKENS: 8096,
};

// Database Configuration
const DB_CONFIG = {
  DB_PATH: './chatbot.db',
  TABLES: {
    USERS: 'users',
    CONVERSATIONS: 'conversations',
    MESSAGES: 'messages',
  },
};

// System Prompts
const SYSTEM_PROMPTS = {
  DEFAULT: `You are a helpful AI assistant. You provide clear, accurate, and concise responses to user queries. 
You are knowledgeable across many domains and can help with various tasks including:
- Answering questions
- Providing explanations
- Helping with problem-solving
- Offering suggestions and recommendations

Always be polite, professional, and aim to be as helpful as possible.`,
  
  CREATIVE: `You are a creative AI assistant with a flair for imaginative thinking. You help users with:
- Creative writing and storytelling
- Brainstorming ideas
- Artistic concepts
- Innovative solutions

Be expressive, think outside the box, and encourage creativity while maintaining helpfulness.`,
  
  TECHNICAL: `You are a technical AI assistant specialized in programming and technology. You excel at:
- Explaining technical concepts
- Debugging code
- Providing programming solutions
- Discussing software architecture
- Explaining algorithms and data structures

Be precise, use technical terminology appropriately, and provide code examples when relevant.`,
};

// Error Messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid username or password',
  USER_EXISTS: 'Username already exists',
  USER_NOT_FOUND: 'User not found',
  CONVERSATION_NOT_FOUND: 'Conversation not found',
  UNAUTHORIZED: 'Unauthorized access',
  MISSING_FIELDS: 'Missing required fields',
  INVALID_REQUEST: 'Invalid request',
  SERVER_ERROR: 'Internal server error',
  API_ERROR: 'Error communicating with AI service',
  DATABASE_ERROR: 'Database operation failed',
};

// Success Messages
const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  LOGIN_SUCCESS: 'Login successful',
  CONVERSATION_CREATED: 'Conversation created successfully',
  CONVERSATION_DELETED: 'Conversation deleted successfully',
  MESSAGE_SENT: 'Message sent successfully',
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// Conversation Settings
const CONVERSATION_CONFIG = {
  MAX_TITLE_LENGTH: 100,
  DEFAULT_TITLE: 'New Conversation',
  MAX_MESSAGE_LENGTH: 10000,
  CONTEXT_WINDOW: 10, // Number of previous messages to include in context
};

module.exports = {
  API_CONFIG,
  DB_CONFIG,
  SYSTEM_PROMPTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  HTTP_STATUS,
  CONVERSATION_CONFIG,
};

// Made with Bob
