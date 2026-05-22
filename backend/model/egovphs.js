const mongoose = require('mongoose')

const EgovphSchema = new mongoose.Schema({
    provinceName: String,
    municipalities: String,
    registeredUsers: Number
})

const EgovphModel = mongoose.model('egovphs', EgovphSchema)
module.exports = EgovphModel