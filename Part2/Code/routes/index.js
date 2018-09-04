'use strict';
var express = require('express');
var IndexRtr = express.Router();
const Category = require('../models/categoryMdl');

IndexRtr.get('/', function(req, res) {
    Category.find(function(err, categories) {
        if (err) {
            res.send(err);
        } else {
            res.render('index', { title: 'Gifs Everywhere' });
        }
    });
});

module.exports = IndexRtr;