// console.log(process.argv)

const argv = process.argv.slice(2)

// console.log(argv)

let sum = 0;

// for (let i = 0; i< argv.length; i++) {
//     sum+=parseFloat(argv[i])
// }

argv.forEach((num) => {
    sum+=Number(num)
})


console.log(sum)