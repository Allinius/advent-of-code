const fs = require('fs');
const assert = require('assert');
const { drawImage } = require('../../common/image-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const solve = (inp) => {
    const input = structuredClone(inp);

    var splitCount = 0;
    input.forEach((line, y) => {
        if (y === 0) {
            return;
        }
        line.forEach((cell, x) => {
            if (['.', '^'].includes(input[y - 1][x])) {
                return;
            }
            const beamCount = input[y - 1][x] === 'S' ? 1 : input[y - 1][x];
            if (cell === '.') {
                input[y][x] = beamCount;
            }

            if (cell === '^') {
                splitCount++;
                const beamXs = [x - 1, x + 1];
                beamXs.forEach((bx) => {
                    if (input[y][bx] === '.') {
                        input[y][bx] = beamCount;
                    } else {
                        input[y][bx] += beamCount;
                    }
                });
            } else {
                input[y][x] = cell === '.' ? beamCount : cell + beamCount;
            }
        });
    });
    // drawImage(input);

    return {
        splits: splitCount,
        timelines: input[input.length - 1].reduce((sum, cell) =>
            cell !== '.' ? sum + cell : sum
        ),
    };
};

assert.equal(solve(inputSmall).splits, 21);
console.log(solve(input).splits);
assert.equal(solve(inputSmall).timelines, 40);
console.log(solve(input).timelines);
