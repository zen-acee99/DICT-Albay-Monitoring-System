const mongoose = require('mongoose')

const ModelEgovphs = new mongoose.Schema({
    Province: {type: String},
    municipalities: {type: String},
    registeredUsers: {type: Number},
    PromotionalActivities: { type: String },
    TechnicalAssistance: { type: String },
    Coordinates: { type: String }
})

const modelegovphs = mongoose.model('modelegovph', ModelEgovphs)
module.exports = modelegovphs