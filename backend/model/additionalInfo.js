// Mongoose Schema

const mongoose = require('mongoose');

const additionalInfoSchema = new mongoose.Schema({
  services: { type: String },
  location: { type: String },
  AgencyName: { type: String },
  eventName: { type: String }
});

const AdditionalInfoModel = mongoose.model('additionalInfo', additionalInfoSchema);
module.exports = AdditionalInfoModel;


