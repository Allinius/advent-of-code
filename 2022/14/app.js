const fs = require('fs');
const assert = require('assert');
const { drawImage } = require('../../common/image-utils');

const parseInput = (fileName) => {
    let xMin = Number.MAX_SAFE_INTEGER;
    let xMax = 0;
    let yMax = 0;
    const lines = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n');
    const paths = lines.map((line) =>
        line.split(' -> ').map((coords) => {
            const parts = coords.split(',');
            const x = parseInt(parts[0]);
            const y = parseInt(parts[1]);
            xMin = Math.min(xMin, x);
            xMax = Math.max(xMax, x);
            yMax = Math.max(yMax, y);
            return { x, y };
        })
    );
    return { paths, xMin, xMax, yMax };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const drawLine = (map, source, destination, xOffset) => {
    if (source.x === destination.x) {
        const increment = Math.sign(destination.y - source.y);
        for (
            let y = source.y;
            y !== destination.y + increment;
            y += increment
        ) {
            map[y][source.x - xOffset] = '#';
        }
        return;
    }
    if (source.y === destination.y) {
        const increment = Math.sign(destination.x - source.x);
        for (
            let x = source.x;
            x !== destination.x + increment;
            x += increment
        ) {
            map[source.y][x - xOffset] = '#';
        }
        return;
    }
    console.log("Can't draw diagonal lines");
};

const drawMap = (paths, xMax, yMax, xOffset = 0) => {
    const map = Array(yMax + 1)
        .fill()
        .map(() => Array(xMax + 1).fill('.'));
    paths.forEach((path) => {
        let curr = path[0];
        for (let i = 1; i < path.length; i++) {
            drawLine(map, curr, path[i], xOffset);
            curr = path[i];
        }
    });
    return map;
};

const isOutOfBounds = (map, x, y) => {
    return !map[y] || !map[y][x];
};

const getSandDir = (map, x, y) => {
    const directions = [
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: 1, y: 1 },
    ];
    for (let direction of directions) {
        if (
            isOutOfBounds(map, x + direction.x, y + direction.y) ||
            map[y + direction.y][x + direction.x] === '.'
        ) {
            return direction;
        }
    }
    return null;
};

const simulateFullGrain = (map, source) => {
    let currPos = { ...source };
    let direction = getSandDir(map, currPos.x, currPos.y);
    const positions = [currPos];
    while (direction) {
        currPos = {
            x: currPos.x + direction.x,
            y: currPos.y + direction.y,
        };
        if (isOutOfBounds(map, currPos.x, currPos.y)) {
            break;
        }
        positions.push(currPos);
        direction = getSandDir(map, currPos.x, currPos.y);
    }

    if (direction) {
        // sand fell out
        return false;
    }
    // sand settled
    map[currPos.y][currPos.x] = '+';
    return true;
};

const partOne = (input, output = false) => {
    const xMax = input.xMax - input.xMin;
    const xOffset = input.xMin;
    const map = drawMap(input.paths, xMax, input.yMax, xOffset);

    let settled = true;
    let grainCount = 0;
    while (settled) {
        settled = simulateFullGrain(map, { x: 500 - xOffset, y: 0 });
        grainCount++;
    }

    if (output) {
        drawImage(map, 4, { '+': 'rgba(180,150,0,1)' });
    }
    return grainCount - 1;
};

const partTwo = (input, output = false) => {
    const map = drawMap(input.paths, 1000, input.yMax + 2);
    map[map.length - 1] = Array(1001).fill('#');
    const source = { x: 500, y: 0 };
    let grainCount = 0;
    while (map[source.y][source.x] !== '+') {
        simulateFullGrain(map, source);
        grainCount++;
    }
    if (output) {
        drawImage(map, 4, { '+': 'rgba(180,150,0,1)' });
    }
    return grainCount;
};

assert.equal(partOne(inputSmall), 24);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 93);
console.log(partTwo(input, true));
