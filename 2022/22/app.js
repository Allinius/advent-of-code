const fs = require('fs');
const assert = require('assert');
const { positiveModulo } = require('../../common/number-utils');
const vec2d = require('../../common/vec2d');

const parseInput = (fileName) => {
    const [mapLines, instructionRow] = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');
    const map = mapLines.split('\n').map((line) => line.split(''));

    const instructions = instructionRow
        .replace(/R/g, ';R;')
        .replace(/L/g, ';L;')
        .split(';')
        .map((inst) => (inst !== 'L' && inst !== 'R' ? parseInt(inst) : inst));
    return { map, instructions };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const changeDirection = (turn, position) => {
    const newDirIndex = positiveModulo(
        position.direction + (turn === 'R' ? 1 : -1),
        4
    );
    return {
        ...position,
        direction: newDirIndex,
        dirVector: getDirVector(newDirIndex),
    };
};

const getDirVector = (direction) => {
    const dirVectors = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
    ];
    return dirVectors[direction];
};

const step = (position, map) => {
    let newPos = vec2d.add(position, position.dirVector);
    newPos.y = positiveModulo(newPos.y, map.length);
    newPos.x = positiveModulo(newPos.x, map[position.y].length);

    while (map[newPos.y][newPos.x] === ' ' || !map[newPos.y][newPos.x]) {
        newPos = vec2d.add(newPos, position.dirVector);
        newPos.y = positiveModulo(newPos.y, map.length);
        newPos.x = positiveModulo(newPos.x, map[position.y].length);
    }
    if (map[newPos.y][newPos.x] === '#') {
        return { ...position };
    }
    return {
        ...position, // direction, dirVector
        ...newPos, // x, y
    };
};

const runInstruction = (instruction, position, map) => {
    if (typeof instruction === 'string') {
        return changeDirection(instruction, position);
    }
    let newPos = position;
    for (let s = 0; s < instruction; s++) {
        newPos = step(newPos, map);
    }

    return newPos;
};

const partOne = (input) => {
    let position = {
        x: input.map[0].findIndex((t) => t !== ' '),
        y: 0,
        direction: 0,
        dirVector: getDirVector(0),
    };
    input.instructions.forEach((instruction) => {
        position = runInstruction(instruction, position, input.map);
    });
    return 1000 * (position.y + 1) + 4 * (position.x + 1) + position.direction;
};

getFaceBoundaries = (x, y) => {
    return {
        xMin: x * CUBE_SIZE,
        xMax: (x + 1) * CUBE_SIZE - 1,
        yMin: y * CUBE_SIZE,
        yMax: (y + 1) * CUBE_SIZE - 1,
    };
};

const CUBE_SIZE = 50;
const TRANSITIONS = {
    ['10']: [
        null,
        null,
        (p) => ({
            x: getFaceBoundaries(0, 2).xMin,
            y: getFaceBoundaries(0, 2).yMax - p.y,
            direction: 0,
            dirVector: getDirVector(0),
        }),
        (p) => ({
            x: getFaceBoundaries(0, 3).xMin,
            y: getFaceBoundaries(0, 3).yMin + (p.x % CUBE_SIZE),
            direction: 0,
            dirVector: getDirVector(0),
        }),
    ],
    ['20']: [
        (p) => ({
            x: getFaceBoundaries(1, 2).xMax,
            y: getFaceBoundaries(1, 2).yMax - p.y,
            direction: 2,
            dirVector: getDirVector(2),
        }),
        (p) => ({
            x: getFaceBoundaries(1, 1).xMax,
            y: getFaceBoundaries(1, 1).yMin + (p.x % CUBE_SIZE),
            direction: 2,
            dirVector: getDirVector(2),
        }),
        null,
        (p) => ({
            x: p.x % CUBE_SIZE,
            y: getFaceBoundaries(0, 3).yMax,
        }),
    ],
    ['11']: [
        (p) => ({
            x: getFaceBoundaries(2, 0).xMin + (p.y % CUBE_SIZE),
            y: getFaceBoundaries(2, 0).yMax,
            direction: 3,
            dirVector: getDirVector(3),
        }),
        null,
        (p) => ({
            x: getFaceBoundaries(0, 2).xMin + (p.y % CUBE_SIZE),
            y: getFaceBoundaries(0, 2).yMin,
            direction: 1,
            dirVector: getDirVector(1),
        }),
        null,
    ],
    ['02']: [
        null,
        null,
        (p) => ({
            x: getFaceBoundaries(1, 0).xMin,
            y: getFaceBoundaries(1, 0).yMax - (p.y % CUBE_SIZE),
            direction: 0,
            dirVector: getDirVector(0),
        }),
        (p) => ({
            x: getFaceBoundaries(1, 1).xMin,
            y: getFaceBoundaries(1, 1).yMin + p.x,
            direction: 0,
            dirVector: getDirVector(0),
        }),
    ],
    ['12']: [
        (p) => ({
            x: getFaceBoundaries(2, 0).xMax,
            y: getFaceBoundaries(2, 0).yMax - (p.y % CUBE_SIZE),
            direction: 2,
            dirVector: getDirVector(2),
        }),
        (p) => ({
            x: getFaceBoundaries(0, 3).xMax,
            y: getFaceBoundaries(0, 3).yMin + (p.x % CUBE_SIZE),
            direction: 2,
            dirVector: getDirVector(2),
        }),
        null,
        null,
    ],
    ['03']: [
        (p) => ({
            x: getFaceBoundaries(1, 2).xMin + (p.y % CUBE_SIZE),
            y: getFaceBoundaries(1, 2).yMax,
            direction: 3,
            dirVector: getDirVector(3),
        }),
        (p) => ({
            x: getFaceBoundaries(2, 0).xMin + p.x,
            y: getFaceBoundaries(2, 0).yMin,
        }),
        (p) => ({
            x: getFaceBoundaries(1, 0).xMin + (p.y % CUBE_SIZE),
            y: getFaceBoundaries(1, 0).yMin,
            direction: 1,
            dirVector: getDirVector(1),
        }),
        null,
    ],
};

const getFaceId = (position) => {
    return (
        '' +
        Math.floor(position.x / CUBE_SIZE) +
        Math.floor(position.y / CUBE_SIZE)
    );
};

const stepOnCube = (position, map) => {
    let newPos = vec2d.add(position, position.dirVector);
    if (
        !map[newPos.y] ||
        !map[newPos.y][newPos.x] ||
        map[newPos.y][newPos.x] === ' '
    ) {
        const faceId = getFaceId(position);
        if (!TRANSITIONS[faceId] || !TRANSITIONS[faceId][position.direction]) {
            console.log("shouldn't happen");
        }
        newPos = TRANSITIONS[faceId][position.direction](position);
    }
    if (!map[newPos.y]) {
        console.log("shouldn't happen");
    }
    if (map[newPos.y][newPos.x] === '#') {
        return position;
    }
    map[newPos.y][newPos.x] = '>';
    return {
        ...position,
        ...newPos,
    };
};

const runInstructionOnCube = (instruction, position, map) => {
    if (typeof instruction === 'string') {
        return changeDirection(instruction, position);
    }
    let newPos = position;
    for (let s = 0; s < instruction; s++) {
        newPos = stepOnCube(newPos, map);
    }
    return newPos;
};

const partTwo = (input) => {
    let position = {
        x: input.map[0].findIndex((t) => t !== ' '),
        y: 0,
        direction: 0,
        dirVector: getDirVector(0),
    };
    input.instructions.forEach((instruction, i) => {
        position = runInstructionOnCube(instruction, position, input.map);
    });

    return 1000 * (position.y + 1) + 4 * (position.x + 1) + position.direction;
};

assert.equal(partOne(inputSmall), 6032);
console.log(partOne(input));
console.log(partTwo(input));
