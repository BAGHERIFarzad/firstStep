# AI Chatbot Backend

A Node.js/Express backend server with SQLite database and Claude AI integration.

## Features

- ✅ User authentication (register/login)
- ✅ Conversation management
- ✅ Real-time chat with Claude AI
- ✅ Message history persistence
- ✅ Multiple system prompts (Default, Creative, Technical)
- ✅ RESTful API design

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (via sql.js)
- **AI**: Anthropic Claude API
- **Environment**: dotenv

## Project Structure

```
backend/
├── server.js           # Main server file
├── database.js         # Database operations
├── anthropic.js        # Claude AI integration
├── constants.js        # Configuration constants
├── routes/
│   ├── auth.js        # Authentication routes
│   └── chat.js        # Chat & conversation routes
├── .env               # Environment variables
├── package.json       # Dependencies
└── chatbot.db         # SQLite database (auto-created)
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env` file should contain:

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
```

### 3. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

```
GET /health
```

Returns server status and uptime.

### Authentication

#### Register User
```
POST /api/auth/register
Body: { username, password }
```

#### Login User
```
POST /api/auth/login
Body: { username, password }
```

#### Get User Profile
```
GET /api/auth/profile/:userId
```

### Chat & Conversations

#### Create Conversation
```
POST /api/chat/conversations
Body: { userId, title, systemPrompt? }
```

#### Get User Conversations
```
GET /api/chat/conversations/:userId
```

#### Get Conversation Details
```
GET /api/chat/conversations/:conversationId/details?userId=X
```

#### Update Conversation
```
PUT /api/chat/conversations/:conversationId
Body: { userId, title }
```

#### Delete Conversation
```
DELETE /api/chat/conversations/:conversationId?userId=X
```

#### Get Messages
```
GET /api/chat/conversations/:conversationId/messages?userId=X
```

#### Send Message
```
POST /api/chat/conversations/:conversationId/messages
Body: { userId, content }
```

#### Get System Prompts
```
GET /api/chat/system-prompts
```

## Testing

Run the test script to verify all endpoints:

```bash
node test-api.js
```

**Important**: Make sure the server is running before executing tests.

## Database Schema

### Users Table
- `id`: INTEGER PRIMARY KEY
- `username`: TEXT UNIQUE
- `password`: TEXT
- `created_at`: DATETIME

### Conversations Table
- `id`: INTEGER PRIMARY KEY
- `user_id`: INTEGER (FK)
- `title`: TEXT
- `system_prompt`: TEXT
- `created_at`: DATETIME
- `updated_at`: DATETIME

### Messages Table
- `id`: INTEGER PRIMARY KEY
- `conversation_id`: INTEGER (FK)
- `role`: TEXT ('user' | 'assistant')
- `content`: TEXT
- `created_at`: DATETIME

## System Prompts

The backend supports three system prompts:

1. **DEFAULT**: General-purpose helpful assistant
2. **CREATIVE**: Creative writing and brainstorming
3. **TECHNICAL**: Programming and technical assistance

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Notes

⚠️ **Important**: This is a demo application. For production use:

- Implement proper password hashing (bcrypt)
- Add JWT authentication
- Implement rate limiting
- Add input validation/sanitization
- Use HTTPS
- Add CORS restrictions
- Implement proper session management

## Development

### Hot Reload

For development with auto-restart on file changes, install nodemon:

```bash
npm install -g nodemon
nodemon server.js
```

### Debugging

Set `NODE_ENV=development` in `.env` for detailed error messages.

## Troubleshooting

### Database Issues

If you encounter database errors, delete `chatbot.db` and restart the server:

```bash
rm chatbot.db
npm start
```

### API Key Issues

Verify your Anthropic API key is valid:
- Check `.env` file
- Ensure no extra spaces
- Verify key has proper permissions

### Port Already in Use

Change the PORT in `.env` or kill the process using port 3001:

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

## License

MIT

## Support

For issues or questions, please refer to the project documentation.