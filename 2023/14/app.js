const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((pattern) => pattern.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    const map = JSON.parse(JSON.stringify(input));
    map.forEach((row, y) => {
        row.forEach((tile, x) => {
            if (tile === 'O') {
                rollRock(map, x, y, 0, -1);
            }
        });
    });
    return calculateLoad(map);
};

const partTwo = (input) => {
    let map = JSON.parse(JSON.stringify(input));

    const cache = new Map();
    let step = 0;
    let cycleItems = [];
    let firstCycle;
    while (true) {
        const mapString = map.toString();
        if (cache.has(mapString)) {
            if (firstCycle == null) {
                firstCycle = step;
            }
            if (
                cycleItems.length === 0 ||
                JSON.stringify(map) !== cycleItems[0]
            ) {
                cycleItems.push(JSON.stringify(map));
            } else {
                const index = (1000000000 - firstCycle) % cycleItems.length;
                return calculateLoad(JSON.parse(cycleItems[index]));
            }
            map = cache.get(mapString);
        } else {
            map = fullSpin(map);
            cache.set(mapString, JSON.parse(JSON.stringify(map)));
        }
        step++;
    }
};

const rollRock = (map, x, y, stepX, stepY) => {
    let currPos = { x, y };
    map[y][x] = '.';
    while (true) {
        const newPos = { x: currPos.x + stepX, y: currPos.y + stepY };
        if (
            newPos.x >= 0 &&
            newPos.y >= 0 &&
            newPos.x < map[0].length &&
            newPos.y < map.length &&
            map[newPos.y][newPos.x] === '.'
        ) {
            currPos = newPos;
        } else {
            break;
        }
    }
    map[currPos.y][currPos.x] = 'O';
};

const calculateLoad = (map) => {
    return map.reduce(
        (load, row, index) =>
            load +
            (map.length - index) *
                row.reduce((count, cell) => count + (cell === 'O' ? 1 : 0), 0),
        0
    );
};

const fullSpin = (startMap) => {
    const map = JSON.parse(JSON.stringify(startMap));

    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 'O') {
                rollRock(map, x, y, 0, -1);
            }
        });
    });
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 'O') {
                rollRock(map, x, y, -1, 0);
            }
        });
    });
    for (let y = map.length - 1; y >= 0; y--) {
        for (let x = map[0].length - 1; x >= 0; x--) {
            if (map[y][x] === 'O') {
                rollRock(map, x, y, 0, 1);
            }
        }
    }
    for (let y = map.length - 1; y >= 0; y--) {
        for (let x = map[0].length - 1; x >= 0; x--) {
            if (map[y][x] === 'O') {
                rollRock(map, x, y, 1, 0);
            }
        }
    }

    return map;
};

assert.equal(partOne(inputSmall), 136);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 64);
console.log(partTwo(input));
