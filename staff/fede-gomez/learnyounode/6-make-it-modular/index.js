const fs = require('fs')
const path = require('path')
const filter = require('./filter')

const [, , dir, ext] = process.argv

filter(dir, ext, (err, files) => {
        if(err) throw err

        files.forEach(element => {
                console.log(element)
        })
})


// SOLUTION 

// var filterFn = require('./solution_filter.js')
//     var dir = process.argv[2]
//     var filterStr = process.argv[3]
    
//     filterFn(dir, filterStr, function (err, list) {
//       if (err) {
//         return console.error('There was an error:', err)
//       }
    
//       list.forEach(function (file) {
//         console.log(file)
//       })
//     })
