'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const GifRtr = express.Router();
const GifCtrl = require('../controllers/gifCtrl');

GifRtr.get('/', GifCtrl.GetPage);
GifRtr.post('/', GifCtrl.NewGif);
GifRtr.delete('/:id', GifCtrl.DeleteGif);

GifRtr.get('/categories/:categoryId', GifCtrl.ListGifsByCategory);

GifRtr.get('/list/:limit', GifCtrl.ListGifs);

GifRtr.get('/image/:id', GifCtrl.GetImage);

GifRtr.get('/dellist', GifCtrl.GetGifsDeleteList);

GifRtr.get('/newgif', GifCtrl.GetNewGifPage);

module.exports = GifRtr;