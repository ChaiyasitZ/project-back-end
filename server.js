const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 8080;
const prisma = new PrismaClient();

app.use(express.json());

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

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

app.listen(port, () => {console.log(`Server is running on port ${port}`);});
