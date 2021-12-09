const fs = require('fs');
const assert = require('assert');
const arrayUtils = require('../array-utils');

const parseInput = (fileName) => {
    return fs.readFileSync(fileName, 'utf-8')
        .split('\n')
        .map(d => d.split(' | ')
            .map(c => c.split(' ')
                .map(s => s.split(''))    
            )
        )
}

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (signals) => {
    let simpleDigitCount = 0;
    signals.forEach(s => {
        const outputs = s[1];
        simpleDigitCount += outputs.reduce((prev, curr) => {
            if (curr.length === 2 || curr.length === 3 || curr.length === 4 || curr.length === 7) {
                return prev + 1;
            }
            return prev;
        }, 0);
    });
    return simpleDigitCount;
}

const testSetup = (definedNumbers, mappings, inputs) => {
    const mappedNumbers = definedNumbers.map(number => number.map(letter => mappings.get(letter)));

    for (let i = 0; i < definedNumbers.length; i++) {
        const mappedNumber = definedNumbers[i].map(letter => mappings.get(letter));
        const inputIndex = inputs.findIndex(input => {
            return arrayUtils.simpleIdentity(input, mappedNumber);
        });
        if (inputIndex === -1) {
            return false;
        }
    }

    return true;
}

const decodeNumber = (definedNumbers, number, mapping) => {
    return definedNumbers.findIndex(num => arrayUtils.simpleIdentity(num.map(letter => mapping.get(letter)), number));
}

const partTwo = (signals) => {
    const definedNumbers = [
        ['a', 'b', 'c', 'e', 'f', 'g'],
        ['c', 'f'],
        ['a', 'c', 'd', 'e', 'g'],
        ['a', 'c', 'd', 'f', 'g'],
        ['b', 'c', 'd', 'f'],
        ['a', 'b', 'd', 'f', 'g'],
        ['a', 'b', 'd', 'e', 'f', 'g'],
        ['a', 'c', 'f'],
        ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        ['a', 'b', 'c', 'd', 'f', 'g']
    ];
    let sum = 0;
    signals.forEach(s => {
        const inputs = s[0];
        const outputs = s[1];

        const i1 = inputs.find(i => i.length === 2);
        const i7 = inputs.find(i => i.length === 3);

        const mappings = new Map();
        mappings.set('a', arrayUtils.difference(i7, i1)[0]);

        const allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        const trueLetters = allLetters.slice(1);
        const inputLetters = allLetters.filter(letter => letter != mappings.get('a'))
        const permutations = arrayUtils.permutate(inputLetters);
        let trueMapping;
        permutations.forEach(permutation => {
            if (trueMapping) {
                return;
            }
            const mappingsCandidate = new Map(mappings);
            trueLetters.forEach((trueLetter, i) => {
                mappingsCandidate.set(trueLetter, permutation[i]);
            });
            if (testSetup(definedNumbers, mappingsCandidate, inputs)) {
                trueMapping = mappingsCandidate;
            }
        });
        if (!trueMapping) {
            console.log('no mapping found');
            return;
        }
        const result = parseInt(outputs.reduce((acc, curr) => acc + decodeNumber(definedNumbers, curr, trueMapping), ''));
        sum += result;
    });
    return sum;
}

const small1 = partOne(inputSmall);
const small2 = partTwo(inputSmall);
assert.deepEqual(small1, 26);
assert.deepEqual(small2, 61229);

console.log(partOne(input));
console.log(partTwo(input));