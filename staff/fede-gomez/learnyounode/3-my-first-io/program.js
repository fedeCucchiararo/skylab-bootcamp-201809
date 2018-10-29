
var fs = require('fs')

const [, , file] = process.argv
// // read the file passed as argument
const buf = fs.readFileSync(file)

const txt = buf.toString()

const lines = txt.split('\n')

console.log(lines.length -1)


/*

    // Save the target regular expression
    const regex = 
    text.match(regex).length

*/