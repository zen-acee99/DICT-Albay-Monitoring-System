const express = require('express')
const router = express.Router()

const PnpkiModel = require('../model/modalPNPKI')

router.post("/import", async (req, res) => {
    try {
        const result = await PnpkiModel.insertMany(req.body);

        res.json({
            success: true,
            inserted: result.length
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET all pnpki
router.get('/', (req, res) => {
    PnpkiModel.find({})
    .then( pnpki => res.json(pnpki))
    .catch( err => res.status(500).json(err))
})

// GET wifi by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    PnpkiModel.findById({_id: id})
    .then( pnpki => res.json(pnpki))
    .catch( err => res.status(500).json(err))
})

// POST create new wifi
router.post('/', (req, res) => {
    PnpkiModel.create(req.body)
    .then( pnpki => res.json(pnpki))
    .catch( err => res.status(500).json(err))
})

// PATCH update wifi by ID
router.patch('/:id', async (req, res) => {
    try{
        const update = await PnpkiModel.findByIdAndUpdate(
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
        const deleteData = await PnpkiModel.findByIdAndDelete(req.params.id)
        res.json(deleteData)
    } catch( err ) {
        res.status(500).json(err)
    }
})
module.exports = router