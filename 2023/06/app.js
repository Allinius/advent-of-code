const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const parts = line.replace(/\s+/g, ' ').split(':');
            return parts[1]
                .trim()
                .split(' ')
                .map((numString) => Number.parseInt(numString));
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    return input[0].reduce((result, time, index) => {
        const record = input[1][index];
        let winCount = 0;
        for (let charge = 1; charge < time; charge++) {
            if ((time - charge) * charge > record) {
                winCount++;
            }
        }
        return result ? result * winCount : winCount;
    }, null);
};

const partTwo = (input) => {
    const time = Number.parseInt(input[0].reduce((str, n) => str + n, ''));
    const record = Number.parseInt(input[1].reduce((str, n) => str + n, ''));

    let firstWin, lastWin;
    for (let charge = 1; charge < time / 2; charge++) {
        if (!firstWin && (time - charge) * charge > record) {
            firstWin = charge;
        }
        const oppositeCharge = time - charge;
        if (!lastWin && (time - charge) * charge > record) {
            lastWin = oppositeCharge;
        }
        if (firstWin && lastWin) {
            break;
        }
    }

    return lastWin - firstWin + 1;
};

assert.equal(partOne(inputSmall), 288);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 71503);
console.log(partTwo(input));
