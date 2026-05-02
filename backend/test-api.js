const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Test data
let testUserId;
let testConversationId;

// Helper function to log test results
const logTest = (name, success, data = null) => {
  console.log(`\n${success ? '✓' : '✗'} ${name}`);
  if (data) {
    console.log('  Response:', JSON.stringify(data, null, 2));
  }
};

// Run tests
const runTests = async () => {
  console.log('=================================');
  console.log('🧪 Testing AI Chatbot Backend API');
  console.log('=================================');

  try {
    // Test 1: Health check
    const health = await axios.get(`${BASE_URL}/health`);
    logTest('Health Check', health.data.status === 'ok', health.data);

    // Test 2: Register user
    const registerData = {
      username: `testuser${Math.floor(Math.random() * 10000)}`,
      password: 'testpass123',
    };
    const register = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
    testUserId = register.data.user.id;
    logTest('User Registration', register.data.success, register.data);

    // Test 3: Login user
    const login = await axios.post(`${BASE_URL}/api/auth/login`, registerData);
    logTest('User Login', login.data.success, login.data);

    // Test 4: Get user profile
    const profile = await axios.get(`${BASE_URL}/api/auth/profile/${testUserId}`);
    logTest('Get User Profile', profile.data.success, profile.data);

    // Test 5: Get system prompts
    const prompts = await axios.get(`${BASE_URL}/api/chat/system-prompts`);
    logTest('Get System Prompts', prompts.data.success, prompts.data);

    // Test 6: Create conversation
    const createConv = await axios.post(`${BASE_URL}/api/chat/conversations`, {
      userId: testUserId,
      title: 'Test Conversation',
    });
    testConversationId = createConv.data.conversation.id;
    logTest('Create Conversation', createConv.data.success, createConv.data);

    // Test 7: Get conversations
    const conversations = await axios.get(`${BASE_URL}/api/chat/conversations/${testUserId}`);
    logTest('Get Conversations', conversations.data.success, {
      count: conversations.data.conversations.length,
    });

    // Test 8: Send message (this will call Claude API)
    console.log('\n⏳ Sending message to Claude API (this may take a few seconds)...');
    const sendMsg = await axios.post(
      `${BASE_URL}/api/chat/conversations/${testConversationId}/messages`,
      {
        userId: testUserId,
        content: 'Hello! Can you tell me a short joke?',
      }
    );
    logTest('Send Message & Get AI Response', sendMsg.data.success, {
      userMessage: sendMsg.data.userMessage.content,
      aiResponse: sendMsg.data.aiMessage.content.substring(0, 100) + '...',
    });

    // Test 9: Get messages
    const messages = await axios.get(
      `${BASE_URL}/api/chat/conversations/${testConversationId}/messages?userId=${testUserId}`
    );
    logTest('Get Messages', messages.data.success, {
      count: messages.data.messages.length,
    });

    // Test 10: Update conversation title
    const updateConv = await axios.put(
      `${BASE_URL}/api/chat/conversations/${testConversationId}`,
      {
        userId: testUserId,
        title: 'Updated Test Conversation',
      }
    );
    logTest('Update Conversation', updateConv.data.success);

    // Test 11: Delete conversation
    const deleteConv = await axios.delete(
      `${BASE_URL}/api/chat/conversations/${testConversationId}?userId=${testUserId}`
    );
    logTest('Delete Conversation', deleteConv.data.success);

    console.log('\n=================================');
    console.log('✅ All tests passed successfully!');
    console.log('=================================\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.log('\n=================================');
    console.log('❌ Tests failed');
    console.log('=================================\n');
  }
};

// Run tests
runTests();

// Made with Bob
