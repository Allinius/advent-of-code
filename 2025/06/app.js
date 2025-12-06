const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const input = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
    for (let i = 0; i < input[input.length - 1].length - 1; i++) {
        if (input[input.length - 1][i + 1] !== ' ') {
            for (let line = 0; line < input.length; line++) {
                input[line][i] = '_';
            }
        }
    }
    return input.map((line) => line.join('').split('_'));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    let sum = 0;
    for (let col = 0; col < input[0].length; col++) {
        var result = input[0][col];
        const operator = input[input.length - 1][col];
        for (let line = 1; line < input.length - 1; line++) {
            result = eval(`${result}${operator}${input[line][col]}`);
        }
        sum += result;
    }
    return sum;
};

const partTwo = (origInput) => {
    const input = origInput.map((line) =>
        line.map((part) => part.split('')).flat()
    );
    const newInput = [];
    var currOp;
    for (let col = 0; col < input[0].length; col++) {
        if (input[input.length - 1][col] !== ' ') {
            if (currOp) {
                newInput[newInput.length - 1].push(currOp);
            }
            currOp = input[input.length - 1][col];
            newInput.push([]);
        }
        var currNum = '';
        for (let line = 0; line < input.length - 1; line++) {
            currNum += input[line][col];
        }
        newInput[newInput.length - 1].push(currNum);
    }

    if (currOp) {
        newInput[newInput.length - 1].push(currOp);
    }
    var sum = 0;
    newInput.forEach((group) => {
        var result = group[0];
        const operator = group[group.length - 1];
        for (let i = 1; i < group.length - 1; i++) {
            result = eval(`${result}${operator}${group[i]}`);
        }
        sum += result;
    });
    return sum;
};

assert.equal(partOne(inputSmall), 4277556);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 3263827);
console.log(partTwo(input));
