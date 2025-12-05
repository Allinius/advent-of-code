const fs = require('fs');
const assert = require('assert');
const { intervalUnion } = require('../../common/number-utils');

const parseInput = (fileName) => {
    const [ranges, ids] = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');
    return {
        ranges: ranges.split('\n').map((line) => line.split('-').map(Number)),
        ids: ids.split('\n').map(Number),
    };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = ({ ranges, ids }) => {
    return ids.reduce(
        (count, id) =>
            ranges.some((range) => isInRange(id, range)) ? count + 1 : count,
        0
    );
};

const isInRange = (id, range) => {
    return id >= range[0] && id <= range[1];
};

const partTwo = ({ ranges, ids }) => {
    const mappedRanges = ranges.map(([start, end]) => ({ start, end }));
    const unionRanges = intervalUnion(mappedRanges);
    return unionRanges.reduce(
        (sum, range) => sum + range.end - range.start + 1,
        0
    );
};

assert.equal(partOne(inputSmall), 3);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 14);
console.log(partTwo(input));
