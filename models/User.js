const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 200
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 200,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    age: {
        type: Number,
        min: 18
    },
    roles: {
        type: [String],
        enum: ["user", "admin", "super_admin"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);