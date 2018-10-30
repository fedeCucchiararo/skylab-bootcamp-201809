const http = require('http')

const url = process.argv[2]



http.get(url, (response) => {

    let dataString = ''


    response.setEncoding('utf8')
    response.on('data', (chunk) => {
        dataString += chunk
    })

    response.on('end', () => {
        console.log(dataString.length)
        console.log(dataString)

    })
})


// SOLUTION

// var http = require('http')
// var bl = require('bl')

// http.get(process.argv[2], function (response) {
//     response.pipe(bl(function (err, data) {
//         if (err) {
//             return console.error(err)
//         }
//         data = data.toString()
//         console.log(data.length)
//         console.log(data)
//     }))
// })
