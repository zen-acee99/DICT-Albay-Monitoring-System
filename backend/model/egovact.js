const mongoose = require('mongoose');

const EgovActSchema = new mongoose.Schema({
    TechnicalDate: String,
    TechnicalAssistance: String,
})

const EgovActModel = mongoose.model('egovacts', EgovActSchema);
module.exports = EgovActModel;