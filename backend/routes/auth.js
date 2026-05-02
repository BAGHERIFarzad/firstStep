const express = require('express');
const router = express.Router();
const { userOperations } = require('../database');
const { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_STATUS } = require('../constants');

/**
 * Register a new user
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.MISSING_FIELDS,
      });
    }

    // Check if username is valid (alphanumeric, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
      });
    }

    // Check if password is strong enough (min 6 chars)
    if (password.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const existingUser = userOperations.findByUsername(username);
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: ERROR_MESSAGES.USER_EXISTS,
      });
    }

    // Create user (in production, hash the password!)
    // For this demo, we're storing plain text - NOT RECOMMENDED for production
    const result = userOperations.create(username, password);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.USER_CREATED,
      user: {
        id: result.lastInsertRowid,
        username,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
});

/**
 * Login user
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.MISSING_FIELDS,
      });
    }

    // Find user
    const user = userOperations.findByUsername(username);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Verify password (in production, use bcrypt.compare!)
    if (user.password !== password) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Return user info (in production, return JWT token)
    res.json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
});

/**
 * Get user profile
 * GET /api/auth/profile/:userId
 */
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = userOperations.findById(userId);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    });
  }
});

module.exports = router;

// Made with Bob
