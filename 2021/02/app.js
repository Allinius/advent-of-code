const fs = require('fs');

const parseInputLine = (line) => {
    const parts = line.split(' ');
    return {
        direction: parts[0],
        distance: parseInt(parts[1])
    }
}

const smallInput = fs.readFileSync('input-small.txt', 'utf-8').split('\n').map(parseInputLine);
const input = fs.readFileSync('input.txt', 'utf-8').split('\n').map(parseInputLine);

const partOne = (instructions) => {
    const position = {x: 0, y: 0};
    instructions.forEach(instruction => {
        switch(instruction.direction) {
            case 'forward':
                position.x += instruction.distance;
                break;
            case 'down':
                position.y += instruction.distance;
                break;
            case 'up':
                position.y -= instruction.distance;
                break;
        }
    });
    return position.x * position.y;
}

const partTwo = (instructions) => {
    const position = {x: 0, y: 0};
    let aim = 0;

    instructions.forEach(instruction => {
        switch(instruction.direction) {
            case 'forward':
                position.x += instruction.distance;
                position.y += aim * instruction.distance;
                break;
            case 'down':
                aim += instruction.distance;
                break;
            case 'up':
                aim -= instruction.distance;
                break;
        }
    });

    return position.x * position.y;
}


console.log(partOne(input));
console.log(partTwo(input));
