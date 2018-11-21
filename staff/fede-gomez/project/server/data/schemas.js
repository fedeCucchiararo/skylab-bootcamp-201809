const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


/**
 * Here we define the Schemas . We won't use them directly. Instead, we will use the models created based on these schemas (check models.js)
 */

const Game = new Schema({
    bggId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    thumbnail: {
        type: String
    },
    minPlayers: {
        type: Number
    },
    maxPlayers: {
        type: Number
    },
    playingTime: {
        type: Number
    },
    mechanics: {
        type: Array
    },
    yearPublished: {
        type: Number
    },
    bggRating: {
        type: Number
    },
    designers: [
        {
            type: String
        }
    ]
})

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    favorites: [
        {
            type: ObjectId,
            ref: 'Game',
            required: false
        }
    ]
})

module.exports = {
    Game,
    User
}