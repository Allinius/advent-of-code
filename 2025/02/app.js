const fs = require('fs');
const assert = require('assert');
const { positiveModulo } = require('../../common/number-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split(',')
        .map(range => range.split('-').map(Number));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (ranges) => {
    const max = ranges.reduce((max, range) => range[1] > max ? range[1] : max, 0)
    const maxLength = max.toString().length;

    var sum = 0;
    for (let length = 2; length <= maxLength; length += 2) {
        const ids = generateIds(length)
        
        ids.forEach(id => {
            var count = ranges.filter(range => id >= range[0] && id <= range[1]).length
            sum += count * id;
        })
    }
    return sum
};

const generateIds = (length) => {
    if (length % 2 === 1) {
        return [];
    }
    const maxHalf = Number(Array(length / 2).fill(9).join(''))
    const minHalf = Number(Array(length / 2 - 1).fill(9).join('')) + 1
    const ids = [];
    for (let i = maxHalf; i >= minHalf; i--) {
        ids.push(Number(`${i}${i}`))
    }
    return ids;
}

const partTwo = (ranges) => {
    const max = ranges.reduce((max, range) => range[1] > max ? range[1] : max, 0)
    const maxLength = max.toString().length;

    var sum = 0;
    for (let length = 2; length <= maxLength; length++) {
        const ids = generateIdsAll(length)
        
        ids.forEach(id => {
            var count = ranges.filter(range => id >= range[0] && id <= range[1]).length
            sum += count * id;
        })
    }
    return sum;
};


const generateIdsAll = (length) => {
    const ids = new Set();
    for (let len = Math.floor(length / 2); len > 0; len--) {
        if (length % len !== 0) {
            continue;
        }
        const count = length / len;
        const maxPart = Number(Array(len).fill(9).join(''))
        const minPart = Number(Array(len - 1).fill(9).join('')) + 1

        for (let i = maxPart; i >= minPart; i--) {
            ids.add(Number(Array(count).fill(i).join('')))
        }
    }
    
    return Array.from(ids);
}


assert.equal(partOne(inputSmall), 1227775554);
console.log(partOne(input));

assert.equal(partTwo(inputSmall), 4174379265);
console.log(partTwo(input));
