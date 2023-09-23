const express = require('express');
const bcrypt = require('bcryptjs'); // You'll need to install this package
const { Op } = require("sequelize");
const { User } = require("../model");
const { UserRole } = require("../const/user");

const router = express.Router();

// Allow a user to login given a username or email and password
router.post('/login', async (req, res) => {
    const data = req.body;
    const session = req.session;
    const username  = data.username;
    const password  = data.password;
    let user;

    // Check if user input is valid, must include `username` and `password`
    if (username && password) {
        user = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email: username }],
            }
        });
    } else {
        res.status(400).json({message: '`username` or `password` not provided'});
        return;
    }

    // Check if requested user exists
    if (user) bcrypt.compare(password, user.password, (error, isMatch) => {
        // Passwords match
        if (isMatch) {
            // User is now logged in
            session.userId = user.id;
            session.role = user.role;
            res.json(user);
        } else if (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to login' });
        } else {
            // If user exists, but passwords do not match
            res.status(404).json({ message: 'Invalid username or password' });
        }
    })
    else res.status(404).json({ message: 'Invalid username or password' });
});

router.get('/logout', async (req, res) => {
    // End current session
    req.session.destroy();
    res.send();
})

router.post('/signup', async (req, res) => {
    const session = req.session;
    const userInput = req.body;

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    // Replace the plaintext password with the hashed password
    userInput.password = await bcrypt.hash(userInput.password, salt);
    // Set default role to `user`
    userInput.role = UserRole.User;

    await User
        .create(userInput)
        .then(user => {
            // User is now logged in
            session.userId = user.id;
            session.role = user.role;
            res.json(user);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: 'Failed to sign up' });
        });
})

// Check if an active session exists and retrieve their user information
router.get('/ping', async (req, res) => {
    const userId = req.session.userId;
    let user = null;
    // Check if the user has an active session by checking their user id
    if (userId) user = await User.findByPk(userId);
    res.json(user);
});


module.exports = router;
