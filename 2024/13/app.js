const fs = require('fs');
const assert = require('assert');
const { LCM } = require('../../common/number-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n')
        .map((segment) => {
            const [buttonA, buttonB, prize] = segment.split('\n');
            return {
                buttonA: buttonA.match(/\d+/g).map(Number),
                buttonB: buttonB.match(/\d+/g).map(Number),
                prize: prize.match(/\d+/g).map(Number),
            };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

// res1 = a1x + b1y
// res2 = a2x + b2y
const solve = (res1, a1, b1, res2, a2, b2) => {
    const aLCM = LCM(a1, a2);
    const a1Mult = aLCM / a1;
    const a2Mult = aLCM / a2;
    const left = a1Mult * res1 - a2Mult * res2;
    const rightYMult = a1Mult * b1 + a2Mult * -b2;
    const y = left / rightYMult;
    const x = (res1 - y * b1) / a1;
    return { x, y };
};

const partOne = (machines) => {
    return machines.reduce((presses, machine) => {
        const answer = solve(
            machine.prize[0],
            machine.buttonA[0],
            machine.buttonB[0],
            machine.prize[1],
            machine.buttonA[1],
            machine.buttonB[1]
        );
        if (
            Number.isInteger(answer.x) &&
            Number.isInteger(answer.y) &&
            answer.x < 100 &&
            answer.y < 100
        ) {
            return presses + 3 * answer.x + answer.y;
        }
        return presses;
    }, 0);
};

const partTwo = (machines) => {
    return machines.reduce((presses, machine) => {
        const answer = solve(
            10000000000000 + machine.prize[0],
            machine.buttonA[0],
            machine.buttonB[0],
            10000000000000 + machine.prize[1],
            machine.buttonA[1],
            machine.buttonB[1]
        );
        if (Number.isInteger(answer.x) && Number.isInteger(answer.y)) {
            return presses + 3 * answer.x + answer.y;
        }
        return presses;
    }, 0);
};

assert.equal(partOne(inputSmall), 480);
console.log(partOne(input));
console.log(partTwo(input));
