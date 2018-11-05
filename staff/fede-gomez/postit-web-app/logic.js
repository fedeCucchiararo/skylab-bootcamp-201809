const { User, Postit } = require('./data')


const logic = {
    registerUser(name, surname, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!surname.trim()) throw Error('surname is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        let user = User.findByUsername(username)

        if (user) throw Error(`username ${username} already registered`)

        user = new User(name, surname, username, password)

        user.save()
    },

    authenticateUser(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        const user = User.findByUsername(username)

        if (!user || user.password !== password) throw Error('invalid username or password')

        return user.id
    },

    retrieveUser(id) {
        if (typeof id !== 'number') throw TypeError(`${id} is not a number`)

        const user = User.findById(id)

        if (!user) throw Error(`user with id ${id} not found`)

        const _user = new User(
            user.name,
            user.surname,
            user.username
        )

        _user.id = user.id
        _user.postits = user.postits

        delete _user.password

        return _user
    },


/**
 * Creates a postit
 * 
 * @param {string} text 
 * @param {number} id 
 * 
 * @throws {TypeError} On non-numeric id, or non-string text
 */
    createPostit(text, id) {

        if(typeof text !== 'string') throw TypeError (`${text} is not a string`)
        if(typeof id !== 'number') throw TypeError (`${id} is not a number`)

        const user = User.findById(id)

        const userPostits = user.postits

        let _postit = new Postit(text)

        userPostits.push(_postit)

        user.save()

    },

    /**
     * 
     * @param {number} userId 
     * @param {number} postitId 
     * 
     * @throws {TypeError} On non-numeric ids
     */
    deletePostit(userId, postitId) {
        if(typeof userId !== 'number') throw TypeError (`${userId} is not a number`)
        if(typeof postitId !== 'number') throw TypeError (`${postitId} is not a number`)

        const user = User.findById(id)

        const userPostits = user.postits

        userPostits = userPostits.filter(postit => postit.id !== postitId)

        user.postits = userPostits

        user.save()

    }
}

module.exports = logic