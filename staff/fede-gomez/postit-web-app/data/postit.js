class Postit {
    constructor(text) {
        this.text = text
        this.id = Date.now()
    }
}

module.exports = Postit