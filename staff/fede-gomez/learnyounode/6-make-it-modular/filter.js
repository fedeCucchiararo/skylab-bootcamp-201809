const fs = require('fs')
const path = require('path')

// const extension = process.argv[3]

function filter (dir, ext, callback) {

    fs.readdir(dir, (err, files) => {
    
        if(err) {return callback(err)}
    
        const filtered = files.filter(file => {
            return path.extname(file) === ('.' + ext)
        })

        callback(null, filtered)
    })

}

module.exports = filter


// SOLUTION

// var fs = require('fs')
//     var path = require('path')
    
//     module.exports = function (dir, filterStr, callback) {
//       fs.readdir(dir, function (err, list) {
//         if (err) {
//           return callback(err)
//         }
    
//         list = list.filter(function (file) {
//           return path.extname(file) === '.' + filterStr
//         })
    
//         callback(null, list)
//       })
//     }
