const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.replace(/\s+/g, ' ').split(' ').map(Number));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const isSafe = (levels) => {
    let sign;
    return levels.reduce((res, curr, index) => {
        if (index === 0) {
            return true;
        }
        const prev = levels[index - 1];
        if (sign == null) {
            sign = Math.sign(curr - prev);
        } else if (Math.sign(curr - prev) !== sign) {
            return false;
        }
        if (Math.abs(curr - prev) < 1 || Math.abs(curr - prev) > 3) {
            return false;
        }
        return res;
    }, true);
};

const partOne = (input) => {
    return input.reduce((acc, levels) => (isSafe(levels) ? acc + 1 : acc), 0);
};

const partTwo = (input) => {
    return input.reduce((acc, levels) => {
        const poss = levels.map((_, index) => levels.toSpliced(index, 1));
        poss.push(levels);
        return poss.some((levels) => isSafe(levels)) ? acc + 1 : acc;
    }, 0);
};

assert.equal(partOne(inputSmall), 2);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 4);
console.log(partTwo(input));
