const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs.readFileSync(fileName, 'utf-8').replace(/\r/g, '').split(',');
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    return input.reduce((acc, str) => acc + hashString(str), 0);
};

const hashString = (str) => {
    return str
        .split('')
        .reduce((acc, char) => (17 * (acc + char.charCodeAt())) % 256, 0);
};

const partTwo = (input) => {
    const instructions = input.map((str) => {
        if (str.indexOf('=') >= 0) {
            const [label, focalLength] = str.split('=');
            return {
                label,
                focalLength: parseInt(focalLength),
            };
        }
        return { label: str.slice(0, -1) };
    });
    const boxes = Array(256)
        .fill()
        .map((e) => []);
    instructions.forEach((instruction) => {
        const hash = hashString(instruction.label);
        const lensIndex = boxes[hash].findIndex(
            (box) => box.label === instruction.label
        );

        if (lensIndex === -1) {
            if (instruction.focalLength == null) {
                return;
            }
            boxes[hash].push(instruction);
        }
        boxes[hash].splice(
            lensIndex,
            1,
            ...(instruction.focalLength == null ? [] : [instruction])
        );
    });
    return boxes.reduce(
        (acc, box, boxIndex) =>
            acc +
            box.reduce(
                (boxAcc, lens, lensIndex) =>
                    boxAcc +
                    (boxIndex + 1) * (lensIndex + 1) * lens.focalLength,
                0
            ),
        0
    );
};

assert.equal(partOne(inputSmall), 1320);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 145);
console.log(partTwo(input));
