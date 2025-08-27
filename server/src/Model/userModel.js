const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

    name: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Invalid email format'],
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^[0]?[6789]\d{9,11}$/, 'Phone number must be between 10 and 12 digits'], 
    },
    role: {
        type: String,
        values: ['user', 'admin'],
        default: 'user',
    },
    uid: {
        type: String
    }, lastLogin: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const user = mongoose.model('userModel', userSchema)
module.exports = user