const express = require('express')
const router = express.Router()

const EgovphModel = require('../model/egovphs')

// Get sum of registered users
router.get('/total-registered-users', async (req, res) => {
  try {
    const result = await EgovphModel.aggregate([
      {
        $group: {
          _id: null,   // ✅ MUST be _id, not id
          totalRegisteredUsers: {
            $sum: "$registeredUsers"
          }
        }
      }
    ]);

    res.json({
      total: result[0]?.totalRegisteredUsers || 0
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/chart/by-province", async (req, res) => {
  try {
    const result = await EgovphModel.aggregate([
      {
        $group: {
          _id: "$Province",
          value: { $sum: "$registeredUsers" }
        }
      },
      { $sort: { value: -1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET users per municipality
router.get('/user-per-municipality', async (req, res) => {
  try {
    const result = await EgovphModel.find({}, {
      Province: 1,
      registeredUsers: 1,
      _id: 0
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET all users
router.get('/', (req, res) => {

    const filter = {}

    if(req.query.municipalities){
        filter.municipalities = req.query.municipalities        
    }
    if(req.query.Province) {
        filter.Province = req.query.Province
    }

    EgovphModel.find(filter)
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