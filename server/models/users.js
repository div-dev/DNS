const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const dnsRecordSchema = new mongoose.Schema({
    domainName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    ttl: {
        type: Number,
        default: 3600
    }
});

const userSchema = new mongoose.Schema({
    userName: String,
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    dnsRecords: [dnsRecordSchema]
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
