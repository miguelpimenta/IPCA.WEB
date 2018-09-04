'use strict';
const Gif = require('../models/gifMdl');
const Category = require('../models/categoryMdl');
const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const form = new formidable.IncomingForm();
form.keepExtensions = false;
form.maxFieldsSize = 2 * 1024 * 1024;

exports.GetPage = (req, res) => {
    Gif.find(function(err, gifs) {
        if (err) {
            res.render('error', { message: err.message, error: err });
        } else {
            try {
                Category.find(function(err, categories) {
                    if (err) {
                        res.render('error', { message: err.message, error: err });
                    } else {
                        res.render('gif', { title: 'Gifs Everywhere', categories: categories });
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    });
};

exports.NewGif = (req, res) => {
    try {
        form.parse(req, function(err, fields, files) {
            Gif.create({
                name: fields.name,
                description: fields.description,
                category: fields.category,
                rating: fields.rating,
                tags: fields.tags.split(";"),
                image: new Buffer(fs.readFileSync(files.image.path), 'base64'),
                contentType: files.image.type
            }).then(() => {
                console.log('Saved to DB - Redirect to Home');
                res.status(200);
                res.redirect('/');
            }).catch((err) => {
                console.log('Error @NewGif: ' + err);
                res.status(401);
                res.json({ message: 'Something failed...' });
            });
        });
    } catch (err) {
        console.log('Error @NewGif: ' + err);
        res.status(401);
        res.json({ message: 'Something failed...' });
    }
};

exports.DeleteGif = (req, res) => {

    var id = req.params.id;
    console.log("Del Gif");
    Gif.findById(id, function(err, gif) {
        if (gif == undefined) {
            console.log("Not found in DB");
            res.status(404);
            res.json({ message: "Id: " + id + " not found in DB" });
        } else {
            Gif.remove({ _id: id })
                .then(() => {
                    console.log('Deleted Gif with Id: ' + id);
                    res.status(200);
                    res.json({ message: "Deleted Gif with Id: " + id });
                })
                .catch((err) => {
                    console.log('Error @DeleteGif: ' + err);
                    res.status(401);
                    res.json({ message: 'Something failed...' });
                });
        }
    });
};

exports.ListGifsByCategory = (req, res) => {
    Gif.find({ category: parseInt(req.params.categoryId) }, function(err, gifs) {
        if (err) {
            console.log('Error');
            res.json({ message: err });
            err.status = err.status || 500;
            res.status(401);
            res.render('error', { message: err.message, error: err });
        } else {
            try {
                console.log("Send Gifs list");
                res.json({ gifs: gifs });
            } catch (err) {
                console.log(err);
            }
        }
    });
};

exports.ListGifs = (req, res) => {
    let limit = req.params.limit;
    /* var ignoreFields = {
        __v: false,
        description: false,
        createdDate: false,
        image: false,
        url: false,
        contentType: false
    }; */
    let query = Gif.find().sort({ $natural: -1 }).limit(parseInt(limit)).select('_id').select('name').select('tags');
    query.exec(function(err, gifs) {
        if (err) {
            console.log(err);
            res.render('error', { message: err.message, error: err });
        } else {
            try {
                console.log("Send Gifs");
                res.json({ gifs: gifs });
                res.status(200);
                console.log("Sended");
            } catch (err) {
                console.log(err);
            }
        }
    });
};

exports.GetImage = (req, res) => {
    let id = req.params.id;
    let query = Gif.findOne({ '_id': id }).select('image');
    Gif.findOne(query, function(err, result) {
        if (result.image != null) {
            let filename = './public/img/gifs/' + id + '.gif';
            if (!fs.existsSync(filename)) {
                let writeStream = fs.createWriteStream(filename);
                writeStream.write(result.image);
                writeStream.on('finish', () => {
                    console.log('Wrote data to ' + filename);
                });
                writeStream.end();
            }
            res.send(filename.substring('./public/'.length));
        }
    });
};

exports.GetGifsDeleteList = (req, res) => {
    let query = Gif.find().sort({ $natural: -1 }).select('_id').select('name').select('tags');
    query.exec(function(err, gifs) {
        if (err) {
            console.log(err);
            res.render('error', { message: err.message, error: err });
        } else {
            try {
                console.log("Send Delete Gifs List");
                res.status(200);
                res.render('delgif', { gifs: gifs });
            } catch (err) {
                console.log(err);
            }
        }
    });
};

exports.GetNewGifPage = (req, res) => {
    Category.find(function(err, categories) {
        if (err) {
            res.render('error', { message: err.message, error: err });
        } else {
            res.render('newgif', { categories: categories });
        }
    });
}

exports.GifSearch = (req, res) => {
    //http://localhost:3000/gyphys/categories/2/G/sport
    let catId = req.params.categoryId;
    let ratingId = req.params.ratingId;
    let search = req.params.search;
    //Gif.find({ category: req.params.id, image: { $ne: null } }, ignoreFields, function(err, gifs) {
    Gif.find({ category: catId, rating: ratingId, tags: { "$in": [search] } }, function(err, gifs) {
        if (err) {
            res.render('error', { message: err.message, error: err });
        } else {
            try {
                console.log("Send Gifs");
                console.log(gifs);
                res.json({ gifs: gifs });
                console.log("Sended--");
            } catch (err) {
                console.log(err);
            }
        }
    });
}