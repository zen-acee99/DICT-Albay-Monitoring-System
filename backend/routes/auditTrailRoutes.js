const express = require('express')
const router = express.Router()

const AuditTrailModel = require('../model/auditrail')


// GET all users
router.get('/audit', (req, res) => {
    AuditTrailModel.find({})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// GET user by ID
router.get('/audit/:id', (req, res) => {
    const id = req.params.id
    AuditTrailModel.findById({_id: id})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// POST create new user
router.post('/CreateAudit', (req, res) => {
    AuditTrailModel.create(req.body)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// PUT update user by ID
router.put('/updateAudit/:id', async (req, res) => {
    try{
        const update = await AuditTrailModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        )
        res.json(update)
    } catch(err) {
        res.status(500).json(err)
    }
})

// DELETE user by ID
router.delete('/deleteAudit/:id', async ( req, res) => {
    try{
        const deleteUser = await AuditTrailModel.findByIdAndDelete(req.params.id)
        res.json(deleteUser)
    } catch( err ) {
        res.status(500).json(err)
    }
})
module.exports = router