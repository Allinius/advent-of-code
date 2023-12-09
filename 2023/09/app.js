const fs = require('fs');
const assert = require('assert');
const { arrayLCM } = require('../../common/number-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(' ').map((s) => Number.parseInt(s)));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partBoth = (sequences) => {
    return sequences.reduce(
        (acc, sequence) => {
            const res = findPrevNext(sequence);
            return {
                next: acc.next + res.next,
                prev: acc.prev + res.prev,
            };
        },
        { next: 0, prev: 0 }
    );
};

const findPrevNext = (sequence) => {
    const idk = [[...sequence]];
    while (idk[idk.length - 1].find((n) => n !== 0)) {
        const newLine = [];
        idk[idk.length - 1].forEach((n, i) => {
            if (i === 0) {
                return;
            }
            newLine.push(n - idk[idk.length - 1][i - 1]);
        });
        idk.push(newLine);
    }
    idk.reverse().forEach((line, i) => {
        if (i === 0) {
            line.unshift(0);
            line.push(0);
            return;
        }
        line.push(line[line.length - 1] + idk[i - 1][idk[i - 1].length - 1]);
        line.unshift(line[0] - idk[i - 1][0]);
    });
    return {
        prev: idk[idk.length - 1][0],
        next: idk[idk.length - 1][idk[idk.length - 1].length - 1],
    };
};

const resultSmall = partBoth(inputSmall);
assert.equal(resultSmall.next, 114);
assert.equal(resultSmall.prev, 2);
const result = partBoth(input);
console.log(result);
