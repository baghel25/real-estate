const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth'); // Import auth middleware

// Define routes for user authentication
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', auth, authController.loadUser); // Ensure this line is included

module.exports = router;
