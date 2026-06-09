const mongoose = require('mongoose')

const PnpkiSchema = new mongoose.Schema({
    Province: { type: String, required: true },
    Date: { type: String, required: true },
    Raa: { type: String, required: true },
    Region: { type: String, required: true },
    LastName_firstName_Sign: { type: String, required: true },
    fullName: { type: String, required: true },
    EmailAddress: { type: String, required: true },
    ContactNumber: { type: String, required: true },
    Address: { type: String, required: true },
    CongressionalDistrict: { type: String, required: true },
    AgencyName: { type: String, required: true },
    followS_NConvention: { type: String, required: true },
    Tax: { type: String, required: true },
    Status: { type: String, required: true },
    Coordinates: {
        type: [Number],
        required: true
    }
})

const PnpkiModel = mongoose.model('pnpki', PnpkiSchema)
module.exports = PnpkiModel