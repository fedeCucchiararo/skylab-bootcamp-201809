require('dotenv').config()
const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const mongoose = require('mongoose')
const { User, Game } = require('../data')
const logic = require('.')
const { AlreadyExistsError } = require('../errors')

const { env: { MONGO_URL } } = process

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    after(() => mongoose.disconnect())
})