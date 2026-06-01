const express = require('express')
const router = express.Router()

const EgovProModel = require('../model/egovpro')


// Get sum of registered users
router.get("/summary", async (req, res) => {
  try {
    const result = await EgovProModel.aggregate([
      {
        $group: {
          _id: null,
          PromotionalActivities: { $sum: 1 },
        },
      },
    ]);

    res.json({
      PromotionalActivities: result[0]?.PromotionalActivities || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    EgovProModel.find(filter)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// GET user by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    EgovProModel.findById({_id: id})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// POST create new user
router.post('/', (req, res) => {
    EgovProModel.insertMany(req.body)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// PATCH update user by ID
router.patch('/:id', async (req, res) => {
    try{
        const update = await EgovProModel.findByIdAndUpdate(
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
        const deleteUser = await EgovProModel.findByIdAndDelete(req.params.id)
        res.json(deleteUser)
    } catch( err ) {
        res.status(500).json(err)
    }
})
module.exports = router