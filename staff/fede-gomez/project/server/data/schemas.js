const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


/**
 * Here we define the Schemas . We won't use them directly. Instead, we will use the models created based on these schemas (check models.js)
 */

const Game = new Schema({
    gameId: {
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
    designers: {
        type: Array
    }
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
    ],
    hash: {
        type: String
    },
    salt: {
        type: String
    }
})

module.exports = {
    Game,
    User
}


// Methods for the User Schema that will allow correct authentication with PassportJS

User.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

User.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === hash
}

User.methods.generateJWT = function () {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, 'secret')
}

User.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT()
    }
}