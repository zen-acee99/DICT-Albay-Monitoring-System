const mongoose = require('mongoose');

const WifiSchema = new mongoose.Schema({
    SiteType: { type: String, required: true },
    LocationName: { type: String, required: true },
    fundSource: { type: String, required: true },
    ProjectName: { type: String, required: true },
    Contact: { type: String, required: true },
    LinkType: { type: String, required: true },
    ApCount: { type: String, required: true },
    Coordinates: {
        type: [Number],
        required: true
    },
    LocationCode: { type: String },
    Barangay: { type: String },
    Municipality: { type: String },
    Province: { type: String },
    Remarks: { type: String },
    NationWideID: { type: String }
})

const WifiModel = mongoose.model('wifi', WifiSchema)
module.exports = WifiModel