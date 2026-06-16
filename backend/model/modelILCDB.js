const mongoose = require('mongoose');

const IlcdbSchema = new mongoose.Schema({
    Title: { type: String },
    Location: { type: String },
    Coordinates: {
        type: [Number]
    },
    TargetSectors: { type: String },
    Mode: { type: String }
})

const IlcdbModel = mongoose.model('ilcdb', IlcdbSchema)
module.exports = IlcdbModel