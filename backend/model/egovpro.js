const mongoose = require('mongoose');

const EgovProSchema = new mongoose.Schema({
    PromotionalActivities: String,
})

const EgovProModel = mongoose.model('egovpro', EgovProSchema);
module.exports = EgovProModel;