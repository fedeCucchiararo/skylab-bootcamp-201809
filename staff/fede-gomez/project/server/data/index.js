/**
 *  This file exports the models that will be used by the logic. It takes the schemas from schemas.js
 */

const mongoose = require('mongoose')

const { Game, User } = require('./schemas')

const GameModel = mongoose.model('Game', Game)
const UserModel = mongoose.model('User', User)

module.exports = {
    Game: GameModel,
    User: UserModel
}