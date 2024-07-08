const express = require('express');
const { createRating, getRating, getAllRating, updateRating, deleteRating } = require('../models/rating');
const router = express.Router();


router.get('/', getRating);
router.post('/', createRating);
router.get('/all', getAllRating);
router.put('/update', updateRating);
router.delete('/delete', deleteRating);


module.exports = router;