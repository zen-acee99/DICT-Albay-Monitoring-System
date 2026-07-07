const express = require('express')
const router = express.Router()

const WifiModel = require('../model/wifi')


router.post("/import", async (req, res) => {
    try {
        const result = await WifiModel.insertMany(req.body);

        res.json({
            success: true,
            inserted: result.length
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET all wifis
router.get('/', (req, res) => {
    WifiModel.find({})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// GET wifi by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    WifiModel.findById({_id: id})
    .then( wifis => res.json(wifis))
    .catch( err => res.status(500).json(err))
})

// POST create new wifi
router.post('/', (req, res) => {
    WifiModel.create(req.body)
    .then( wifis => res.json(wifis))
    .catch( err => res.status(500).json(err))
})

// PATCH update wifi by ID
router.patch('/:id', async (req, res) => {
    try{
        const update = await WifiModel.findByIdAndUpdate(
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
        const deleteUser = await WifiModel.findByIdAndDelete(req.params.id)
        res.json(deleteUser)
    } catch( err ) {
        res.status(500).json(err)
    }
})
module.exports = router