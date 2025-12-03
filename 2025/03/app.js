const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split('').map(Number));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    return input.reduce((sum, bank) => {
        return sum + findMax(bank, 2);
    }, 0);
};

const partTwo = (input) => {
    return input.reduce((sum, bank) => {
        return sum + findMax(bank, 12);
    }, 0);
};

const findMax = (bank, length) => {
    return Number(
        bank
            .reduce((acc, bat) => {
                if (acc.length < length) {
                    acc.push(bat);
                    return acc;
                }
                const swaps = [acc];
                acc.forEach((i, index) => {
                    swaps.push([...acc.toSpliced(index, 1), bat]);
                });
                return Math.max(...swaps.map((s) => Number(s.join(''))))
                    .toString()
                    .split('');
            }, [])
            .join('')
    );
};

assert.equal(partOne(inputSmall), 357);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 3121910778619);
console.log(partTwo(input));
