import data from './data'

const { storage, Postit, User } = data

const logic = {
    createPostit(text, userId) {
        const postit = new Postit(text, userId)

        const postits = this.listPostits(userId)

        postits.push(postit)

        this._persistPostits(postits)
    },

    listPostits(userId) {
        const postits = JSON.parse(storage.getItem('postits'))
        const userPostits = postits.filter(postit => postit.userId === userId)
        return userPostits
    },

    _persistPostits(postits) {
        storage.setItem('postits', JSON.stringify(postits))
    },

    deletePostit(id, userId) {
        let postits = this.listPostits(userId)

        postits = postits.filter(postit => postit.id !== id)

        this._persistPostits(postits)
    },

    updatePostit(id, text, userId) {
        let postits = this.listPostits(userId)

        const postit = postits.find(postit => postit.id === id)

        
        postit.text = text

        this._persistPostits(postits)
    },

    listUsers() {
        return JSON.parse(storage.getItem('users'))
    },

    _persistUsers(users) {
        storage.setItem('users', JSON.stringify(users))
    },

    registerUser(name, surname, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!surname.trim()) throw Error('surname is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        const user = new User(name, surname, username, password)

        const users = this.listUsers()

        users.push(user)

        this._persistUsers(users)
    },

    authenticate(username, password) {
        const users = this.listUsers()

        const user = users.find(user => user.username === username && user.password === password)

        if (!user) throw Error('wrong credentials')

        return user.id
    }
}

export default logic