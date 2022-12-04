const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) =>
            line
                .split(',')
                .map((assig) => assig.split('-').map((s) => parseInt(s)))
        );
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const assigContains = (assig1, assig2) => {
    return assig1[0] <= assig2[0] && assig1[1] >= assig2[1];
};

const assigsOverlap = (assig1, assig2) => {
    return assig1[1] >= assig2[0] && assig1[0] <= assig2[1];
};

const partOne = (elfAssigs) => {
    return elfAssigs.filter(
        (assigs) =>
            assigContains(assigs[0], assigs[1]) ||
            assigContains(assigs[1], assigs[0])
    ).length;
};

const partTwo = (elfAssigs) => {
    return elfAssigs.filter((assigs) => assigsOverlap(assigs[0], assigs[1]))
        .length;
};

assert.equal(partOne(inputSmall), 2);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 4);
console.log(partTwo(input));
