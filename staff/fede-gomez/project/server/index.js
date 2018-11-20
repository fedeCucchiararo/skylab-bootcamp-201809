require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const package = require('./package.json')
const router = require('./routes')
const cors = require('./utils/cors')
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const errorHandler = require('errorhandler');

const { env: { PORT, MONGO_URL } } = process

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log(`db server running at ${MONGO_URL}`)

        const { argv: [, , port = PORT || 8080] } = process

        const app = express()

        app.use(cors)

        app.use('/api', router)

        app.listen(port, () => console.log(`${package.name} ${package.version} up and running on port ${port}`))
    })
    .catch(console.error)