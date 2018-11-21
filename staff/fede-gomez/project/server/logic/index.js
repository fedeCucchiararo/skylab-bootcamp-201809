const { User, Game } = require('../data')
const { AlreadyExistsError, AuthError, NotFoundError, ValueError } = require('../errors')
const fetch = require('node-fetch');

const logic = {

    /**
     *  User Logic
     * @param {*} id 
     */

    registerUser(name, surname, username, password, email) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`password is not a string`)
        if (typeof email !== 'string') throw TypeError(`${email} is not a string`)

        if (!name.trim()) throw new ValueError('name is empty or blank')
        if (!surname.trim()) throw new ValueError('surname is empty or blank')
        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')
        if (!email.trim()) throw new ValueError('email is empty or blank')

        return User.findOne({ username })
            .then(user => {
                if (user) throw new AlreadyExistsError(`username ${username} already registered`)

                user = new User({ name, surname, username, password, email })

                return user.save()
            })
    },

    authenticateUser(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw new ValueError('username is empty or blank')
        if (!password.trim()) throw new ValueError('password is empty or blank')

        return User.findOne({ username })
            .then(user => {
                if (!user || user.password !== password) throw new AuthError('invalid username or password')
                return user.id
            })
    },

    retrieveUser(id) {
        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw new ValueError('id is empty or blank')

        /*
            In the following lines we pass an object as second argument to the User.findById function
            in order to eliminate some properties that we don't want to show
        */
        return User.findById(id, { '_id': 0, 'password': 0, '__v': 0 })
            .lean()
            .then(user => {
                if (!user) throw new NotFoundError(`user with id ${id} not found`)
                // We have eliminated _id, therefore we add a new id (the one passed to the retrieveUser function)
                user.id = id
                // Make sure that the favorites array contains strings and not bsontype values
                user.favorites = user.favorites.map(item => item._id.toString())
                return user
            })
    },

    updateUser(id, newName, newSurname, newEmail, newPassword, password) {



        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (newName != null && typeof newName !== 'string') throw TypeError(`${newName} is not a string`)
        if (newSurname != null && typeof newSurname !== 'string') throw TypeError(`${newSurname} is not a string`)
        if (newEmail != null && typeof newEmail !== 'string') throw TypeError(`${newEmail} is not a string`)
        if (newPassword != null && typeof newPassword !== 'string') throw TypeError(`${newPassword} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!id.trim().length) throw new ValueError('id is empty or blank')
        if (newName != null && !newName.trim().length) throw new ValueError('newName is empty or blank')
        if (newSurname != null && !newSurname.trim().length) throw new ValueError('newSurname is empty or blank')
        if (newEmail != null && !newEmail.trim().length) throw new ValueError('newEmail is empty or blank')
        if (newPassword != null && !newPassword.trim().length) throw new ValueError('newPassword is empty or blank')
        if (!password.trim().length) throw new ValueError('password is empty or blank')

        return User.findById(id)
            .then(user => {

                if (!user) throw new NotFoundError(`user with id ${id} not found`)

                if (user.password !== password) throw new AuthError('invalid password')

                newName != null && (user.name = newName)
                newSurname != null && (user.surname = newSurname)
                newEmail != null && (user.email = newEmail)
                newPassword != null && (user.password = newPassword)

                return user.save()
            })
            .then(() => undefined)
    },
    /**
     *  Game Logic
     * 
     */

    getGameById(id) {

        if (typeof id !== 'string') throw TypeError(`${id} is not a string`)
        if (!id.trim().length) throw new ValueError('id is empty or blank')

        // return Game.findById(id, (err, game) => {
        //     if(err) throw new Error('err.message')
        //     return game
        // })

        return Game.findById(id, { '_id': 0, '__v': 0 })
            .lean()
            .then(game => {
                if (!game) throw new NotFoundError(`game with id ${id} not found`)
                // We have eliminated _id, therefore we add a new id (the one passed to the retrieveUser function)
                game.id = id
                return game
            })
    }
}


module.exports = logic