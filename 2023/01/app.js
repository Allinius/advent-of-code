const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs.readFileSync(fileName, 'utf-8').replace(/\r/g, '').split('\n');
};

const inputSmall = parseInput('input-small.txt');
const inputSmall2 = parseInput('input-small2.txt');
const input = parseInput('input.txt');

const partOne = (values) => {
    return values.reduce((sum, value) => {
        const filtered = value
            .split('')
            .filter((c) => !Number.isNaN(Number.parseInt(c)));
        return (
            sum + Number.parseInt(filtered[0] + filtered[filtered.length - 1])
        );
    }, 0);
};

partTwo = (values) => {
    const numbers = [
        { word: 'one', value: '1' },
        { word: 'two', value: '2' },
        { word: 'three', value: '3' },
        { word: 'four', value: '4' },
        { word: 'five', value: '5' },
        { word: 'six', value: '6' },
        { word: 'seven', value: '7' },
        { word: 'eight', value: '8' },
        { word: 'nine', value: '9' },
    ];
    return values.reduce((sum, value) => {
        let first;
        let last;
        for (let i = 0; i < value.length; i++) {
            const foundWord = numbers.find(
                (n) => value.slice(i, i + n.word.length) === n.word
            );
            const foundNumber = numbers.find((n) => value[i] === n.value);
            if (foundWord) {
                first = foundWord.value;
                break;
            }
            if (foundNumber) {
                first = foundNumber.value;
                break;
            }
        }
        for (let i = value.length; i > 0; i--) {
            const foundWord = numbers.find(
                (n) => value.slice(i - n.word.length, i) === n.word
            );
            const foundNumber = numbers.find((n) => value[i - 1] === n.value);
            if (foundWord) {
                last = foundWord.value;
                break;
            }
            if (foundNumber) {
                last = foundNumber.value;
                break;
            }
        }
        return sum + Number.parseInt(first + last);
    }, 0);
};

partTwoRegex = (values) => {
    const nameStrings = [
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
    ];
    const firstRegex = new RegExp(`\\d|${nameStrings.join('|')}`);
    const lastRegex = new RegExp(
        `\\d|${nameStrings
            .map((n) => n.split('').reverse().join(''))
            .join('|')}`
    );
    return values.reduce((sum, value) => {
        let first = firstRegex.exec(value);
        let last = lastRegex.exec(value.split('').reverse().join(''));
        const firstNum =
            first[0].length === 1
                ? first[0]
                : nameStrings.indexOf(first[0]) + 1;
        const lastNum =
            last[0].length === 1
                ? last[0]
                : nameStrings.indexOf(last[0].split('').reverse().join('')) + 1;
        return sum + Number.parseInt('' + firstNum + lastNum);
    }, 0);
};

assert.equal(partOne(inputSmall), 142);
console.log(partOne(input));

assert.equal(partTwo(inputSmall2), 281);
assert.equal(partTwoRegex(inputSmall2), 281);
console.log(partTwoRegex(input));
