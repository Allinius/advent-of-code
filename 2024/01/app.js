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

const partOne = (input) => {
    const { first, second } = input.reduce(
        (res, pair) => {
            res.first.push(pair[0]);
            res.second.push(pair[1]);
            return res;
        },
        { first: [], second: [] }
    );
    first.sort();
    second.sort();
    return first.reduce(
        (res, id1, index) => res + Math.abs(id1 - second[index]),
        0
    );
};

const partTwo = (input) => {
    const { first, secondCount } = input.reduce(
        (res, pair) => {
            res.first.push(pair[0]);
            if (res.secondCount[pair[1]] != null) {
                res.secondCount[pair[1]]++;
            } else {
                res.secondCount[pair[1]] = 1;
            }
            return res;
        },
        { first: [], secondCount: {} }
    );
    return first.reduce(
        (res, id1) =>
            res + id1 * (secondCount[id1] != null ? secondCount[id1] : 0),
        0
    );
};

assert.equal(partOne(inputSmall), 11);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 31);
console.log(partTwo(input));
