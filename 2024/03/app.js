const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs.readFileSync(fileName, 'utf-8').replace(/\r/g, '');
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    const regex = /mul\(\d+,\d+\)/g;
    const muls = input.match(regex);
    return muls.reduce((sum, inst) => {
        const [first, second] = inst
            .slice(4)
            .slice(null, -1)
            .split(',')
            .map(Number);
        return sum + first * second;
    }, 0);
};

const partTwo = (input) => {
    const regex = /(mul\(\d+,\d+\)|(don't\(\))|do\(\))/g;
    const instructions = input.match(regex);

    while (instructions.indexOf("don't()") >= 0) {
        const dontIndex = instructions.indexOf("don't()");
        let nextDo = instructions.slice(dontIndex).indexOf('do()');
        nextDo = nextDo >= 0 ? nextDo : Infinity;
        instructions.splice(dontIndex, nextDo + 1);
    }

    return instructions
        .filter((i) => i !== 'do()')
        .reduce((sum, inst) => {
            const [first, second] = inst
                .slice(4)
                .slice(null, -1)
                .split(',')
                .map(Number);
            return sum + first * second;
        }, 0);
};

assert.equal(partOne(inputSmall), 161);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 48);
console.log(partTwo(input));
