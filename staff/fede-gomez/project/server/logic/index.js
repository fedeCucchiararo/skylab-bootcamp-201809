const { User, Game } = require('../data')
const { AlreadyExistsError, AuthError, NotFoundError, ValueError } = require('../errors')
const fetch = require('node-fetch');

const logic = {
    registerGame(id) {
        console.log('----', id)
        return fetch(`http://bgg-json.azurewebsites.net/thing/${id}`, {
            method: 'GET'
        })
            .then(res => res.json()) // expecting a json response
            .then(game => {
                console.log(game)
                return game
            })
    }
}


module.exports = logic