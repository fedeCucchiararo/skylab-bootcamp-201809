
var fs = require('fs')

// // read the file passed as argument

fs.readFile(process.argv[2], 'utf8', (err, data) => {
    if(err) throw err;
    console.log(data.split('\n').length -1)
})