const fs = require('fs');
const assert = require('assert');
const vec2d = require('../../common/vec2d');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (mirrorMap) => {
    return solveBeam(mirrorMap, { x: 0, y: 0 }, { x: 1, y: 0 });
};

const solveBeam = (mirrorMap, startPos, startDir) => {
    const beamMap = shootBeam(mirrorMap, startPos, startDir);
    return countEnergized(beamMap);
};

const shootBeam = (mirrorMap, startPos, startDir) => {
    const beamMap = Array(mirrorMap.length)
        .fill()
        .map((line) =>
            Array(mirrorMap[0].length)
                .fill()
                .map((tile) => ({}))
        );

    const stack = [{ position: startPos, direction: startDir }];

    while (stack.length > 0) {
        const current = stack.pop();
        if (
            current.position.x < 0 ||
            current.position.y < 0 ||
            current.position.x >= mirrorMap[0].length ||
            current.position.y >= mirrorMap.length
        ) {
            continue;
        }
        const dirKey = [current.direction.x, current.direction.y].toString();
        if (beamMap[current.position.y][current.position.x][dirKey] == null) {
            beamMap[current.position.y][current.position.x][dirKey] = true;
        } else {
            continue;
        }

        const tile = mirrorMap[current.position.y][current.position.x];
        if (tile === '/' || tile === '\\') {
            const sign = tile === '/' ? -1 : 1;
            const newDirection = {
                x: sign * current.direction.y,
                y: sign * current.direction.x,
            };
            stack.push({
                position: vec2d.add(current.position, newDirection),
                direction: newDirection,
            });
            continue;
        }
        if (
            (current.direction.x !== 0 && tile === '|') ||
            (current.direction.y !== 0 && tile === '-')
        ) {
            const firstDir = { x: current.direction.y, y: current.direction.x };
            const secondDir = {
                x: -current.direction.y,
                y: -current.direction.x,
            };
            stack.push({
                position: vec2d.add(current.position, firstDir),
                direction: firstDir,
            });
            stack.push({
                position: vec2d.add(current.position, secondDir),
                direction: secondDir,
            });
            continue;
        }
        stack.push({
            position: vec2d.add(current.position, current.direction),
            direction: current.direction,
        });
    }
    return beamMap;
};

const countEnergized = (beamMap) => {
    return beamMap.reduce(
        (acc, line) =>
            acc +
            line.reduce(
                (lineAcc, beams) =>
                    Object.keys(beams).length > 0 ? lineAcc + 1 : lineAcc,
                0
            ),
        0
    );
};

const partTwo = (mirrorMap) => {
    let max = 0;

    mirrorMap.forEach((line, y) => {
        max = Math.max(max, solveBeam(mirrorMap, { x: 0, y }, { x: 1, y: 0 }));
        max = Math.max(
            max,
            solveBeam(mirrorMap, { x: line.length - 1, y }, { x: -1, y: 0 })
        );
    });
    mirrorMap[0].forEach((_, x) => {
        max = Math.max(max, solveBeam(mirrorMap, { x, y: 0 }, { x: 0, y: 1 }));
        max = Math.max(
            max,
            solveBeam(
                mirrorMap,
                { x, y: mirrorMap.length - 1 },
                { x: 0, y: -1 }
            )
        );
    });
    return max;
};

assert.equal(partOne(inputSmall), 46);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 51);
console.log(partTwo(input));
