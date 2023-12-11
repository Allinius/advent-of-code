const fs = require('fs');
const assert = require('assert');
const AreaMap2D = require('../../common/area-map-2d');
const { drawImage } = require('../../common/image-utils');

const parseInput = (fileName) => {
    return new AreaMap2D(
        fs
            .readFileSync(fileName, 'utf-8')
            .replace(/\r/g, '')
            .split('\n')
            .map((line) => line.split(''))
    );
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (map) => {
    const startPos = getStartingPos(map.map);

    const startConnected = map
        .getSurrounding(startPos.x, startPos.y)
        .filter((pos) =>
            getConnected(pos.x, pos.y, map).find(
                (c) => c.x === startPos.x && c.y === startPos.y
            )
        );
    if (startConnected.length !== 2) {
        return 'error in starting connections';
    }
    const startCell = getCellFromConnected(startPos, startConnected);
    map.map[startPos.y][startPos.x] = startCell;
    const distanceMap = [...Array(map.map.length)].map((e) =>
        Array(map.map[0].length)
    );

    distanceMap[startPos.y][startPos.x] = 0;
    let open = [...startConnected];
    let distance = 1;
    let maxDist = 0;
    while (open.length > 0) {
        const newOpen = [];
        open.forEach((pos) => {
            if (distanceMap[pos.y][pos.x] == null) {
                distanceMap[pos.y][pos.x] = distance;
                maxDist = Math.max(maxDist, distance);
                newOpen.push(...getConnected(pos.x, pos.y, map));
            }
        });
        open = newOpen;
        distance++;
    }
    return { maxDist, distanceMap };
};

const getCellFromConnected = (startPos, connected) => {
    const dirMap = new Map();
    connected.forEach((con) => {
        dirMap.set([con.x - startPos.x, con.y - startPos.y].toString(), true);
    });
    if (dirMap.has('0,-1') && dirMap.has('0,1')) {
        return '|';
    }
    if (dirMap.has('-1,0') && dirMap.has('1,0')) {
        return '-';
    }
    if (dirMap.has('0,-1') && dirMap.has('1,0')) {
        return 'L';
    }
    if (dirMap.has('0,-1') && dirMap.has('-1,0')) {
        return 'J';
    }
    if (dirMap.has('0,1') && dirMap.has('-1,0')) {
        return '7';
    }
    if (dirMap.has('0,1') && dirMap.has('1,0')) {
        return 'F';
    }
    return;
};

const getStartingPos = (map) => {
    let startPos;
    map.find((line, y) =>
        line.find((tile, x) => {
            if (tile === 'S') {
                startPos = { x, y };
                return true;
            }
        })
    );
    return startPos;
};

const getNeighbor = (map, x, y, neighborIndex) => {
    let vector;
    switch (neighborIndex) {
        case 0:
    }
};

const getConnected = (x, y, map) => {
    const cell = map.getCell(x, y);
    let connections = [false, false, false, false];
    switch (cell) {
        case '|':
            connections = [true, false, true, false];
            break;
        case '-':
            connections = [false, true, false, true];
            break;
        case 'L':
            connections = [true, true, false, false];
            break;
        case 'J':
            connections = [true, false, false, true];
            break;
        case '7':
            connections = [false, false, true, true];
            break;
        case 'F':
            connections = [false, true, true, false];
            break;
    }

    const coords = [
        { x, y: y - 1 },
        { x: x + 1, y },
        { x, y: y + 1 },
        { x: x - 1, y },
    ];
    return coords.filter(
        (coord, i) => connections[i] && map.getCell(coord.x, coord.y)
    );
};

const partTwo = (map, distanceMap) => {
    const bigMap = new AreaMap2D([]);
    for (let y = 0; y < distanceMap.length; y++) {
        bigMap.map.push([], [], []);
        for (let x = 0; x < distanceMap[y].length; x++) {
            let cell = distanceMap[y][x] == null ? '.' : map.getCell(x, y);
            const bigCell = getBigCell(cell);
            if (!bigCell) {
                return;
            }
            bigCell.forEach((line, i) => {
                bigMap.map[3 * y + i].push(...line);
            });
        }
    }
    let areaIndex = 0;
    bigMap.map.forEach((line, y) => {
        line.forEach((cell, x) => {
            if (cell === '.') {
                floodFillFrom(bigMap, x, y, areaIndex++);
            }
        });
    });

    let insideCount = 0;
    for (let y = 0; y < bigMap.map.length; y += 3) {
        for (let x = 0; x < bigMap.map[y].length; x += 3) {
            if (isCellInside(bigMap.map, x, y)) {
                insideCount++;
            }
        }
    }
    return insideCount;
};

const getBigCell = (cell) => {
    switch (cell) {
        case '|':
            return [
                ['-', '#', '-'],
                ['-', '#', '-'],
                ['-', '#', '-'],
            ];
        case '-':
            return [
                ['-', '-', '-'],
                ['#', '#', '#'],
                ['-', '-', '-'],
            ];
        case 'L':
            return [
                ['-', '#', '-'],
                ['-', '#', '#'],
                ['-', '-', '-'],
            ];
        case 'J':
            return [
                ['-', '#', '-'],
                ['#', '#', '-'],
                ['-', '-', '-'],
            ];
        case '7':
            return [
                ['-', '-', '-'],
                ['#', '#', '-'],
                ['-', '#', '-'],
            ];
        case 'F':
            return [
                ['-', '-', '-'],
                ['-', '#', '#'],
                ['-', '#', '-'],
            ];
        case '.':
            return [
                ['.', '.', '.'],
                ['.', '.', '.'],
                ['.', '.', '.'],
            ];
    }
};

let outCount = 0;
const floodFillFrom = (areaMap, x, y, fillSymbnol, shouldDraw) => {
    let open = [JSON.stringify({ x, y })];
    while (open.length > 0) {
        const newOpen = new Set();
        open.forEach((posString) => {
            const pos = JSON.parse(posString);
            areaMap.map[pos.y][pos.x] += fillSymbnol;
            areaMap
                .getSurrounding(pos.x, pos.y)
                .filter((cell) => cell.value === '.' || cell.value === '-')
                .map((cell) => JSON.stringify(cell))
                .forEach((cell) => newOpen.add(cell));
        });
        open = Array.from(newOpen);
        if (shouldDraw) {
            drawImage(
                areaMap.map,
                2,
                {
                    '.0': 'rgba(179, 81, 255, 1)',
                    '-0': 'rgba(120, 0, 214, 1)',
                    '.1': 'rgba(225, 255, 126, 1)',
                    '-1': 'rgba(119, 154, 0, 1)',
                    '#': 'rgba(0, 0, 0, 1)',
                    '-': 'rgba(64, 64, 64, 1)',
                    '.': 'rgba(128, 128, 128, 1)',
                },
                `out/${('' + outCount++).padStart(5, '0')}.png`
            );
        }
    }
};

const isCellInside = (bigMap, x, y) => {
    const insideLines = bigMap
        .slice(y, y + 3)
        .filter((line) => line.slice(x, x + 3).toString() === '.1,.1,.1');

    return insideLines && insideLines.length === 3;
};

const resultOneSmall = partOne(inputSmall);
assert.equal(resultOneSmall.maxDist, 70);
const resultOne = partOne(input);
console.log(resultOne.maxDist);

assert.equal(partTwo(inputSmall, resultOneSmall.distanceMap), 8);
console.log(partTwo(input, resultOne.distanceMap));
