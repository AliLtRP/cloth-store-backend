const express = require('express');
const { createCategory, getCategory, updateCategory, getAllCategory } = require('../models/category');
const router = express.Router();

// get specific category by id
router.get('/', getCategory);

// get all categories
router.get('/all', getAllCategory);

// create category
router.post('/', createCategory);

// update category 
router.patch('/', updateCategory);

// soft delete category 
router.delete('/', updateCategory);

module.exports = router