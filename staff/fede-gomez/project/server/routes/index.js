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

router.get('/games/:id', jsonBodyParser, (req, res) => {
    routeHandler(() => {
        const { id } = req.params
        logic.registerGame(id)
    }, res)
})

module.exports = router