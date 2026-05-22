const express = require('express')
const router = express.Router()

const EgovphModel = require('../model/egovphs')


// GET all users
router.get('/', (req, res) => {
    EgovphModel.find({})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// GET user by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    EgovphModel.findById({_id: id})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// POST create new user
router.post('/', (req, res) => {
    EgovphModel.create(req.body)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// PUT update user by ID
router.put('/:id', async (req, res) => {
    try{
        const update = await EgovphModel.findByIdAndUpdate(
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
router.delete('/:id', async ( req, res) => {
    try{
        const deleteUser = await EgovphModel.findByIdAndDelete(req.params.id)
        res.json(deleteUser)
    } catch( err ) {
        res.status(500).json(err)
    }
})
module.exports = router