const express = require('express')
const router = express.Router()

const EgovActModel = require('../model/egovact')


// Get sum of registered users
router.get("/summary", async (req, res) => {
  try {
    const result = await EgovActModel.aggregate([
      {
        $group: {
          _id: null,
          ConductedActivities: { $sum: 1 },
          TechnicalAssistance: { $sum: 1 },
        },
      },
    ]);

    res.json({
      ConductedActivities: result[0]?.ConductedActivities || 0,
      TechnicalAssistance: result[0]?.TechnicalAssistance || 0,
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
    EgovActModel.find(filter)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// GET user by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    EgovActModel.findById({_id: id})
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// POST create new user
router.post('/', (req, res) => {
    EgovActModel.insertMany(req.body)
    .then( users => res.json(users))
    .catch( err => res.status(500).json(err))
})

// PATCH update user by ID
router.patch('/:id', async (req, res) => {
    try{
        const update = await EgovActModel.findByIdAndUpdate(
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
        const deleteUser = await EgovActModel.findByIdAndDelete(req.params.id)
        res.json(deleteUser)
    } catch( err ) {
        res.status(500).json(err)
    }
})
module.exports = router