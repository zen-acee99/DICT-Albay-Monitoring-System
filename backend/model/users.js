const mongoose = require('mongoose')

const UserScheme = new mongoose.Schema({
    username: { type: String, 
        required: true },
    email: { type: String, 
        required: true },
    password: { type: String, 
        required: true },
    role: { type: String,
        required: true }
})

const UserModel = mongoose.model('users', UserScheme)
module.exports = UserModel