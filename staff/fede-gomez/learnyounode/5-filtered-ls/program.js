const fs = require('fs')
const path = require('path')

// const extension = process.argv[3]

const [, , dir, extension] = process.argv


fs.readdir(dir, (err, files) => {
    
    if(err) {throw Error (err.message)}

    files.forEach(file => {
        if(path.extname(file) === ('.' + extension)) console.log(file)
    })
})

