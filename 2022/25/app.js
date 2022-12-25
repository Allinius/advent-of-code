const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
};

const snafuValues = {
    '=': -2,
    '-': -1,
    [0]: 0,
    [1]: 1,
    [2]: 2,
    [-1]: '-', // works both ways
    [-2]: '=',
};

snafuToDec = (snafu) => {
    let res = 0;
    snafu
        .reverse()
        .map((c) => snafuValues[c])
        .forEach((n, i) => (res += n * Math.pow(5, i)));
    return res;
};

decToSnafu = (dec) => {
    const base5digits = Number(dec)
        .toString(5)
        .split('')
        .map((c) => parseInt(c));
    let remainder = 0;
    let snafuDigits = [];
    base5digits.reverse().forEach((base5digit) => {
        let snDigit = base5digit + remainder;
        if (snDigit >= 3) {
            remainder = 1;
            snDigit = snafuValues[snDigit - 5];
        } else {
            remainder = 0;
        }
        snafuDigits.unshift(snDigit);
    });
    if (remainder > 0) {
        snafuDigits.unshift(remainder);
    }
    return snafuDigits.join('');
};

const solve = (snafuNumbers) => {
    const decSum = snafuNumbers
        .map((sn) => snafuToDec(sn))
        .reduce((acc, n) => acc + n, 0);
    return decToSnafu(decSum);
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

assert.equal(solve(inputSmall), '2=-1=0');
console.log(solve(input));
