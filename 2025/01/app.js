const fs = require('fs');
const assert = require('assert');
const { positiveModulo } = require('../../common/number-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => ({dir: line[0], count: Number(line.slice(1))}));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input, start = 50) => {
    let curr = start;
    let zeros = 0;
    input.forEach(inst => {
        const sign = inst.dir === 'R' ? 1 : -1;
        curr = positiveModulo(curr + sign * inst.count, 100);
        if (curr === 0){
            zeros++;
        }
    });
    return zeros
};

const partTwo = (input, start = 50) => {
    let curr = start;
    let zeros = 0;
    input.forEach(inst => {
        const sign = inst.dir === 'R' ? 1 : -1;
        for (let i = 0; i < inst.count; i++) {
            curr = positiveModulo(curr + sign, 100);
            if (curr === 0){
                zeros++;
            }
        }
    });
    return zeros;
};


assert.equal(partOne(inputSmall), 3);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 6);
console.log(partTwo(input));
