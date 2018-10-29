const http = require('http')

http.get(process.argv[2], (response) => {
    
    response.on('data', (chunk) => {
        console.log(chunk.toString())
    })

    response.on('end', ()=> {
        console.log('Response finished...')
    })
})

