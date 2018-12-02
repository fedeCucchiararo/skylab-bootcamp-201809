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

/** get all users */
router.get('/users', (req, res) => {
    routeHandler(() => {
        
        return logic.getAllUsers()
            .then(users =>
                res.json({
                    data: users
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

        return logic.getUser(id)
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


router.get('/users/:userId/plays', [bearerTokenParser, jwtVerifier], (req, res) => {
    routeHandler(() => {

        const { params: { userId }, sub } = req
        if (userId !== sub) throw Error('token sub does not match user id')

        return logic.getUserPlays(userId)
            .then((plays) => res.json({
                data: plays
            }))
            .catch((err) =>
                res.json({
                    err: err.message
                })
            )
    }, res)
})

/**
 *  Register a game session (play) . It will also add the newly created play to every involved player (User)
 */
router.post('/users/:userId/plays', [bearerTokenParser, jwtVerifier, jsonBodyParser], (req, res) => {

    routeHandler(() => {

        const { params: { userId }, sub, body: { notes, date, players, gameId } } = req

        if (userId !== sub) throw Error('token sub does not match user id')

        return logic.registerPlay({ players, gameId, date, notes })
            .then(async (play) => {

                for (player of players) {
                    await logic.addPlayToUser(player, play.id)
                }
            })
            .then(() => res.json({
                message: 'Play succesfully saved'
            }))
            .catch((err) =>
                res.json({
                    err: err.message
                })
            )
    }, res)
})

/**
 *  Delete a game session (play) . It will also remove the play from every involved player (User)
 */
router.delete('/users/:userId/plays/:playId', [bearerTokenParser, jwtVerifier], (req, res) => {

    routeHandler(() => {

        const { params: { userId, playId }, sub } = req

        if (userId !== sub) throw Error('token sub does not match user id')

        return logic.deletePlay(playId)
            .then(async (play) => {
                debugger
                for (player of play.players) {
                    await logic.removePlayFromUser(player, playId)
                }
            })
            .then(() => res.json({
                message: 'Play succesfully deleted'
            }))
            .catch((err) =>
                res.json({
                    err: err.message
                })
            )
    }, res)
})

/** get all the user plays */
router.get('/users/:userId/plays', [bearerTokenParser, jwtVerifier], (req, res) => {

    routeHandler(() => {

        const { params: { userId }, sub } = req

        if (userId !== sub) throw Error('token sub does not match user id')

        return logic.getUserPlays(userId)
            .then((plays) =>
                res.json({
                    data: plays
                })
            )
            .catch((err) =>
                res.json({
                    err: err.message
                })
            )
    }, res)
})

router.get('/plays', (req, res) => {
    routeHandler(() => {
        return logic.getAllPlays()
            .then((plays) =>
                res.json({
                    data: plays
                })
            )
    }, res)
})

module.exports = router