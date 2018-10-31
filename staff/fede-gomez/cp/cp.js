const fs = require('fs')
const path = require('path')

const [, , input, output] = process.argv

let countDirs = 0

fs.readdir(input, (err, files) => {
    files.forEach(file => {
        fs.stat(file, (err, stat) => {
            if (stat.isDirectory()) {
                fs.mkdir(output, { recursive: true }, (err) => {
                    if (err) throw err
                })
            }
        })
    })
})

