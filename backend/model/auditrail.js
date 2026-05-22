const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')

const AuditTrailSchema = new mongoose.Schema({
    username: String,
    module: String,
    Timestamp: String
})

const AuditTrailModel = mongoose.model('auditTrails', AuditTrailSchema)
module.exports = AuditTrailModel