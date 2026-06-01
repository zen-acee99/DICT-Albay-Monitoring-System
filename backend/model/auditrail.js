const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const AuditTrailSchema = new mongoose.Schema({
    username: String,
    module: String,
    timestamp: String
})

const AuditTrailModel = mongoose.model('audittrails', AuditTrailSchema)
module.exports = AuditTrailModel