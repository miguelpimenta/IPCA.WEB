'use strict';
'esversion: 6';

const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const CategorySchema = mongoose.Schema({
    _id: new Schema.Types.Number(),
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

CategorySchema.plugin(autoIncrement.plugin, {
    model: 'Category',
    field: '_id',
    startAt: 1,
    incrementBy: 1
});

let CategoryMdl = mongoose.model('Category', CategorySchema);

module.exports = CategoryMdl;