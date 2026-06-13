const mongoose = require('mongoose');

const IlcdbSchema = new mongoose.Schema({
    Title: { type: String },
    Date: { type: String },
    Location: { type: String },
    Coordinates: {
        type: [Number],
        required: true
    },
    TargetSectors: { type: String },
    Mode: { type: String },
    AssignStaff: { type: String },
    Remarks: { type: String },
})

const IlcdbModel = mongoose.model('ilcdb', IlcdbSchema)
module.exports = IlcdbModel