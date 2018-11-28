const express = require('express')
const bodyParser = require('body-parser')
const logic = require('../logic')
const jwt = require('jsonwebtoken')
const bearerTokenParser = require('../utils/bearer-token-parser')
const jwtVerifier = require('./jwt-verifier')
const routeHandler = require('./route-handler')

const jsonBodyParser = bodyParser.json()

const router = express.Router()

const { env: { JWT_SECRET } } = process

router.post('/users', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { name, surname, username, password, email } = req.body

        return logic.registerUser(name, surname, username, password, email)
            .then(() => logic.sendRegisterEmail(name, email))
            .then(() => {
                res.status(201)

                res.json({
                    message: `${username} successfully registered`
                })
            })
            .catch(err =>
                res.json({
                    error: err.message
                })
            )
    }, res)
})

router.post('/auth', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { username, password } = req.body

        return logic.authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, JWT_SECRET)

                res.json({
                    data: {
                        id,
                        token
                    }
                })
            })
    }, res)
})

router.get('/users/:id', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {
        const { params: { id }, sub } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.retrieveUser(id)
            .then(user =>
                res.json({
                    data: user
                })
            )
    }, res)
})

router.patch('/users/:id', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {
    routeHandler(() => {

        const { params: { id }, sub, body: { newName, newSurname, newPassword, password, newEmail } } = req

        if (id !== sub) throw Error('token sub does not match user id')

        return logic.updateUser(id, newName ? newName : null, newSurname ? newSurname : null, newEmail ? newEmail : null, newPassword ? newPassword : null, password)
            .then(() =>
                res.json({
                    message: 'user updated'
                })
            )
    }, res)
})

router.get('/games/:id', (req, res) => {
    routeHandler(() => {
        const { id } = req.params

        return logic.getGameById(id)
            .then(game => res.json({
                data: game
            }))
    }, res)
})

router.post('/users/:userId/games/:gameId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {

        const { params: { userId, gameId }, sub } = req

        if (userId !== sub) throw Error('token sub does not match user id')
        return logic.addGameToOwnedGames(userId, gameId)
            .then(() =>

                res.json({
                    message: `game with id ${gameId} successfully added to collection`
                })
            )
    }, res)
})

router.delete('/users/:userId/games/:gameId', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {

        const { params: { userId, gameId }, sub } = req

        if (userId !== sub) throw Error('token sub does not match user id')
        return logic.removeGameFromOwnedGames(userId, gameId)
            .then(() =>

                res.json({
                    message: `game with id ${gameId} successfully removed from collection`
                })
            )
    }, res)
})

router.get('/users/:userId/games', (req, res) => {
    routeHandler(() => {


        const { userId } = req.params

        return logic.getUserOwnedGames(userId)
            .then((user) =>
                res.json({
                    data: user.ownedGames
                })
            )
    }, res)
})

router.get('/games', (req, res) => {
    routeHandler(() => {
        return logic.getAllGames()
            .then((games) =>
                res.json({
                    data: games
                })
            )
    }, res)
})

router.post('/games', [jsonBodyParser], (req, res) => {

    routeHandler(() => {

        const { bggId, name, description, image, thumbnail, minPlayers, maxPlayers, playingTime, mechanics, yearPublished, bggRating, designers } = req.body

        return logic.addNewGame({ bggId, name, description, image, thumbnail, minPlayers, maxPlayers, playingTime, mechanics, yearPublished, bggRating, designers })
            .then(() => res.json({
                message: 'game succesfully added to database'
            }))
            .catch(err => res.json({
                error: err.message
            }))
    }, res)
})

router.post('/users/:userId/sessions', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {

    routeHandler(() => {

        const { params: { userId }, sub, body: { notes, date, players, gameId } } = req

        if (userId !== sub) throw Error('token sub does not match user id')

        return logic.registerGameSession({ players, gameId, date, notes })
            .then(() =>
                res.json({
                    message: 'session registered'
                })
            )
            .catch((err) =>
                res.json({
                    err: err.message
                })
            )
    }, res)
})

/** get all the user game sessions */
router.get('/users/:userId/sessions', [bearerTokenParser, jwtVerifier], (req, res) => {

    routeHandler(() => {

        const { params: { userId }, sub } = req

        if (userId !== sub) throw Error('token sub does not match user id')

        return logic.retrieveUserSessions(userId)
            .then((sessions) =>
                res.json({
                    data: sessions
                })
            )
            .catch((err) =>
                res.json({
                    err: err.message
                })
            )
    }, res)
})

module.exports = router