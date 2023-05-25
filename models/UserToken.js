const { required } = require('joi')
const mongoose = require('mongoose')

const userTokenSchema = mongoose.Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("UserToken", userTokenSchema)