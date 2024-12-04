const fs = require('fs');
const assert = require('assert');
const vec2d = require('../../common/vec2d');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const isXmas = (word, x, y, direction) => {
    const xmas = 'XMAS';
    let i = 0;
    let position = { x, y };
    while (i < xmas.length) {
        if (word?.[position.y]?.[position.x] !== xmas[i]) {
            return false;
        }
        position = vec2d.add(position, direction);
        i++;
    }
    return true;
};

const partOne = (word) => {
    let count = 0;
    word.forEach((line, y) =>
        line.forEach((letter, x) => {
            const directions = [
                { x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: -1 },
                { x: 1, y: 1 },
                { x: 1, y: -1 },
                { x: -1, y: 1 },
                { x: -1, y: -1 },
            ];
            count += directions.reduce(
                (acc, dir) => acc + (isXmas(word, x, y, dir) ? 1 : 0),
                0
            );
        })
    );
    return count;
};

const isExedMas = (word, x, y) => {
    if (word[y]?.[x] !== 'A') {
        return false;
    }
    const diagonals = [
        [
            { x: 1, y: 1 },
            { x: -1, y: -1 },
        ],
        [
            { x: 1, y: -1 },
            { x: -1, y: 1 },
        ],
    ];
    for (let directions of diagonals) {
        const neighbors = [];
        directions.forEach((dir) => {
            const pos = vec2d.add({ x, y }, dir);
            neighbors.push(word[pos.y]?.[pos.x]);
        });
        if (neighbors.indexOf('M') === -1 || neighbors.indexOf('S') === -1) {
            return false;
        }
    }
    return true;
};

const partTwo = (word) => {
    let count = 0;
    word.forEach((line, y) =>
        line.forEach((_, x) => {
            count += isExedMas(word, x, y) ? 1 : 0;
        })
    );
    return count;
};

assert.equal(partOne(inputSmall), 18);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 9);
console.log(partTwo(input));
