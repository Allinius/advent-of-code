const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((l) => l.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const findMarkers = (signals, checkSize = 4) => {
    const results = [];
    signals.forEach((signal) => {
        for (let i = checkSize; i <= signal.length; i++) {
            const elems = signal.slice(i - checkSize, i);
            const elemSet = new Set(elems);
            if (elemSet.size === checkSize) {
                results.push(i);
                break;
            }
        }
    });
    return results;
};

assert.deepEqual(findMarkers(inputSmall), [7, 5, 6, 10, 11]);
console.log(findMarkers(input));

assert.deepEqual(findMarkers(inputSmall, 14), [19, 23, 23, 29, 26]);
console.log(findMarkers(input, 14));
