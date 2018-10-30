const http = require('http')

const [, , ...urls] = process.argv

const endArray = []

let counter = 0


urls.forEach((url, index) => {


    http.get(url, (response) => {

        let dataString = ''


        response.setEncoding('utf8')
        response.on('data', (chunk) => {
            dataString += chunk
        })

        response.on('end', () => {
            counter++
            endArray[index] = dataString

            if (counter === urls.length) {
                endArray.forEach(string => {
                    console.log(string)
                })
            }

        })

    })
})

// SOLUTION

// var http = require('http')
// var bl = require('bl')
// var results = []
// var count = 0

// function printResults() {
//     for (var i = 0; i < 3; i++) {
//         console.log(results[i])
//     }
// }

// function httpGet(index) {
//     http.get(process.argv[2 + index], function (response) {
//         response.pipe(bl(function (err, data) {
//             if (err) {
//                 return console.error(err)
//             }

//             results[index] = data.toString()
//             count++

//             if (count === 3) {
//                 printResults()
//             }
//         }))
//     })
// }

// for (var i = 0; i < 3; i++) {
//     httpGet(i)
// }

