require('dotenv').config()
const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should();  // Using Should style

const mongoose = require('mongoose')
const { User, Postit } = require('../data')
const logic = require('.')
const { AlreadyExistsError } = require('../errors')

const { env: { MONGO_URL } } = process

// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true }))

    // Cuando tengas Postit.deleteMany() , usa un PromiseAll en el siguiente beforeEach
    // beforeEach (() => Promise.All(User.deleteMany(), Postit.deleteMany()))
    beforeEach(() => User.deleteMany())

    describe('user', () => {
        describe('register', () => {
            let name, surname, username, password

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
            })

            it('should succeed on correct data', () =>
                logic.registerUser(name, surname, username, password)
                    .then(() => User.find())
                    .then(_users => {
                        expect(_users.length).to.equal(1)

                        const [user] = _users

                        expect(user.id).to.be.a('string')
                        expect(user.name).to.equal(name)
                        expect(user.surname).to.equal(surname)
                        expect(user.username).to.equal(username)
                        expect(user.password).to.equal(password)
                    })
            )

            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, surname, username, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases
        })

        describe('authenticate', () => {
            let user

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', postits: [] })

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

            // TODO other test cases
        })

        describe('retrieve', () => {
            let user, postit

            beforeEach(() => {
                postit = new Postit({ text: 'hello text' })
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123', postits: [postit] })

                return user.save()
            })

            it('should succeed on valid id', () => {
                const { username, password } = user

                logic.retrieveUser(user.id)
                    .then(_user => {
                        expect(_user).not.to.be.instanceof(User)

                        const { id, name, surname, username, password, postits } = _user

                        expect(id).to.exist
                        expect(id).to.equal(user.id)
                        expect(name).to.equal(user.name)
                        expect(surname).to.equal(user.surname)
                        expect(username).to.equal(user.username)
                        expect(password).to.be.undefined
                        expect(postits).not.to.exist
                    })
            })
        })

        describe('update', () => {
            let user

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                return user.save()

            })

            it('should update on correct data and password', () => {
                let { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`
                const newSurname = `${surname}-${Math.random()}`
                const newUsername = `${username}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`

                return logic.updateUser(id, newName, newSurname, newUsername, newPassword, password)
                    .then(() => User.find())
                    .then(_users => {
                        const [_user] = _users

                        expect(_user.id).to.equal(id)

                        const { name, surname, username, password } = _user

                        expect(name).to.equal(newName)
                        expect(surname).to.equal(newSurname)
                        expect(username).to.equal(newUsername)
                        expect(password).to.equal(newPassword)
                    })
            })

            it('should update on correct id, name and password (other fields null)', () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`

                return logic.updateUser(id, newName, null, null, null, password)
                    .then(() => User.find())
                    .then(_users => {
                        const [_user] = _users

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(newName)
                        expect(_user.surname).to.equal(surname)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                    })
            })

            it('should update on correct id, surname and password (other fields null)', () => {
                const { id, name, surname, username, password } = user

                const newSurname = `${surname}-${Math.random()}`

                return logic.updateUser(id, null, newSurname, null, null, password)
                    .then(() => User.find())
                    .then(_users => {
                        const [_user] = _users

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(name)
                        expect(_user.surname).to.equal(newSurname)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                    })
            })

            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {
                const { id, name, surname, username, password } = user

                expect(() => logic.updateUser(undefined, name, surname, username, password, password)).to.throw(TypeError, 'undefined is not a string')
            })

            // TODO other test cases

            describe('with existing user', () => {
                let user2

                beforeEach(() => {
                    // This is done before...
                    // user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                    user2 = new User({ name: 'John', surname: 'Doe', username: 'jd2', password: '123' })

                    // Already changed to work with mongoose
                    return user2.save()
                })

                // TODO
                it('should update on correct data and password', () => {
                    const { id, name, surname, username, password } = user2

                    const newUsername = 'jd'

                    return logic.updateUser(id, null, null, newUsername, null, password)
                        .then(() => expect(true).to.be.false)
                        .catch(err => {

                            expect(err).to.be.instanceof(AlreadyExistsError)

                            return User.findById(id)
                        })
                        .then(_user => {

                            expect(_user.id).to.equal(id)

                            expect(_user.name).to.equal(name)
                            expect(_user.surname).to.equal(surname)
                            expect(_user.username).to.equal(username)
                            expect(_user.password).to.equal(password)
                        })
                })
            })
        })

        describe('addBuddyById', () => {
            let user, user2

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'John2', surname: 'Doe2', username: 'jd2', password: '123' })

                return Promise.all([user.save(), user2.save()])
            })

            it('should succeed on correct data', () =>
                logic.addBuddyById(user.id, user2.id)
                    .then(() => User.findById(user.id))
                    .then(user => {
                        
                        user.buddies.should.be.an('array')
                        user.buddies.should.be.of.length(1)
                        user.buddies[0]._id.toString().should.equal(user2.id)
                    })
            )
        })

        describe('addBuddyByUsername', () => {
            let user, user2

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'John2', surname: 'Doe2', username: 'jd2', password: '123' })

                return Promise.all([user.save(), user2.save()])
            })

            it('should succeed on correct data', () =>
                logic.addBuddyByUsername(user.id, user2.username)
                    .then(() => User.findById(user.id))
                    .then(user => {
                        
                        user.buddies.should.be.an('array')
                        user.buddies.should.be.of.length(1)
                        user.buddies[0]._id.toString().should.equal(user2.id)
                    })
            )
        })
    })

    false && describe('postits', () => {
        describe('add', () => {
            let user, text

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                text = `text-${Math.random()}`

                return user.save()
            })

            beforeEach(() => Postit.deleteMany())


            it('should succeed on correct data', () =>

                logic.addPostit(user.id, text)
                    .then(() => {
                        let postit = Postit.findOne({ userId: user.id })
                        return postit
                    })
                    .then(postit => {
                        expect(postit.userId.toString()).to.equal(user.id)
                    })
            )

            // TODO other test cases
        })

        describe('list', () => {
            let user, postit, postit2

            beforeEach(() => Postit.deleteMany())

            beforeEach(() => {

                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                postit = new Postit({ text: 'hello text', userId: user.id })
                postit2 = new Postit({ text: 'hello text 2', userId: user.id })

                return Promise.all([user.save(), postit.save(), postit2.save()])
            })



            it('should succeed on correct data', () =>
                logic.listPostits(user.id)
                    .then(postits => {

                        postits.should.be.an('array');

                        expect(postits.length).to.equal(2)
                        // ALT postits.should.have.a.lengthOf(2);

                        // expect(_user.id).to.equal(user.id)

                        // const { postits: _postits } = _user

                        const [_postit, _postit2] = postits

                        expect(_postit.id).to.equal(postit.id)
                        expect(_postit.text).to.equal(postit.text)
                        expect(_postit.userId).to.equal(user.id)

                        expect(_postit2.id).to.equal(postit2.id)
                        expect(_postit2.text).to.equal(postit2.text)
                        expect(_postit2.userId).to.equal(user.id)

                    })
            )
        })

        describe('modify', () => {

            beforeEach(() => Postit.deleteMany())

            let user, postit, newText

            beforeEach(() => {

                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                postit = new Postit({ text: 'hello text', userId: user.id })

                newText = `new-text-${Math.random()}`

                return Promise.all([user.save(), postit.save()])
            })

            it('should succeed on correct data', () =>
                logic.modifyPostit(user.id, postit.id, newText)
                    .then(() => {
                        return Postit.findById(postit.id)
                            .then(postit => {
                                postit.should.be.an('object')
                                postit.text.should.equal(newText)
                                postit.userId.toString().should.equal(user.id)
                            })
                    })
            )
        })

        describe('remove', () => {
            let user, postit, postit2

            beforeEach(() => Postit.deleteMany())

            beforeEach(() => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                postit = new Postit({ text: 'this postit will not be deleted', userId: user.id })
                postit2 = new Postit({ text: 'this postit should have been removed', userId: user.id })

                return Promise.all([user.save(), postit.save(), postit2.save()])
            })

            it('should succeed on correct data', () =>
                logic.removePostit(user.id, postit2.id)
                    .then(() => Postit.find())
                    .then(postits => {
                        postits.should.be.an('array')
                        postits.should.be.of.length(1)
                        const [postit] = postits
                        postit.text.should.equal('this postit will not be deleted')
                        // postits.userId.toString().should.equal(user.id)
                        // expect(removedPostit.id).to.equal(postit2.id)
                        // expect(removedPostit.text).to.equal('hello text')
                        // expect(removedPostit.userId).to.equal(user.id)
                    })

                // expect(_users.length).to.equal(1)

                // const [_user] = _users

                // expect(_user.id).to.equal(user.id)

                // const { postits } = _user

                // expect(postits.length).to.equal(0)
            )
        })

    })

    after(() => mongoose.disconnect())
})