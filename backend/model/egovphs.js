const mongoose = require('mongoose')

const EgovphSchema = new mongoose.Schema({
    provinceName: {type: String},
    municipalities: {type: String},
    registeredUsers: {type: Number},
})

const EgovphModel = mongoose.model('egovphs', EgovphSchema)
module.exports = EgovphModel