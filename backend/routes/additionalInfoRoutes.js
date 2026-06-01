const express = require('express')
const router = express.Router()

const AdditionalInfoModel = require('../model/additionalInfo')

router.get('/location/:location', async (req, res) => {

  try {

    const location = decodeURIComponent(req.params.location);

    console.log("Searching for:", location);

    const data = await AdditionalInfoModel.find({
      location: location
    });

    console.log("Found:", data.length);

    res.json(data);

  } catch (err) {

    console.error(err);

    res.status(500).json(err);

  }

});

// GET all additional info
router.get('/', (req, res) => {
    AdditionalInfoModel.find({})
    .then( additionalInfo => res.json(additionalInfo))
    .catch( err => res.status(500).json(err))
})

// GET additional info by ID
router.get('/:id', (req, res) => {
    const id = req.params.id
    AdditionalInfoModel.findById({_id: id})
    .then( additionalInfo => res.json(additionalInfo))
    .catch( err => res.status(500).json(err))
})

// POST create new additional info
router.post('/', (req, res) => {
    AdditionalInfoModel.create(req.body)
    .then( additionalInfo => res.json(additionalInfo))
    .catch( err => res.status(500).json(err))
})

// PUT update additional info by ID
router.put('/:id', async (req, res) => {
    try{
        const update = await AdditionalInfoModel.findByIdAndUpdate(
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
        const deleted = await AdditionalInfoModel.findByIdAndDelete(req.params.id);

        console.log("DELETED:", deleted);

        if (!deleted) {
            return res.status(404).json({ message: "Additional info not found" });
        }

        return res.json(deleted);

    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router



