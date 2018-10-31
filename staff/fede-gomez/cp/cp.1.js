const fs = require('fs')

const [, , input, output] = process.argv

// fs.readFile(input, (err, data) => {
//     if (err) throw err;

//     fs.writeFile(output, data, (err) => {
//         if (err) throw err;
//         console.log('The file has been saved!');
//     })

// })


// The method below is way more efficient than using the readFile and WriteFile. Therefore: use Streams!!!!

const rs = fs.createReadStream(input)

const ws = fs.createWriteStream(output)

rs.pipe(ws)

function printMem () {
    console.log(process.memoryUsage().rss / 1024 / 1024)
}