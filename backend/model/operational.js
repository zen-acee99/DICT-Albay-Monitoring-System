const mongoose = require('mongoose')

const OperationalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
    status: {
        type: String,
        default: ""
    },
    version: {
        type: String,
        default: ""
    },
    live_status: {
        type: String,
        default: ""
    },

    user_mod: {
        type: String,
        default: ""
    },

    date_mod: {
        type: String,
        default: ""
    }
})

const OperationalModel = mongoose.model('operationals', OperationalSchema)
module.exports = OperationalModel


