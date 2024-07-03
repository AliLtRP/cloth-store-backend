const express = require('express');
const { createCategory, getCategory, updateCategory, getAllCategory } = require('../models/categoryToProduct');
const router = express.Router();

// get specific category by id
router.get('/category', getCategory);

// get all categories
router.get('/all/category', getAllCategory);

// create category
router.post('/category', createCategory);

// update category 
router.patch('/category', updateCategory);