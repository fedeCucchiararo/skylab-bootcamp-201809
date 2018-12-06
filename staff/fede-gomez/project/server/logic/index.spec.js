require('dotenv').config()
const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const mongoose = require('mongoose')
const { User, Game, Play } = require('../data')
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
    beforeEach(() => Play.deleteMany())


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

            /** test undefined arguments */
            it('should fail on undefined name', () => {
                return logic.registerUser(undefined, surname, username, password, email)
                    .catch(err => expect(err.message).to.equal('undefined is not a string'))
            })

            it('should fail on undefined surname', () => {
                return logic.registerUser(name, undefined, username, password, email)
                    .catch(err => expect(err.message).to.equal('undefined is not a string'))
            })

            it('should fail on undefined username', () => {
                return logic.registerUser(name, surname, undefined, password, email)
                    .catch(err => expect(err.message).to.equal('undefined is not a string'))
            })

            it('should fail on undefined password', () => {
                return logic.registerUser(name, surname, username, undefined, email)
                    .catch(err => expect(err.message).to.equal('password is not a string'))
            })

            it('should fail on undefined email', () => {
                return logic.registerUser(name, surname, username, password, undefined)
                    .catch(err => expect(err.message).to.equal('undefined is not a string'))
            })

            /** test empty string arguments */
            it('should fail on empty name', () => {
                return logic.registerUser('', surname, username, password, email)
                    .catch(err => expect(err.message).to.equal('name is empty or blank'))
            })

            it('should fail on empty surname', () => {
                return logic.registerUser(name, '', username, password, email)
                    .catch(err => expect(err.message).to.equal('surname is empty or blank'))
            })

            it('should fail on empty username', () => {
                return logic.registerUser(name, surname, '', password, email)
                    .catch(err => expect(err.message).to.equal('username is empty or blank'))
            })

            it('should fail on empty password', () => {
                return logic.registerUser(name, surname, username, '', email)
                    .catch(err => expect(err.message).to.equal('password is empty or blank'))
            })

            it('should fail on empty email', () => {
                return logic.registerUser(name, surname, username, password, '')
                    .catch(err => expect(err.message).to.equal('email is empty or blank'))
            })

            /** test blank string arguments */
            it('should fail on blank name', () => {
                return logic.registerUser('\n\t   \n', surname, username, password, email)
                    .catch(err => expect(err.message).to.equal('name is empty or blank'))
            })

            it('should fail on blank surname', () => {
                return logic.registerUser(name, '\n\t   \n', username, password, email)
                    .catch(err => expect(err.message).to.equal('surname is empty or blank'))
            })

            it('should fail on blank username', () => {
                return logic.registerUser(name, surname, '\n\t   \n', password, email)
                    .catch(err => expect(err.message).to.equal('username is empty or blank'))
            })

            it('should fail on blank password', () => {
                return logic.registerUser(name, surname, username, '\n\t   \n', email)
                    .catch(err => expect(err.message).to.equal('password is empty or blank'))
            })

            it('should fail on blank email', () => {
                return logic.registerUser(name, surname, username, password, '\n\t   \n')
                    .catch(err => expect(err.message).to.equal('email is empty or blank'))
            })


            // TODO other test cases for Register
        })

        describe('authenticate', () => {
            let user

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'fede@mail.com', ownedGames: [] })

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


            /** test undefined arguments */
            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on undefined password', () => {
                expect(() => logic.authenticateUser(user.username, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            /** test null arguments */
            it('should fail on null username', () => {
                expect(() => logic.authenticateUser(null, user.password)).to.throw(TypeError, 'null is not a string')
            })

            it('should fail on null password', () => {
                expect(() => logic.authenticateUser(user.username, null)).to.throw(TypeError, 'null is not a string')
            })

            /** test array-type arguments */
            it('should fail on username of type Array', () => {
                expect(() => logic.authenticateUser([1, 2, 3], user.password)).to.throw(TypeError, '1,2,3 is not a string')
            })

            it('should fail on password of type Array', () => {
                expect(() => logic.authenticateUser(user.username, [1, 2, 3])).to.throw(TypeError, '1,2,3 is not a string')
            })

            /** test object-type arguments */
            it('should fail on username of type Array', () => {
                expect(() => logic.authenticateUser({ a: 1, b: 2 }, user.password)).to.throw(TypeError, '[object Object] is not a string')
            })

            it('should fail on password of type Array', () => {
                expect(() => logic.authenticateUser(user.username, { a: 1, b: 2 })).to.throw(TypeError, '[object Object] is not a string')
            })

            /** test boolean-type arguments */
            it('should fail on boolean username', () => {
                expect(() => logic.authenticateUser(true, user.password)).to.throw(TypeError, 'true is not a string')
            })

            it('should fail on boolean password', () => {
                expect(() => logic.authenticateUser(user.username, true)).to.throw(TypeError, 'true is not a string')
            })

            /** test numeric arguments */
            it('should fail on numeric username', () => {
                expect(() => logic.authenticateUser(123, user.password)).to.throw(TypeError, '123 is not a string')
            })

            it('should fail on numeric password', () => {
                expect(() => logic.authenticateUser(user.username, 123)).to.throw(TypeError, '123 is not a string')
            })
            // TODO other test for Authenticate
        })

        describe('getUser', () => {
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
                    ownedGames: [game.id.toString()]
                })

                return Promise.all([user.save(), game.save()])
            })

            it('should succeed on valid id', () => {
                const { username, password } = user

                logic.getUser(user.id)
                    .then(_user => {

                        expect(_user).not.to.be.instanceof(User)

                        const { id, name, surname, username, password, email, ownedGames } = _user

                        expect(id).to.exist
                        expect(id).to.equal(user.id)
                        expect(name).to.equal(user.name)
                        expect(surname).to.equal(user.surname)
                        expect(username).to.equal(user.username)
                        expect(email).to.equal(user.email)
                        expect(ownedGames[0]).to.equal(user.ownedGames[0].toString())
                        expect(password).to.be.undefined
                    })
            })

            /** check undefined id */
            it('should fail on undefined id', () => {
                expect(() => logic.getUser(undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            /** check null id */
            it('should fail on null id', () => {
                expect(() => logic.getUser(null)).to.throw(TypeError, 'null is not a string')
            })

            /** check boolean id */
            it('should fail on boolean id', () => {
                expect(() => logic.getUser(true)).to.throw(TypeError, 'true is not a string')
            })

            /** check array id */
            it('should fail on array id', () => {
                expect(() => logic.getUser([1, 2, 3])).to.throw(TypeError, '1,2,3 is not a string')
            })

            /** check object id */
            it('should fail on object id', () => {
                expect(() => logic.getUser({ a: 1, b: 2 })).to.throw(TypeError, '[object Object] is not a string')
            })

            /** check empty id */
            it('should fail on empty id', () => {
                expect(() => logic.getUser('')).to.throw(Error, 'id is empty or blank')
            })

            /** check blank id */
            it('should fail on blank id', () => {
                expect(() => logic.getUser('\n \t    \t')).to.throw(Error, 'id is empty or blank')
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

            it('should update on correct id, newSurname and password (other fields null)', () => {
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

            it('should update on correct id, newPassword and password (other fields null)', () => {
                const { id, name, surname, email, password } = user

                const newPassword = `${surname}-${Math.random()}`

                return logic.updateUser(id, null, null, null, newPassword, password)
                    .then(() => User.find())
                    .then(_users => {
                        const [_user] = _users

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(name)
                        expect(_user.surname).to.equal(surname)
                        expect(_user.email).to.equal(email)
                        expect(_user.password).to.equal(newPassword)
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

            it('should fail on undefined id', () => {

                expect(() => logic.getGameById(undefined).to.throw(TypeError, 'undefined is not a string'))
            })

            it('should fail on empty id', () => {

                expect(() => logic.getGameById('').to.throw(TypeError, 'id is empty or blank'))
            })

            it('should fail on blank id', () => {

                expect(() => logic.getGameById('\n \t').to.throw(TypeError, 'id is empty or blank'))
            })

            it('should throw the correct error on unexisting game for a given id', () => {

                let unexistingGame = 'dsadaasd'

                return logic.getGameById(unexistingGame)
                    .catch(err => expect(err.message).to.equal(`game with id ${unexistingGame} not found`))

            })

        })

        describe('addGameToOwnedGames', () => {

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

            it('should successfully add a game to user ownedGames', async () => {
                let userId = user.id
                let gameId = game.id
                await logic.addGameToOwnedGames(userId, gameId)
                let modifiedUser = await User.findById(userId)
                expect(modifiedUser.ownedGames).to.be.an('array').that.includes(game.id)
            })
        })

        describe('removeGameFromOwnedGames', () => {

            let user, game1, game2

            beforeEach(() => {

                // create a new game that will be saved to the database
                game1 = new Game({
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

                game2 = new Game({
                    "bggId": 123,
                    "name": "Agrasicola",
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

                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', email: 'fede@maill.com', ownedGames: [game1.id, game2.id] })

                return Promise.all([game1.save(), game2.save(), user.save()])
            })

            it('should successfully remove a game from user ownedGames', async () => {
                let userId = user.id
                let gameId = game1.id
                await logic.removeGameFromOwnedGames(userId, gameId)
                let modifiedUser = await User.findById(userId)
                expect(modifiedUser.ownedGames).to.be.an('array').that.does.not.include(game1.id)
                expect(modifiedUser.ownedGames).to.be.an('array').that.includes(game2.id)
            })
        })

        describe('getAllGames', () => {

            let game1, game2

            beforeEach(async () => {

                // create 2 new games that will be saved to the database

                game1 = await new Game({
                    "bggId": 2,
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

                await game1.save()

                game2 = await new Game({
                    "bggId": 12212134,
                    "name": "Agricola1",
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

                await game2.save()

                // return Promise.all([game1.save(), game2.save()])
            })

            it('should list all games in the database', async () => {

                let games = await logic.getAllGames()

                games.should.be.an('array')
                games.should.have.lengthOf(2)
                expect(games[0].bggId).to.equal(game1.bggId)
                expect(games[1].bggId).to.equal(game2.bggId)
            })
        })

        describe('addNewGame', () => {
            it('should successfully add a new game to the database', () => {
                let bggId = Math.random()
                let name = `Game${bggId}`
                let description = 'description of the game'
                let image = 'https://cdn.pixabay.com/photo/2017/01/24/00/47/quiz-2004332_960_720.png'
                let thumbnail = 'https://cdn.pixabay.com/photo/2017/01/24/00/47/quiz-2004332_960_720.png'
                let minPlayers = Math.random() * 10
                let maxPlayers = Math.random() * 10
                let playingTime = Math.random() * 100
                let mechanics = ['Mechanic-1', 'Mechanic-2', 'Mechanic-3', 'Mechanic-4', 'Mechanic-5']
                let yearPublished = Math.floor(Math.random() * 1000)
                let bggRating = Math.floor(Math.random()) * 100
                let designers = ["Max Mustermann"]

                logic.addNewGame({ bggId, name, description, image, thumbnail, minPlayers, maxPlayers, playingTime, mechanics, yearPublished, bggRating, designers })
                    .then(async () => {
                        let game = await Game.find({ name: name })
                        expect(game[0].name).to.equal(name)
                    })
            })
        })
    })

    // ----------------------------------
    // Let's test the gamePlay-related logic
    // ----------------------------------
    false && describe('play', () => {

        let player1, player2, players, game, date, notes

        it('should correctly register a gamePlay', async () => {

            /** Register a new game so the gameId provided by Mongo can be used */
            game = await new Game({
                "bggId": Math.floor(Math.random() * 100),
                "name": `name-${Math.floor(Math.random() * 1000)}`,
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

            /** Register a new user (player) so the userId provided by Mongo can be used */
            player1 = await new User({
                name: `John-{Math.floor(Math.random() * 1000)}`,
                surname: 'Doe',
                username: `jd-${Math.floor(Math.random() * 1000)}`,
                password: '123',
                email: `${Math.floor(Math.random() * 1000)}@mail.com`,
                ownedGames: []
            })

            player2 = await new User({
                name: `John-{Math.floor(Math.random() * 1000)}`,
                surname: 'Doe',
                username: `jd-${Math.floor(Math.random() * 1000)}`,
                password: '123',
                email: `${Math.floor(Math.random() * 1000)}@mail.com`,
                ownedGames: []
            })

            /** this date represents the date on which the play took place */
            date = new Date()
            notes = `These are the notes ${Math.random() * 1000}`

            /** save to the database */
            await Promise.all([player1.save(), player2.save(), game.save()])

            players = [player1.username, player2.username]
            let gameId = game.id

            logic.registerGamePlay({ players, gameId, date, notes })
                .then(async () => {
                    let plays = await Play.find()
                    debugger
                    expect(plays[0].date).to.equal('a')
                    expect(plays[0].players).to.be.a('string')
                })
        })
    })

    after(() => mongoose.disconnect())
})