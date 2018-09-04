'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const CategoryRtr = express.Router();
const CategoryCtrl = require('../controllers/categoryCtrl');

CategoryRtr.get('/', CategoryCtrl.ListAllCategories);

CategoryRtr.post('/', CategoryCtrl.InsertCategory);

CategoryRtr.delete('/:id', CategoryCtrl.DeleteCategory);

CategoryRtr.put('/:id', CategoryCtrl.UpdateCategory);

CategoryRtr.get('/listDiv', CategoryCtrl.RenderCategoriesList);

module.exports = CategoryRtr;