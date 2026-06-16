const express = require('express')
const router = express.Router()

const modelegovphs = require('../model/modelegovph')


// GET all wifis
router.get('/', (req, res) => {
    modelegovphs.find({})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// GET wifi by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    modelegovphs.findById({_id: id})
    .then( wifis => res.json(wifis))
    .catch( err => res.status(500).json(err))
})

// POST create new wifi
router.post('/', (req, res) => {
    modelegovphs.create(req.body)
    .then( wifis => res.json(wifis))
    .catch( err => res.status(500).json(err))
})

// PATCH update wifi by ID
router.patch('/:id', async (req, res) => {
    try{
        const update = await modelegovphs.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        )
        res.json(update)
    } catch(err) {
        res.status(500).json(err)
    }
})

// DELETE wifi by ID
router.delete('/:id', async ( req, res) => {
    try{
        const deleteUser = await modelegovphs.findByIdAndDelete(req.params.id)
        res.json(deleteUser)
    } catch( err ) {
        res.status(500).json(err)
    }
})
module.exports = router