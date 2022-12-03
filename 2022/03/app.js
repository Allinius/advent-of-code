const fs = require('fs');
const assert = require('assert');
const arrayUtils = require('../../common/array-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) =>
            line.split('').map((c) => {
                const charCode = c.charCodeAt(0);
                return charCode >= 97 ? charCode - 96 : charCode - 38;
            })
        );
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (sacks) => {
    return sacks
        .map(
            (s) =>
                arrayUtils.intersection(
                    s.slice(0, s.length / 2),
                    s.slice(s.length / 2)
                )[0]
        )
        .reduce((sum, code) => sum + code);
};

const partTwo = (sacks) => {
    let groupItems = [];
    for (let i = 0; i < sacks.length; i += 3) {
        groupItems.push(
            arrayUtils.intersectionMulti(...sacks.slice(i, i + 3))[0]
        );
    }
    return groupItems.reduce((sum, code) => sum + code);
};

assert.equal(partOne(inputSmall), 157);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 70);
console.log(partTwo(input));
