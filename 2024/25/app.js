const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const segments = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');
    const keys = [];
    const locks = [];
    segments.forEach((segment) => {
        const lines = segment.split('\n');
        heights = [];
        const type = lines[0][0] === '.' ? 'key' : 'lock';
        lines[0].split('').forEach((_, col) => {
            heights.push(
                lines
                    .slice(1, -1)
                    .reduce(
                        (count, line) =>
                            line[col] === '#' ? count + 1 : count,
                        0
                    )
            );
        });
        if (lines[0][0] === '.') {
            keys.push(heights);
        } else {
            locks.push(heights);
        }
    });
    return { locks, keys };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const keyFits = (key, lock) => {
    return key.every((height, index) => height + lock[index] <= 5);
};

const partOne = (input) => {
    return input.locks.reduce(
        (total, lock) =>
            total +
            input.keys.reduce(
                (lockCount, key) => lockCount + keyFits(key, lock),
                0
            ),
        0
    );
};

assert.equal(partOne(inputSmall), 3);
console.log(partOne(input));
