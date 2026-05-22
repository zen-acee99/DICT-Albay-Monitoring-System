const express = require('express')
const router = express.Router()

const OperationalModel = require('../model/operational')


// GET all users
router.get('/operational', (req, res) => {
    OperationalModel.find({})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// GET user by ID
router.get('/operational/:id', (req, res) => {
    const id = req.params.id
    OperationalModel.findById({_id: id})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// POST create new user
router.post('/CreateOperational', (req, res) => {
    OperationalModel.create(req.body)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// PUT update user by ID
router.put('/updateOperational/:id', async (req, res) => {
    try{
        const update = await OperationalModel.findByIdAndUpdate(
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
router.delete('/deleteUsers/:id', async ( req, res) => {
    try{
        const deleteUser = await UserModel.findByIdAndDelete(req.params.id)
        res.json(deleteUser)
    } catch( err ) {
        res.status(500).json(err)
    }
})
module.exports = router