'use strict';
const Category = require('../models/categoryMdl');
const express = require('express');

exports.ListAllCategories = (req, res) => {
    return new Promise(function(resolve, reject) {
        Category.find({}, function(err, categories) {
            if (err) {
                reject(
                    console.log('Error @ListAllCategories: ' + err),
                    res.status(401),
                    res.json({ message: 'Something failed...' }));
            } else {
                resolve(
                    res.status(200),
                    res.send(categories).json()
                );
            }
        });
    });
};

exports.InsertCategory = (req, res) => {
    if (!req.body.name) {
        console.log('Category Name empty');
        res.status(400);
        res.json({ message: 'Category Name is empty.' });
    } else {
        return new Promise(function(resolve, reject) {
            let body = req.body;
            Category.create({
                    name: body.name,
                    description: body.description
                }).then(() => {
                    res.status(200);
                    res.json({ message: 'Category inserted successfully.' });
                })
                .catch((err) => {
                    console.log('Error @InsertCategory: ' + err);
                    res.status(401);
                    res.json({ message: 'Something failed...' });
                });
        });
    }
};

exports.DeleteCategory = (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id)
        .then(category => {
            if (!category) {
                console.log("Not found in DB");
                res.status(404);
                res.json({ message: "Id: " + id + " not found in DB" });
            } else {
                console.log('Deleted Category with Id: ' + id);
                res.status(200);
                res.json({ message: 'Deleted Category with Id: ' + id });
            }
        }).catch(err => {
            console.log('Error @DeleteCategory: ' + err);
            err.status = err.status || 500;
            res.status(401);
            res.json({ message: err });
        });
};

exports.UpdateCategory = (req, res) => {
    let id = req.params.id;
    if (!req.body.name) {
        console.log('Category Name is empty');
        res.json({ message: 'Category Name is empty.' });
        res.status(400);
        return res;
    }
    Category.findByIdAndUpdate(id, {
            name: req.body.name,
            description: req.body.description || '-empty-'
        })
        .then(category => {
            if (!category) {
                console.log("Not found in DB");
                res.json({ message: "Id: " + id + " not found in DB" });
                res.status(404);
            } else {
                console.log('Updated Category with Id: ' + id);
                res.json({ message: 'Updated Category with Id: ' + id });
                res.status(200);
            }
        }).catch(err => {
            console.log('Error @UpdateCategory: ' + err);
            res.json({ message: err });
            err.status = err.status || 500;
            res.status(401);
        });
};

exports.RenderCategoriesList = (req, res) => {
    Category.find(function(err, categories) {
        if (err) {
            console.log('Error @RenderCategoriesList: ' + err);
            res.json({ message: "Something failed..." });
            res.status(404);
        } else {
            res.status(200);
            res.render('categories', { categories: categories });
        }
    });
};