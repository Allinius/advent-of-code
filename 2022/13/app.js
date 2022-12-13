const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n')
        .map((pair) => pair.split('\n').map((line) => JSON.parse(line)));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const comparePair = (a, b) => {
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
            const diff = comparePair(a[i], b[i]);
            if (diff !== 0) {
                return diff;
            }
        }
        return a.length - b.length;
    }
    return typeof a === 'number' ? comparePair([a], b) : comparePair(a, [b]);
};

const partOne = (pairs) => {
    let res = 0;
    pairs.forEach((pair, i) => {
        if (comparePair(pair[0], pair[1]) < 0) {
            res += i + 1;
        }
    });
    return res;
};

const partTwo = (pairs) => {
    const div1 = [[2]];
    const div2 = [[6]];
    const packets = [div1, div2];
    pairs.forEach((pair) => {
        packets.push(...pair);
    });
    packets.sort(comparePair);
    const div1Index = packets.indexOf(div1) + 1;
    const div2Index = packets.indexOf(div2) + 1;
    return div1Index * div2Index;
};

assert.equal(partOne(inputSmall), 13);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 140);
console.log(partTwo(input));
