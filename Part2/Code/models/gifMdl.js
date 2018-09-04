'use strict';

const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const GifSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    category: {
        type: Schema.Types.Number,
        ref: 'Category',
        required: true
    },
    rating: {
        type: [{
            type: String,
            enum: ['Y', 'G', 'PG', 'PG-13', 'R'],
            required: true
        }],
        default: ['G']
    },
    tags: [{
        type: String,
        lowercase: true,
        trim: true,
        required: true
    }],
    image: {
        type: Buffer
    },
    contentType: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

let GifMdl = mongoose.model('Gif', GifSchema);

module.exports = GifMdl;