const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('./user');
const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Check if the username is already taken
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await createUser(username, email, hashedPassword);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await findUserByUsername(username);

        if (user && await bcrypt.compare(password, user.password)) {
            // Generate a JWT token for authentication
            const token = jwt.sign({ userId: user.id }, 'your_secret_key');
            res.json({ message: 'Login successful', token });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error authenticating user' });
    }
});

module.exports = router;
