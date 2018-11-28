const { User, Game, Session } = require('../data')
const { AlreadyExistsError, AuthError, NotFoundError, ValueError } = require('../errors')

const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))


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

    sendRegisterEmail(name, email) {
        return transporter.sendMail({
            to: email,
            from: 'project@mail.com',
            subject: 'Sign in completed',
            html: `<h1>Hey ${name}! you have succesfully registered!</h1>`
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
        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)
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
                // Make sure that the ownedGames array contains strings and not bsontype values
                user.ownedGames = user.ownedGames.map(item => item.toString())
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

        if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)
        if (!id.trim().length) throw new ValueError('id is empty or blank')

        // return Game.findById(id, (err, game) => {
        //     if(err) throw new Error('err.message')
        //     return game
        // })

        return Game.findById(id, { '_id': 0, '__v': 0 })
            .lean()
            .then(game => {

                // We have eliminated _id, therefore we add a new id (the one passed to the retrieveUser function)
                game.id = id
                return game
            })
            .catch(res => {
                if (res) throw new NotFoundError(`game with id ${id} not found`)
            })
    },

    async addGameToOwnedGames(userId, gameId) {

        if (typeof userId !== 'string') throw new TypeError(`${userId} is not a string`)
        if (typeof gameId !== 'string') throw new TypeError(`${gameId} is not a string`)
        if (!userId.trim().length) throw new ValueError('userId is empty or blank')
        if (!gameId.trim().length) throw new ValueError('gameId is empty or blank')

        let user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        let game = await Game.findById(gameId)
        if (!game) throw new NotFoundError(`game with id ${gameId} not found`)

        let _user = await User.findOne({ _id: userId, ownedGames: { $in: [game._id] } }).lean()
        if (_user) throw new AlreadyExistsError(`${game.name} is already in your collection`)

        return User.updateOne({ _id: userId }, { $push: { ownedGames: game._id } })
    },

    async removeGameFromOwnedGames(userId, gameId) {

        if (typeof userId !== 'string') throw new TypeError(`${userId} is not a string`)
        if (!userId.trim().length) throw new ValueError('userId is empty or blank')
        if (typeof gameId !== 'string') throw new TypeError(`${gameId} is not a string`)
        if (!gameId.trim().length) throw new ValueError('gameId is empty or blank')

        let user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        let game = await Game.findById(gameId)
        if (!game) throw new NotFoundError(`game with id ${gameId} not found`)

        let _user = await User.findOne({ ownedGames: { $in: [game._id] } }).lean()
        if (!(_user)) throw new NotFoundError(`game with id ${gameId} not in ownedGames of user with id ${userId}`)

        return User.updateOne({ _id: userId }, { $pull: { ownedGames: game._id } })

    },

    async getUserOwnedGames(userId) {

        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        if (!userId.trim().length) throw new ValueError('userId is empty or blank')

        let user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        return User.findById(userId).populate('ownedGames').exec()
    },

    async getAllGames() {
        return Game.find().lean()
    },

    async addNewGame({ bggId, name, description, image, thumbnail, minPlayers, maxPlayers, playingTime, mechanics, yearPublished, bggRating, designers }) {

        /** Data validation for type errors */
        if (typeof bggId !== 'number') throw TypeError(`${bggId} is not a number`)
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof description !== 'string') throw TypeError(`${description} is not a string`)
        if (typeof image !== 'string') throw TypeError(`${image} is not a string`)
        if (typeof thumbnail !== 'string') throw TypeError(`${thumbnail} is not a string`)
        if (typeof minPlayers !== 'number') throw TypeError(`${minPlayers} is not a number`)
        if (typeof maxPlayers !== 'number') throw TypeError(`${maxPlayers} is not a number`)
        if (typeof mechanics !== 'object') throw TypeError(`${mechanics} is not an object`)
        if (typeof yearPublished !== 'number') throw TypeError(`${yearPublished} is not a number`)
        if (typeof bggRating !== 'number') throw TypeError(`${bggRating} is not a number`)
        if (typeof designers !== 'object') throw TypeError(`${designers} is not an object`)

        /** throw error if empty string */
        if (!name.trim()) throw new ValueError('name is empty or blank')
        if (!description.trim()) throw new ValueError('description is empty or blank')
        if (!image.trim()) throw new ValueError('image is empty or blank')
        if (!thumbnail.trim()) throw new ValueError('thumbnail is empty or blank')

        mechanics.forEach(mechanic => {
            if (!mechanic.trim()) throw new ValueError('mechanic is empty or blank')
        })

        designers.forEach(designer => {
            if (!designer.trim()) throw new ValueError('designer is empty or blank')
        })


        // TO DO: if bggId already on DDBB, then error
        const newGame = await new Game({
            "bggId": bggId,
            "name": name,
            "description": description,
            "image": image,
            "thumbnail": thumbnail,
            "minPlayers": minPlayers,
            "maxPlayers": maxPlayers,
            "playingTime": playingTime,
            "mechanics": mechanics,
            "yearPublished": yearPublished,
            "bggRating": bggRating,
            "designers": designers
        })

        return newGame.save()

    },

    registerGameSession({ players, gameId, date, notes }) {

        /** TO DO: Data validation for type errors */
        
        // TO DO: if bggId already on DDBB, then error
        const gameSession = new Session({
            "players": players,
            "game": gameId,
            "date": date,
            "notes": notes
        })

        return gameSession.save()

    },

    async retrieveUserSessions(userId) {
        if (typeof userId !== 'string') throw new TypeError(`${userId} is not a string`)
        if (!userId.trim().length) throw new ValueError('userId is empty or blank')

        let user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)

        /*
            In the following lines we pass an object as second argument to the User.findById function
            in order to eliminate some properties that we don't want to show
        */
        return Session.find({players: user.name}, { '__v': 0 }).lean()
            .then(sessions => {
                if (!sessions) throw new NotFoundError(`no sessions for user with id ${userId}`)

                // Make sure that the ownedGames array contains strings and not bsontype values
                return sessions
            })
    }
}


module.exports = logic