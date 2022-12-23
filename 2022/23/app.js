const fs = require('fs');
const assert = require('assert');
const vec2d = require('../../common/vec2d');

const parseInput = (fileName) => {
    const map = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
    const elves = [];
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === '#') {
                elves.push({ x, y });
            }
        });
    });
    return elves;
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const simulateRound = (elves, round) => {
    const directions = [
        { x: -1, y: -1 }, // NW 0
        { x: 0, y: -1 }, // N
        { x: 1, y: -1 }, // NE 2
        { x: 1, y: 0 }, // E
        { x: 1, y: 1 }, // SE 4
        { x: 0, y: 1 }, // S
        { x: -1, y: 1 }, // SW 6
        { x: -1, y: 0 }, // W
    ];
    const checkOrder = [0, 4, 6, 2];
    const checkStart = round % 4;

    const elfMap = {};
    elves.forEach((elf) => (elfMap[`${elf.x},${elf.y}`] = elf));
    const propositionMap = {};
    elves.forEach((elf) => {
        const nearbyElf = directions.find(
            (d) => elfMap[`${elf.x + d.x},${elf.y + d.y}`]
        );
        if (!nearbyElf) {
            return;
        }
        for (let i = 0; i < 4; i++) {
            const currDirIndex = checkOrder[(checkStart + i) % 4];
            let directionBlocked = false;
            for (let j = 0; j < 3; j++) {
                const d = directions[(currDirIndex + j) % 8];
                if (elfMap[`${elf.x + d.x},${elf.y + d.y}`]) {
                    directionBlocked = true;
                    break;
                }
            }
            if (directionBlocked) {
                continue;
            }
            const moveDir = directions[currDirIndex + 1];
            const moveLocKey = `${elf.x + moveDir.x},${elf.y + moveDir.y}`;
            if (propositionMap[moveLocKey]) {
                propositionMap[moveLocKey] = 'X';
                break;
            }
            propositionMap[moveLocKey] = elf;
            break;
        }
    });

    let elfMoved = false;
    Object.keys(propositionMap).forEach((key) => {
        const elf = propositionMap[key];
        if (elf === 'X') {
            return;
        }
        elfMoved = true;
        const coords = key.split(',').map((s) => parseInt(s));
        elf.x = coords[0];
        elf.y = coords[1];
    });
    return elfMoved;
};

const drawMap = (elves) => {
    const map = Array(12)
        .fill()
        .map(() => Array(14).fill('.'));
    elves.forEach((elf) => {
        map[elf.y][elf.x] = '#';
    });
    console.log(map.map((row) => row.join('')).join('\n') + '\n');
};

const partOne = (inputElves, roundLimit) => {
    let elves = JSON.parse(JSON.stringify(inputElves));
    let round = 0;
    while (true) {
        if (!simulateRound(elves, round++) || round === roundLimit) {
            break;
        }
    }
    let xMin = Number.MAX_SAFE_INTEGER;
    let yMin = Number.MAX_SAFE_INTEGER;
    let xMax = 0;
    let yMax = 0;
    elves.forEach((elf) => {
        xMin = Math.min(xMin, elf.x);
        yMin = Math.min(yMin, elf.y);
        xMax = Math.max(xMax, elf.x);
        yMax = Math.max(yMax, elf.y);
    });
    const rectangleSize = (xMax - xMin + 1) * (yMax - yMin + 1);
    return { freeTiles: rectangleSize - elves.length, round };
};

assert.equal(partOne(inputSmall, 10).freeTiles, 110);
console.log(partOne(input, 10).freeTiles);
assert.equal(partOne(inputSmall).round, 20);
console.log(partOne(input).round);
