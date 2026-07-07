const express = require('express')
const router = express.Router()

const IlcdbModel = require('../model/modelILCDB')


router.post("/import", async (req, res) => {
    try {
        const result = await IlcdbModel.insertMany(req.body);

        res.json({
            success: true,
            inserted: result.length
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET all users
router.get('/', (req, res) => {
    const filter = {}
    if(req.query.title){
        filter.title = req.query.title
    }
    if(req.query.TargetSectors){
        filter.TargetSectors = req.query.TargetSectors
    }
    IlcdbModel.find(filter)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// GET user by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    IlcdbModel.findById({_id: id})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// POST create new user
router.post('/', (req, res) => {
    IlcdbModel.create(req.body)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// PATCH update user by ID
router.patch('/:id', async (req, res) => {
    try{
        const update = await IlcdbModel.findByIdAndUpdate(
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
        const deleteUser = await IlcdbModel.findByIdAndDelete(req.params.id)
        res.json(deleteUser)
    } catch( err ) {
        res.status(500).json(err)
    }
})
module.exports = router