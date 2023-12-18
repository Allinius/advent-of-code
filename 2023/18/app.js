const fs = require('fs');
const assert = require('assert');
const { positiveModulo } = require('../../common/number-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const [direction, length, color] = line.split(' ');
            return [direction, parseInt(length), color.replace(/\(|\)/g, '')];
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (instructions) => {
    const [vertical, horizontal, min, max] = getLines(instructions);
    let area = 0;
    for (let y = min.y; y <= max.y; y++) {
        const onLine = horizontal.filter((h) => h.y === y);
        const perpendicular = vertical.filter((v) => v.y[0] < y && v.y[1] > y);
        const intersections = [...onLine, ...perpendicular];
        intersections.sort(
            (a, b) =>
                (Array.isArray(a.x) ? a.x[0] : a.x) -
                (Array.isArray(b.x) ? b.x[0] : b.x)
        );
        let startPos;
        intersections.forEach((line, i) => {
            if (line.type === 'U') {
                if (startPos == null) {
                    area += line.x[1] - line.x[0] + 1;
                }
                return;
            }
            if (line.type === 'Z') {
                if (startPos == null) {
                    startPos = line.x[0];
                } else {
                    area += line.x[1] - startPos + 1;
                    startPos = null;
                }
                return;
            }
            if (startPos == null) {
                startPos = line.x;
            } else {
                area += line.x - startPos + 1;
                startPos = null;
            }
        });
    }
    return area;
};

const partTwo = (instructions) => {
    const trueInstructions = [];
    instructions.forEach(([, , color]) => {
        trueInstructions.push(decodeInstruction(color));
    });

    return partOne(trueInstructions);
};

const decodeInstruction = (hexString) => {
    const length = parseInt(hexString.slice(1, 6), 16);
    const directions = ['R', 'D', 'L', 'U'];
    const direction = directions[hexString.slice(6, 7)];
    return [direction, length];
};

const getLines = (instructions) => {
    const vertical = [];
    const horizontal = [];
    let currPos = { x: 0, y: 0 };
    let min = { x: 0, y: 0 };
    let max = { x: 0, y: 0 };
    let previous = [];

    instructions.forEach(([direction, length], i) => {
        const prevDirection =
            instructions[positiveModulo(i - 1, instructions.length)][0];
        const nextDirection =
            instructions[positiveModulo(i + 1, instructions.length)][0];
        switch (direction) {
            case 'R':
                horizontal.push({
                    x: [currPos.x, currPos.x + length],
                    y: currPos.y,
                    type: prevDirection === nextDirection ? 'Z' : 'U',
                });
                currPos = { ...currPos, x: currPos.x + length };
                break;
            case 'L':
                horizontal.push({
                    x: [currPos.x - length, currPos.x],
                    y: currPos.y,
                    type: prevDirection === nextDirection ? 'Z' : 'U',
                });
                currPos = { ...currPos, x: currPos.x - length };
                break;
            case 'D':
                vertical.push({
                    x: currPos.x,
                    y: [currPos.y, currPos.y + length],
                });
                currPos = { ...currPos, y: currPos.y + length };
                break;
            case 'U':
                vertical.push({
                    x: currPos.x,
                    y: [currPos.y - length, currPos.y],
                });
                currPos = { ...currPos, y: currPos.y - length };
                break;
        }
        min.x = Math.min(min.x, currPos.x);
        min.y = Math.min(min.y, currPos.y);
        max.x = Math.max(max.x, currPos.x);
        max.y = Math.max(max.y, currPos.y);
    });
    return [vertical, horizontal, min, max];
};

assert.equal(partOne(inputSmall), 62);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 952408144115);
console.log(partTwo(input));
