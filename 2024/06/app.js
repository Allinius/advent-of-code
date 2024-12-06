const fs = require('fs');
const assert = require('assert');
const vec2d = require('../../common/vec2d');

const parseInput = (fileName) => {
    let startPos;
    const map = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line, y) =>
            line
                .split('')
                .map((c, x) => (c === '^' ? (startPos = { x, y }) && '.' : c))
        );

    return {
        map,
        startPos,
    };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
];
const simulatePath = (map, startPos) => {
    const path = [];
    let dirIndex = 0;
    let currPos = { ...startPos };
    let loopDetected = false;
    const visitedSet = new Set();
    while (
        currPos.x >= 0 &&
        currPos.y >= 0 &&
        currPos.x < map[0].length &&
        currPos.y < map.length
    ) {
        if (visitedSet.has(`${currPos.x}_${currPos.y}_${dirIndex}`)) {
            loopDetected = true;
            break;
        }
        visitedSet.add(`${currPos.x}_${currPos.y}_${dirIndex}`);

        path.push({
            dirIndex,
            position: currPos,
        });
        let nextPos = vec2d.add(currPos, directions[dirIndex]);
        while (map[nextPos.y]?.[nextPos.x] === '#') {
            dirIndex = (dirIndex + 1) % 4;
            nextPos = vec2d.add(currPos, directions[dirIndex]);
        }

        currPos = nextPos;
    }
    return {
        path,
        loopDetected,
    };
};

const partOne = (input) => {
    const path = simulatePath(input.map, input.startPos).path;
    const posSet = new Set();
    path.forEach((step) => posSet.add(`${step.position.x}_${step.position.y}`));
    return posSet.size;
};

const partTwo = (input) => {
    const path = simulatePath(input.map, input.startPos).path;
    const posMap = new Map();
    path.forEach((step) =>
        posMap.set(`${step.position.x}_${step.position.y}`, step)
    );

    let count = 0;
    Array.from(posMap)
        .slice(1)
        .forEach(([_, step]) => {
            input.map[step.position.y][step.position.x] = '#';
            const result = simulatePath(input.map, input.startPos);
            if (result.loopDetected) {
                count++;
            }
            input.map[step.position.y][step.position.x] = '.';
        });

    return count;
};

assert.equal(partOne(inputSmall), 41);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 6);
console.log(partTwo(input));
