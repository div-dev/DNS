require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const dnsRoutes = require('./routes/dnsRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const userModel = require('./models/users');

const app = express();

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/dns/records', authMiddleware, async (req, res) => {
    console.log("Accessed /api/dns/records route");
    console.log("UserID in route:", req.userId);
    console.log("Request object in /api/dns/records route:", req); 
    
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
        return res.status(400).json({ message: 'Invalid userId format' });
    }

    try {
        const user = await userModel.findById(req.userId);
        if (user) {
            res.json({ message: 'success', dnsRecords: user.dnsRecords });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid userId format' });
        }
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

app.use('/api/dns', authMiddleware, dnsRoutes);

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
