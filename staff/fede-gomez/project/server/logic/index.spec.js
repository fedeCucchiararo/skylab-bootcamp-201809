require('dotenv').config()
const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const mongoose = require('mongoose')
const { User, Game, gameSession } = require('../data')
const logic = require('.')
const { AlreadyExistsError } = require('../errors')

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {

    // Connect to MongoDB to perform tests
    before(() => mongoose.connect('mongodb://localhost:27017/project-tests', { useNewUrlParser: true }))

    // Remove any data from the Database before any test
    beforeEach(() => User.deleteMany())
    beforeEach(() => Game.deleteMany())


    // ----------------------------------
    // Let's test the user-related logic
    // ----------------------------------
    describe('user', () => {

        // Test the register function from logic
        describe('register', () => {
            let name, surname, username, password, email

            // Use random-generated data
            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
                email = `${Math.random()}@mail.com`
            })


            it('should succeed on correct data', () =>
                // Call the logic to register new user
                logic.registerUser(name, surname, username, password, email)
                    // call db to retrieve all the users therein (there should be only one)
                    .then(() => User.find())
                    .then(_users => {

                        expect(_users.length).to.equal(1)

                        const [user] = _users

                        expect(user.id).to.be.a('string')
                        expect(user.name).to.equal(name)
                        expect(user.surname).to.equal(surname)
                        expect(user.username).to.equal(username)
                        expect(user.password).to.equal(password)
                        expect(user.email).to.equal(email)
                    })
            )

            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, surname, username, password, email)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases for Register
        })

        describe('authenticate', () => {
            let user

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'fede@mail.com', favorites: [] })

                return User.create(user)
            })

            it('should authenticate on correct credentials', () => {
                const { username, password } = user

                return logic.authenticateUser(username, password)
                    .then(id => {
                        expect(id).to.exist
                        expect(id).to.be.a('string')

                        return User.find()
                            .then(_users => {

                                const [_user] = _users

                                expect(_user.id).to.equal(id)
                            })
                    })

            })


            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test for Authenticate
        })

        describe('retrieve', () => {
            let user, game

            beforeEach(() => {
                game = new Game({
                    "bggId": 31260,
                    "name": "Agricola",
                    "description": "In Agricola, you're a farmer in a wooden shack with your spouse and little else. On a turn, you get to take only two actions, one for you and one for the spouse, from all the possibilities you'll find on a farm: collecting clay, wood, or stone; building fences; and so on. You might think about having kids in order to get more work accomplished, but first you need to expand your house. And what are you going to feed all the little rugrats?",
                    "image": "https://cf.geekdo-images.com/imagepage/img/lz9lR3hs-27immcniEQ4fsYJ7EM=/fit-in/900x600/filters:no_upscale()/pic259085.jpg",
                    "thumbnail": "https://cf.geekdo-images.com/imagepage/img/lz9lR3hs-27immcniEQ4fsYJ7EM=/fit-in/900x600/filters:no_upscale()/pic259085.jpg",
                    "minPlayers": 1,
                    "maxPlayers": 5,
                    "playingTime": 150,
                    "mechanics": [
                        "Area Enclosure",
                        "Card Drafting",
                        "Hand Management",
                        "Variable Player Powers",
                        "Worker Placement"
                    ],
                    "yearPublished": 2007,
                    "bggRating": 8,
                    "designers": [
                        "Uwe Rosenberg"
                    ]
                })
                user = new User({
                    name: 'John',
                    surname: 'Doe',
                    username: 'jd',
                    password: '123',
                    email: 'fede@mail.com',
                    favorites: [game.id.toString()]
                })

                return Promise.all([user.save(), game.save()])
            })

            it('should succeed on valid id', () => {
                const { username, password } = user

                logic.retrieveUser(user.id)
                    .then(_user => {

                        expect(_user).not.to.be.instanceof(User)

                        const { id, name, surname, username, password, email, favorites } = _user

                        expect(id).to.exist
                        expect(id).to.equal(user.id)
                        expect(name).to.equal(user.name)
                        expect(surname).to.equal(user.surname)
                        expect(username).to.equal(user.username)
                        expect(email).to.equal(user.email)
                        expect(favorites[0]).to.equal(user.favorites[0].toString())
                        expect(password).to.be.undefined
                    })
            })
        })

        describe('update', () => {
            let user

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'fede@maill.com' })
                return user.save()

            })

            it('should update on correct data and password', () => {
                let { id, name, surname, email, password } = user

                const newName = `${name}-${Math.random()}`
                const newSurname = `${surname}-${Math.random()}`
                const newEmail = `${email}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`

                return logic.updateUser(id, newName, newSurname, newEmail, newPassword, password)
                    .then(() => User.find())
                    .then(_users => {
                        const [_user] = _users

                        expect(_user.id).to.equal(id)

                        const { name, surname, email, password } = _user

                        expect(name).to.equal(newName)
                        expect(surname).to.equal(newSurname)
                        expect(email).to.equal(newEmail)
                        expect(password).to.equal(newPassword)
                    })
            })

            it('should update on correct id, newName and password (other fields null)', () => {
                const { id, name, surname, email, password } = user

                const newName = `${name}-${Math.random()}`

                return logic.updateUser(id, newName, null, null, null, password)
                    .then(() => User.find())
                    .then(_users => {
                        const [_user] = _users

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(newName)
                        expect(_user.surname).to.equal(surname)
                        expect(_user.email).to.equal(email)
                        expect(_user.password).to.equal(password)
                    })
            })

            it('should update on correct id, surname and password (other fields null)', () => {
                const { id, name, surname, email, password } = user

                const newSurname = `${surname}-${Math.random()}`

                return logic.updateUser(id, null, newSurname, null, null, password)
                    .then(() => User.find())
                    .then(_users => {
                        const [_user] = _users

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(name)
                        expect(_user.surname).to.equal(newSurname)
                        expect(_user.email).to.equal(email)
                        expect(_user.password).to.equal(password)
                    })
            })

            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {
                const { id, name, surname, email, password } = user

                expect(() => logic.updateUser(undefined, name, surname, email, password, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases

        })

    })

    // ----------------------------------
    // Let's test the user-related logic
    // ----------------------------------
    describe('game', () => {

        describe('getGameById', () => {

            let game

            beforeEach(() => {

                // create a new game that will be saved to the database
                game = new Game({
                    "bggId": 31260,
                    "name": "Agricola",
                    "description": "In Agricola, you're a farmer in a wooden shack with your spouse and little else. On a turn, you get to take only two actions, one for you and one for the spouse, from all the possibilities you'll find on a farm: collecting clay, wood, or stone; building fences; and so on. You might think about having kids in order to get more work accomplished, but first you need to expand your house. And what are you going to feed all the little rugrats?",
                    "image": "https://cf.geekdo-images.com/imagepage/img/lz9lR3hs-27immcniEQ4fsYJ7EM=/fit-in/900x600/filters:no_upscale()/pic259085.jpg",
                    "thumbnail": "https://cf.geekdo-images.com/imagepage/img/lz9lR3hs-27immcniEQ4fsYJ7EM=/fit-in/900x600/filters:no_upscale()/pic259085.jpg",
                    "minPlayers": 1,
                    "maxPlayers": 5,
                    "playingTime": 150,
                    "mechanics": [
                        "Area Enclosure",
                        "Card Drafting",
                        "Hand Management",
                        "Variable Player Powers",
                        "Worker Placement"
                    ],
                    "yearPublished": 2007,
                    "bggRating": 8,
                    "designers": [
                        "Uwe Rosenberg"
                    ]
                })

                return game.save()
            })

            it('should succeed on correct id', () => {

                // Test some properties of the object
                const { id, bggId, name, description, image, mechanics, designers } = game

                logic.getGameById(id)
                    .then(foundGame => {
                        expect(foundGame).not.to.be.instanceof(Game)
                        expect(foundGame.id).to.equal(id.toString())
                        expect(foundGame.bggId).to.equal(bggId)
                        expect(foundGame.name).to.equal(name)
                        expect(foundGame.description).to.equal(description)
                        expect(foundGame.image).to.equal(image)
                        expect(foundGame.mechanics).to.be.an('array')
                        expect(foundGame.mechanics).to.contain('Area Enclosure')
                        expect(foundGame.designers).to.be.an('array')
                        expect(foundGame.designers).to.contain('Uwe Rosenberg')
                    })
            })
        })

        describe('addGameToFavorites', () => {

            let user, game

            beforeEach(() => {

                // create a new game that will be saved to the database
                game = new Game({
                    "bggId": 31260,
                    "name": "Agricola",
                    "description": "In Agricola, you're a farmer in a wooden shack with your spouse and little else. On a turn, you get to take only two actions, one for you and one for the spouse, from all the possibilities you'll find on a farm: collecting clay, wood, or stone; building fences; and so on. You might think about having kids in order to get more work accomplished, but first you need to expand your house. And what are you going to feed all the little rugrats?",
                    "image": "https://cf.geekdo-images.com/imagepage/img/lz9lR3hs-27immcniEQ4fsYJ7EM=/fit-in/900x600/filters:no_upscale()/pic259085.jpg",
                    "thumbnail": "https://cf.geekdo-images.com/imagepage/img/lz9lR3hs-27immcniEQ4fsYJ7EM=/fit-in/900x600/filters:no_upscale()/pic259085.jpg",
                    "minPlayers": 1,
                    "maxPlayers": 5,
                    "playingTime": 150,
                    "mechanics": [
                        "Area Enclosure",
                        "Card Drafting",
                        "Hand Management",
                        "Variable Player Powers",
                        "Worker Placement"
                    ],
                    "yearPublished": 2007,
                    "bggRating": 8,
                    "designers": [
                        "Uwe Rosenberg"
                    ]
                })

                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'fede@maill.com' })

                return Promise.all([game.save(), user.save()])
            })

            it('should successfully add a game to user favorites', async () => {
                let userId = user.id
                let gameId = game.id
                await logic.addGameToFavorites(userId, gameId)
                let modifiedUser = await User.findById(userId)
                expect(modifiedUser.favorites).to.be.an('array').that.includes(game.id)
            })
        })

        describe('removeGameFromFavorites', () => {

            let user, game

            beforeEach(() => {

                // create a new game that will be saved to the database
                game = new Game({
                    "bggId": 31260,
                    "name": "Agricola",
                    "description": "In Agricola, you're a farmer in a wooden shack with your spouse and little else. On a turn, you get to take only two actions, one for you and one for the spouse, from all the possibilities you'll find on a farm: collecting clay, wood, or stone; building fences; and so on. You might think about having kids in order to get more work accomplished, but first you need to expand your house. And what are you going to feed all the little rugrats?",
                    "image": "https://cf.geekdo-images.com/imagepage/img/lz9lR3hs-27immcniEQ4fsYJ7EM=/fit-in/900x600/filters:no_upscale()/pic259085.jpg",
                    "thumbnail": "https://cf.geekdo-images.com/imagepage/img/lz9lR3hs-27immcniEQ4fsYJ7EM=/fit-in/900x600/filters:no_upscale()/pic259085.jpg",
                    "minPlayers": 1,
                    "maxPlayers": 5,
                    "playingTime": 150,
                    "mechanics": [
                        "Area Enclosure",
                        "Card Drafting",
                        "Hand Management",
                        "Variable Player Powers",
                        "Worker Placement"
                    ],
                    "yearPublished": 2007,
                    "bggRating": 8,
                    "designers": [
                        "Uwe Rosenberg"
                    ]
                })

                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'fede@maill.com', favorites: [game.id] })

                return Promise.all([game.save(), user.save()])
            })

            it('should successfully remove a game from user favorites', async () => {
                let userId = user.id
                let gameId = game.id
                await logic.removeGameFromFavorites(userId, gameId)
                let modifiedUser = await User.findById(userId)
                expect(modifiedUser.favorites).to.be.an('array').that.does.not.include(game.id)
            })
        })
    })

    after(() => mongoose.disconnect())
})