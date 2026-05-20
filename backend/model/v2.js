const mongoose = require('mongoose')

const V2Schema = new mongoose.Schema({
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

const V2Model = mongoose.model('operation_elguv2', V2Schema)
module.exports = V2Model