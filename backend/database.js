const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const { DB_CONFIG } = require('./constants');

let db = null;
let SQL = null;

// Initialize database
const initDatabase = async () => {
  try {
    // Initialize SQL.js
    SQL = await initSqlJs();
    
    const dbPath = path.resolve(DB_CONFIG.DB_PATH);
    
    // Check if database file exists
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Create tables
    db.run(`
      CREATE TABLE IF NOT EXISTS ${DB_CONFIG.TABLES.USERS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS ${DB_CONFIG.TABLES.CONVERSATIONS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        system_prompt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES ${DB_CONFIG.TABLES.USERS}(id) ON DELETE CASCADE
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS ${DB_CONFIG.TABLES.MESSAGES} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES ${DB_CONFIG.TABLES.CONVERSATIONS}(id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_conversations_user_id 
      ON ${DB_CONFIG.TABLES.CONVERSATIONS}(user_id)
    `);

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id 
      ON ${DB_CONFIG.TABLES.MESSAGES}(conversation_id)
    `);

    // Save database to file
    saveDatabase();

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Save database to file
const saveDatabase = () => {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(path.resolve(DB_CONFIG.DB_PATH), buffer);
  }
};

// User operations
const userOperations = {
  create: (username, password) => {
    db.run(
      `INSERT INTO ${DB_CONFIG.TABLES.USERS} (username, password) VALUES (?, ?)`,
      [username, password]
    );
    saveDatabase();
    
    // Get the newly created user by username
    const result = db.exec(
      `SELECT id FROM ${DB_CONFIG.TABLES.USERS} WHERE username = ?`,
      [username]
    );
    
    if (result.length === 0 || result[0].values.length === 0) {
      throw new Error('Failed to create user');
    }
    
    return { lastInsertRowid: result[0].values[0][0] };
  },

  findByUsername: (username) => {
    const result = db.exec(
      `SELECT * FROM ${DB_CONFIG.TABLES.USERS} WHERE username = ?`,
      [username]
    );
    
    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }
    
    const columns = result[0].columns;
    const values = result[0].values[0];
    const user = {};
    columns.forEach((col, idx) => {
      user[col] = values[idx];
    });
    return user;
  },

  findById: (id) => {
    const result = db.exec(
      `SELECT id, username, created_at FROM ${DB_CONFIG.TABLES.USERS} WHERE id = ?`,
      [id]
    );
    
    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }
    
    const columns = result[0].columns;
    const values = result[0].values[0];
    const user = {};
    columns.forEach((col, idx) => {
      user[col] = values[idx];
    });
    return user;
  },
};

// Conversation operations
const conversationOperations = {
  create: (userId, title, systemPrompt = null) => {
    db.run(
      `INSERT INTO ${DB_CONFIG.TABLES.CONVERSATIONS} (user_id, title, system_prompt) VALUES (?, ?, ?)`,
      [userId, title, systemPrompt]
    );
    saveDatabase();
    
    // Get the max ID for this user
    const result = db.exec(
      `SELECT MAX(id) as id FROM ${DB_CONFIG.TABLES.CONVERSATIONS} WHERE user_id = ?`,
      [userId]
    );
    return { lastInsertRowid: result[0].values[0][0] };
  },

  findById: (id) => {
    const result = db.exec(
      `SELECT * FROM ${DB_CONFIG.TABLES.CONVERSATIONS} WHERE id = ?`,
      [id]
    );
    
    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }
    
    return rowToObject(result[0]);
  },

  findByUserId: (userId) => {
    const result = db.exec(
      `SELECT 
        c.*,
        (SELECT COUNT(*) FROM ${DB_CONFIG.TABLES.MESSAGES} WHERE conversation_id = c.id) as message_count,
        (SELECT content FROM ${DB_CONFIG.TABLES.MESSAGES} 
         WHERE conversation_id = c.id AND role = 'user' 
         ORDER BY created_at ASC LIMIT 1) as first_message
      FROM ${DB_CONFIG.TABLES.CONVERSATIONS} c
      WHERE c.user_id = ?
      ORDER BY c.updated_at DESC`,
      [userId]
    );
    
    if (result.length === 0) {
      return [];
    }
    
    return rowsToObjects(result[0]);
  },

  update: (id, title) => {
    db.run(
      `UPDATE ${DB_CONFIG.TABLES.CONVERSATIONS} SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [title, id]
    );
    saveDatabase();
    return { changes: 1 };
  },

  updateTimestamp: (id) => {
    db.run(
      `UPDATE ${DB_CONFIG.TABLES.CONVERSATIONS} SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id]
    );
    saveDatabase();
    return { changes: 1 };
  },

  delete: (id) => {
    db.run(
      `DELETE FROM ${DB_CONFIG.TABLES.CONVERSATIONS} WHERE id = ?`,
      [id]
    );
    saveDatabase();
    return { changes: 1 };
  },

  verifyOwnership: (conversationId, userId) => {
    const result = db.exec(
      `SELECT id FROM ${DB_CONFIG.TABLES.CONVERSATIONS} WHERE id = ? AND user_id = ?`,
      [conversationId, userId]
    );
    return result.length > 0 && result[0].values.length > 0;
  },
};

// Message operations
const messageOperations = {
  create: (conversationId, role, content) => {
    db.run(
      `INSERT INTO ${DB_CONFIG.TABLES.MESSAGES} (conversation_id, role, content) VALUES (?, ?, ?)`,
      [conversationId, role, content]
    );
    saveDatabase();
    
    // Get the max ID for this conversation
    const result = db.exec(
      `SELECT MAX(id) as id FROM ${DB_CONFIG.TABLES.MESSAGES} WHERE conversation_id = ?`,
      [conversationId]
    );
    return { lastInsertRowid: result[0].values[0][0] };
  },

  findByConversationId: (conversationId, limit = null) => {
    let query = `
      SELECT * FROM ${DB_CONFIG.TABLES.MESSAGES}
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `;
    
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    
    const result = db.exec(query, [conversationId]);
    
    if (result.length === 0) {
      return [];
    }
    
    return rowsToObjects(result[0]);
  },

  getRecentMessages: (conversationId, count) => {
    const result = db.exec(
      `SELECT * FROM ${DB_CONFIG.TABLES.MESSAGES}
       WHERE conversation_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [conversationId, count]
    );
    
    if (result.length === 0) {
      return [];
    }
    
    const messages = rowsToObjects(result[0]);
    return messages.reverse();
  },

  deleteByConversationId: (conversationId) => {
    db.run(
      `DELETE FROM ${DB_CONFIG.TABLES.MESSAGES} WHERE conversation_id = ?`,
      [conversationId]
    );
    saveDatabase();
    return { changes: 1 };
  },

  getCount: (conversationId) => {
    const result = db.exec(
      `SELECT COUNT(*) as count FROM ${DB_CONFIG.TABLES.MESSAGES} WHERE conversation_id = ?`,
      [conversationId]
    );
    return result[0].values[0][0];
  },
};

// Helper functions to convert SQL.js results to objects
const rowToObject = (result) => {
  if (!result || result.values.length === 0) {
    return null;
  }
  
  const obj = {};
  result.columns.forEach((col, idx) => {
    obj[col] = result.values[0][idx];
  });
  return obj;
};

const rowsToObjects = (result) => {
  if (!result || result.values.length === 0) {
    return [];
  }
  
  return result.values.map(row => {
    const obj = {};
    result.columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });
};

// Close database connection
const closeDatabase = () => {
  if (db) {
    saveDatabase();
    db.close();
    console.log('Database connection closed');
  }
};

module.exports = {
  initDatabase,
  userOperations,
  conversationOperations,
  messageOperations,
  closeDatabase,
};

// Made with Bob
