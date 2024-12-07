const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line, y) => {
            const [resultPart, numbersPart] = line.split(': ');
            return {
                result: Number(resultPart),
                numbers: numbersPart.split(' ').map(Number),
            };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const getPossibleResults = (numbers, doConcat = false) => {
    if (numbers.length === 1) {
        return numbers;
    }

    const results = getPossibleResults(numbers.slice(0, -1), doConcat);
    return results.reduce((acc, partialResult) => {
        acc.push(partialResult + numbers[numbers.length - 1]);
        acc.push(partialResult * numbers[numbers.length - 1]);
        if (doConcat) {
            acc.push(Number(`${partialResult}${numbers[numbers.length - 1]}`));
        }
        return acc;
    }, []);
};

const sumValidResults = (equations, doConcat = false) => {
    return equations.reduce((acc, equation) => {
        const results = getPossibleResults(equation.numbers, doConcat);
        if (results.indexOf(equation.result) >= 0) {
            return acc + equation.result;
        }
        return acc;
    }, 0);
};

assert.equal(sumValidResults(inputSmall), 3749);
console.log(sumValidResults(input));
assert.equal(sumValidResults(inputSmall, true), 11387);
console.log(sumValidResults(input, true));
