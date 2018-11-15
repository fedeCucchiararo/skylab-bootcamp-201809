const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')


/**
 * Here we define the Schemas . We won't use them directly. Instead, we will use the models created based on these schemas (check models.js)
 */

const Postit = new Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    column: {
        type: String,
        default: 'todo',
        enum: ['todo', 'doing', 'review', 'done'],
        required: true
    },
    assignedTo: {
        type: ObjectId,
        ref: 'User',
        required: false
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
    buddies: [
        {
            type: ObjectId,
            ref: 'User',
            required: false
        }
    ]
})

module.exports = {
    Postit,
    User
}