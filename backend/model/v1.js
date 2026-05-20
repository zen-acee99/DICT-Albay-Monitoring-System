const mongoose = require('mongoose')

const V1Schema = new mongoose.Schema({
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

const V1Model = mongoose.model('operation_elguv1', V1Schema)
module.exports = V1Model


