const express = require('express')
const router = express.Router()

const UserModel = require('../model/users')


// GET all users
router.get('/', (req, res) => {
    UserModel.find({})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// GET user by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    UserModel.findById({_id: id})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// POST create new user
router.post('/', (req, res) => {
    UserModel.create(req.body)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// PUT update user by ID
router.put('/:id', async (req, res) => {
    try{
        const update = await UserModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        )
        res.json(update)
    } catch(err) {
        res.status(500).json(err)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await UserModel.findByIdAndDelete(req.params.id);

        console.log("DELETED:", deleted);

        if (!deleted) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json(deleted);

    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router