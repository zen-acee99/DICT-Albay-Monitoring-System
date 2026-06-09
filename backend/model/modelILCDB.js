const mongoose = require('mongoose');

const IlcdbSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Date: { type: String, required: true },
    Location: { type: String, required: true },
    Coordinates: {
        type: [Number],
        required: true
    },
    TargetSectors: { type: String, required: true },
    Mode: { type: String, required: true },
    AssignStaff: { type: String, required: true },
    Remarks: { type: String, required: true },
})

const IlcdbModel = mongoose.model('ilcdb', IlcdbSchema)
module.exports = IlcdbModel