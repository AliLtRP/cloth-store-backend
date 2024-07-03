const express = require('express');
const { createCategory, getCategory, updateCategory, getAllCategory, deleteCategory } = require('../models/category');
const router = express.Router();

// get specific category by id
router.get('/', getCategory);

// get all categories
router.get('/all', getAllCategory);

// create category
router.post('/', createCategory);

// update category 
router.put('/', updateCategory);

// soft delete category 
router.delete('/', deleteCategory);

module.exports = router