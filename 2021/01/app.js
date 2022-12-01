const fs = require('fs');

const smallInput = fs.readFileSync('input-small.txt', 'utf-8').replace(/\r/g, "").split('\n').map(s => parseInt(s));
const input = fs.readFileSync('input.txt', 'utf-8').replace(/\r/g, "").split('\n').map(s => parseInt(s));


const partOne = (depths) => {
    let increaseCount = 0;
    let previousDepth;
    depths.forEach(depth => {
        if (previousDepth && depth > previousDepth) {
            increaseCount++;
        }
        previousDepth = depth;
    });

    return increaseCount
}

const partTwo = (depths) => {
    const windows = [];

    for (let i = 0; i < depths.length - 2; i++) {
        windows.push(depths[i] + depths[i + 1] + depths[i + 2])
    }
    
    return partOne(windows);
}

console.log(partOne(input));

console.log(partTwo(input));
