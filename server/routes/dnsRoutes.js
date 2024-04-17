const express = require('express');
const router = express.Router();
const userModel = require('../models/users');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, async (req, res) => {
    const { domainName, type, value, ttl } = req.body;
    try {
        const user = await userModel.findById(req.userId);
        if (user) {
            user.dnsRecords.push({ domainName, type, value, ttl });
            await user.save();
            res.json({ message: 'DNS record added successfully', user: user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId);
        if (user) {
            res.json({ message: 'success', user: user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

module.exports = router;
