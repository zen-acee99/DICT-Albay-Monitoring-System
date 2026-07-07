const express = require('express')
const router = express.Router()

const OperationalModel = require('../model/operational')


router.post("/import", async (req, res) => {
    try {
        const result = await OperationalModel.insertMany(req.body);

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
    if(req.query.status){
        filter.status = req.query.status
    }
    if(req.query.version){
        filter.version = req.query.version
    }
    OperationalModel.find(filter)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// GET user by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    OperationalModel.findById({_id: id})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// POST create new user
router.post('/', (req, res) => {
    OperationalModel.create(req.body)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// PATCH update user by ID
router.patch('/:id', async (req, res) => {
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
router.delete('/:id', async ( req, res) => {
    try{
        const deleteUser = await OperationalModel.findByIdAndDelete(req.params.id)
        res.json(deleteUser)
    } catch( err ) {
        res.status(500).json(err)
    }
})
module.exports = router