const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const rpsValues = [
        ['A', 'X'],
        ['B', 'Y'],
        ['C', 'Z'],
    ];
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((turn) =>
            turn.split(' ').map((c) => {
                return rpsValues.findIndex((chars) => chars.indexOf(c) >= 0);
            })
        );
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const rpsMatrix = [
    [3, 6, 0],
    [0, 3, 6],
    [6, 0, 3],
];

const partOne = (turns) => {
    return turns.reduce((score, turn) => {
        const winBonus = rpsMatrix[turn[0]][turn[1]];
        return score + winBonus + turn[1] + 1;
    }, 0);
};

const partTwo = (turns) => {
    return turns.reduce((score, turn) => {
        const winBonus = 3 + 3 * (turn[1] - 1);
        const signBonus = rpsMatrix[turn[0]].indexOf(winBonus) + 1;
        return score + winBonus + signBonus;
    }, 0);
};

assert.equal(partOne(inputSmall), 15);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 12);
console.log(partTwo(input));
