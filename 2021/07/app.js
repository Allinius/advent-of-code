const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf-8').replace(/\r/g, "").split(',').map(n => parseInt(n)).sort((a,b)=>a-b);

const partOne = (positions) => {
    const position = positions[positions.length/2];
    return positions.reduce((prev, curr) => prev + (Math.abs(position - curr)), 0);
}

const partTwo = (positions) => {
    // idk why it's floor not round
    const position = Math.floor(positions.reduce((prev, curr) => prev + curr, 0) / positions.length);
    console.log(position);
    return positions.reduce((prev, curr) => {
        const diff = Math.abs(position - curr);
        return prev + (diff * (diff + 1)) / 2
    }, 0);
}

console.log(partOne(input));
console.log(partTwo(input));