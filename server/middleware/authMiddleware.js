const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 
const config = require('../config');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        console.log("Decoded token:", decoded);
        if (!mongoose.isValidObjectId(decoded.userId)) {
            console.error("Invalid userId:", decoded.userId);
            return res.status(400).json({ message: 'Invalid userId format' });
        }
        req.userId = decoded.userId;
        console.log("UserID from middleware:", req.userId);
        console.log("Request object in middleware:", req); 
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ message: 'Invalid token', error: err.message });
    }
};
