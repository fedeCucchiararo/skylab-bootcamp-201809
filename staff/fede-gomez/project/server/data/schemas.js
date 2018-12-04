const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');


/**
 * Here we define the Schemas . We won't use them directly. Instead, we will use the models created based on these schemas (check models.js)
 */

const Game = new Schema({
    bggId: {
        type: Number,
        unique: true,
        required: true
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

// TO DO: add pictures to the game session
const Play = new Schema({
    players: [
        {
            type: ObjectId,
            ref: 'User',
            required: true
        }
    ],

    game: {
        type: ObjectId,
        ref: 'Game',
        required: true
    },

    date: {
        type: Date
    },
    notes: {
        type: String
    },
    pictures: [{
        type: String
    }]
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
    picture: {
        type: String
    },
    ownedGames: [
        {
            type: ObjectId,
            ref: 'Game',
            required: false
        }
    ],
    plays: [
        {
            type: ObjectId,
            ref: 'Play',
            required: false
        }
    ]
})


// TODO if possible

// const Mechanics = new Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     description: {
//         type: String,
//         default: 'No description for this mechanic'
//     }
// })

Game.plugin(mongoosePaginate)

module.exports = {
    Game,
    User,
    Play
}