const fs = require('fs');
const assert = require('assert');
const { getSurrounding } = require('../../common/array-2d-util');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    return getAccessible(input).length;
};

const getAccessible = (input) => {
    var count = 0;
    const rolls = [];
    input.forEach((line, y) => {
        line.forEach((cell, x) => {
            if (cell !== '@') {
                return;
            }
            const paperSurrounding = getSurrounding(input, x, y, true).filter(
                (n) => n.value === '@'
            ).length;
            if (paperSurrounding < 4) {
                count++;
                rolls.push({ x, y });
            }
        });
    });
    return rolls;
};

const partTwo = (input) => {
    var count = 0;
    var accessible;
    do {
        accessible = getAccessible(input);
        count += accessible.length;
        accessible.forEach((pos) => {
            input[pos.y][pos.x] = '.';
        });
    } while (accessible.length > 0);
    return count;
};

assert.equal(partOne(inputSmall), 13);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 43);
console.log(partTwo(input));
