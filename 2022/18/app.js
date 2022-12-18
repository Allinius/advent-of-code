const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const cubeSet = new Set();
    const max = { x: 0, y: 0, z: 0 };
    const cubes = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            parts = line.split(',').map((c) => parseInt(c) + 1);
            cubeSet.add(parts.join(','));
            max.x = Math.max(max.x, parts[0]);
            max.y = Math.max(max.y, parts[1]);
            max.z = Math.max(max.z, parts[2]);
            return {
                x: parts[0],
                y: parts[1],
                z: parts[2],
            };
        });

    return {
        cubes,
        cubeSet,
        max,
    };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    const cubes = input.cubes;
    let result = 0;
    result = cubes.reduce((acc, first) => {
        let sides = 6;
        const directions = [
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: -1 },
        ];
        directions.forEach((d) => {
            const key = `${first.x + d.x},${first.y + d.y},${first.z + d.z}`;
            if (input.cubeSet.has(key)) {
                sides--;
            }
        });
        return acc + sides;
    }, 0);
    return result;
};

const outOfBounds = (pos, max) => {
    return (
        pos.x < 0 ||
        pos.y < 0 ||
        pos.z < 0 ||
        pos.x > max.x + 1 ||
        pos.y > max.y + 1 ||
        pos.z > max.z + 1
    );
};

const expandGas = (cubeSet, max) => {
    const origin = { x: 0, y: 0, z: 0 };
    const directions = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 0, y: 0, z: -1 },
    ];
    let result = 0;
    const visited = new Set([origin]);
    const toOpen = [origin];
    while (toOpen.length > 0) {
        const current = toOpen.pop();

        directions.forEach((d) => {
            const newPos = {
                x: current.x + d.x,
                y: current.y + d.y,
                z: current.z + d.z,
            };
            if (outOfBounds(newPos, max)) {
                return;
            }
            const key = `${newPos.x},${newPos.y},${newPos.z}`;
            if (!visited.has(key) && !cubeSet.has(key)) {
                toOpen.push(newPos);
                visited.add(key);
            }
            if (cubeSet.has(key)) {
                result++;
            }
        });
    }
    return result;
};

const partTwo = (input) => {
    return expandGas(input.cubeSet, input.max);
};

assert.equal(partOne(inputSmall), 64);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 58);
console.log(partTwo(input));
