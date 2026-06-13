const mongoose = require('mongoose')

const PnpkiSchema = new mongoose.Schema({
    Province: { type: String },
    Date: { type: String },
    Raa: { type: String },
    Region: { type: String },
    LastName_firstName_Sign: { type: String },
    fullName: { type: String },
    EmailAddress: { type: String },
    ContactNumber: { type: String },
    Municipality: { type: String },
    CongressionalDistrict: { type: String },
    AgencyName: { type: String },
    followS_NConvention: { type: String },
    Tax: { type: String },
    Status: { type: String },
    Coordinates: {
        type: [Number]
    }
})

const PnpkiModel = mongoose.model('pnpki', PnpkiSchema)
module.exports = PnpkiModel