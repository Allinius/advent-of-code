const fs = require('fs');
const assert = require('assert');
const { getSurrounding } = require('../../common/array-2d-util');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(',').map(Number));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (bytes, count, mapSize) => {
    const map = Array(mapSize)
        .fill()
        .map(() => Array(mapSize).fill('.'));
    bytes.slice(0, count).forEach((byte) => {
        map[byte[1]][byte[0]] = '#';
    });

    const opened = [{ x: 0, y: 0, steps: 0 }];
    const visited = new Set();
    while (opened.length > 0) {
        const currState = opened.shift();
        if (currState.x === mapSize - 1 && currState.y === mapSize - 1) {
            return currState.steps;
        }
        const mapTile = map[currState.y][currState.x];
        const adj = getSurrounding(map, currState.x, currState.y)
            .filter(
                (neigh) =>
                    neigh.value !== '#' && !visited.has(`${neigh.x},${neigh.y}`)
            )
            .forEach((neigh) => {
                opened.push({
                    x: neigh.x,
                    y: neigh.y,
                    steps: currState.steps + 1,
                });
                visited.add(`${neigh.x},${neigh.y}`);
            });
    }
};

const partTwo = (bytes, startCount, mapSize) => {
    for (let second = startCount; second < bytes.length; second++) {
        if (!partOne(bytes, second, mapSize)) {
            return bytes[second - 1].toString();
        }
    }
};

assert.equal(partOne(inputSmall, 12, 7), 22);
console.log(partOne(input, 1024, 71));
assert.equal(partTwo(inputSmall, 13, 7), '6,1');
console.log(partTwo(input, 1025, 71));
