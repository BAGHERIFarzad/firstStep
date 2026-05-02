require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase, closeDatabase } = require('./database');
const { API_CONFIG } = require('./constants');

// Import routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Chatbot API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile/:userId',
      },
      chat: {
        createConversation: 'POST /api/chat/conversations',
        getConversations: 'GET /api/chat/conversations/:userId',
        getConversation: 'GET /api/chat/conversations/:conversationId/details',
        updateConversation: 'PUT /api/chat/conversations/:conversationId',
        deleteConversation: 'DELETE /api/chat/conversations/:conversationId',
        getMessages: 'GET /api/chat/conversations/:conversationId/messages',
        sendMessage: 'POST /api/chat/conversations/:conversationId/messages',
        getSystemPrompts: 'GET /api/chat/system-prompts',
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    console.log('✓ Database initialized');
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    process.exit(1);
  }

  // Start server
  const PORT = API_CONFIG.PORT;
  const server = app.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 AI Chatbot Backend Server');
    console.log('=================================');
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ API URL: http://localhost:${PORT}`);
    console.log(`✓ Health check: http://localhost:${PORT}/health`);
    console.log('=================================');
  });

  return server;
};

// Start the server
let server;
startServer().then(s => {
  server = s;
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  
  server.close(() => {
    console.log('✓ HTTP server closed');
    
    try {
      closeDatabase();
      console.log('✓ Database connection closed');
    } catch (error) {
      console.error('✗ Error closing database:', error);
    }
    
    console.log('✓ Shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

module.exports = app;

// Made with Bob
