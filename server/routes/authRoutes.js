const express = require('express');
const router = express.Router();
const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

router.post('/signup', async (req, res) => {
    try {
        const newUser = new userModel(req.body);
        const user = await newUser.save();
        res.json(user);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Internal Server Error', error: err.message });
        }
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user._id }, config.JWT_SECRET);
            res.json({ message: 'success', token: token, user: user });
        } else {
            res.json({ message: 'Incorrect email or password' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

module.exports = router;
