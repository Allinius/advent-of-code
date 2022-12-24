const fs = require('fs');
const assert = require('assert');
const { positiveModulo } = require('../../common/number-utils');
const vec2d = require('../../common/vec2d');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) =>
            line.split('').map((c) => {
                if (c === '.') {
                    return [];
                }
                return [c];
            })
        );
};

const moveBlizzards = (map) => {
    const blizzVectors = {
        '^': { x: 0, y: -1 },
        '>': { x: 1, y: 0 },
        v: { x: 0, y: 1 },
        '<': { x: -1, y: 0 },
    };
    const newMap = Array(map.length)
        .fill()
        .map(() =>
            Array(map[0].length)
                .fill()
                .map(() => [])
        );
    map.forEach((row, y) =>
        row.forEach((cell, x) => {
            if (cell.length === 1 && cell[0] === '#') {
                newMap[y][x].push('#');
                return;
            }
            cell.forEach((blizzard) => {
                const blizzVec = blizzVectors[blizzard];
                newPos = {
                    x: positiveModulo(x + blizzVec.x - 1, row.length - 2) + 1,
                    y: positiveModulo(y + blizzVec.y - 1, map.length - 2) + 1,
                };
                newMap[newPos.y][newPos.x].push(blizzard);
            });
        })
    );
    return newMap;
};

const allMoves = (position) => {
    return [
        { ...position },
        vec2d.add(position, { x: 0, y: -1 }),
        vec2d.add(position, { x: 1, y: 0 }),
        vec2d.add(position, { x: 0, y: 1 }),
        vec2d.add(position, { x: -1, y: 0 }),
    ];
};

const shortestPath = (map, start, end) => {
    const width = map[0].length;
    const height = map.length;
    let possiblePositions = [start];
    let turn = 0;
    let newMap = map;
    let pathFound = false;
    while (!pathFound) {
        turn++;
        newMap = moveBlizzards(newMap);
        const newPositions = new Set();
        possiblePositions.forEach((position) => {
            if (position.x === end.x && position.y === end.y) {
                pathFound = true;
            }
            const validMoves = allMoves(position).filter(
                (newPos) =>
                    newPos.x >= 0 &&
                    newPos.y >= 0 &&
                    newPos.x < width &&
                    newPos.y < height &&
                    newMap[newPos.y][newPos.x].length === 0
            );
            if (validMoves.find((m) => m.x === end.x && m.y === end.y)) {
                pathFound = true;
            }
            validMoves
                .map((p) => JSON.stringify(p))
                .forEach((ps) => newPositions.add(ps));
        });
        possiblePositions = Array.from(newPositions).map((ps) =>
            JSON.parse(ps)
        );
    }
    return { length: turn, map: newMap };
};

const partOne = (map) => {
    const start = {
        x: 1,
        y: 0,
    };
    const end = {
        x: map[0].length - 2,
        y: map.length - 1,
    };
    return shortestPath(map, start, end).length;
};

const partTwo = (map) => {
    const start = {
        x: 1,
        y: 0,
    };
    const end = {
        x: map[0].length - 2,
        y: map.length - 1,
    };
    const result1 = shortestPath(map, start, end);
    const result2 = shortestPath(result1.map, end, start);
    const result3 = shortestPath(result2.map, start, end);
    return result1.length + result2.length + result3.length;
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

assert.equal(partOne(inputSmall), 18);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 54);
console.log(partTwo(input));
