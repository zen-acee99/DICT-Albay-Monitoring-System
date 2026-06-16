const mongoose = require('mongoose');

const WifiSchema = new mongoose.Schema({
    SiteType: { type: String },
    LocationName: { type: String },
    fundSource: { type: String },
    ProjectName: { type: String },
    Contact: { type: String },
    LinkType: { type: String },
    ApCount: { type: String },
    Coordinates: {
        type: [Number]
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