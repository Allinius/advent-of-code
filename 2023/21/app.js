const fs = require('fs');
const assert = require('assert');
const AreaMap2D = require('../../common/area-map-2d');
const { positiveModulo } = require('../../common/number-utils');
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

const partOne = (inputMap, stepCount) => {
    const areaMap = new AreaMap2D(inputMap);
    const startingPos = inputMap.reduce(
        (startingPos, line, y) =>
            line.indexOf('S') > -1 ? { x: line.indexOf('S'), y } : startingPos,
        null
    );
    let currPositions = [[startingPos.x, startingPos.y]];
    let step = 0;
    while (step < stepCount) {
        const newPositions = new Set();
        currPositions.forEach(([x, y]) => {
            areaMap
                .getSurrounding(x, y)
                .filter((cell) => cell.value !== '#')
                .forEach((neighbor) => {
                    newPositions.add([neighbor.x, neighbor.y].toString());
                });
        });
        currPositions = Array.from(newPositions).map((s) =>
            s.split(',').map(Number)
        );
        step++;
    }
    return currPositions.length;
};

const partTwo = (inputMap, stepCount) => {
    const startingPos = inputMap.reduce(
        (startingPos, line, y) =>
            line.indexOf('S') > -1 ? { x: line.indexOf('S'), y } : startingPos,
        null
    );
    let currPositions = [[startingPos.x, startingPos.y, 0, 0]];
    let step = 0;
    let prevMapMax = { x: 0, y: 0 };
    let prevMapMin = { x: 0, y: 0 };
    while (true) {
        const newPositions = new Set();
        const mapMin = { ...prevMapMin };
        const mapMax = { ...prevMapMax };
        currPositions.forEach(([x, y, mapX, mapY]) => {
            getSurroundingInfinite(inputMap, x, y, mapX, mapY).forEach(
                (neighbor) => {
                    mapMin.x = Math.min(neighbor.mapX, mapMin.x);
                    mapMin.y = Math.min(neighbor.mapY, mapMin.y);
                    mapMax.x = Math.max(neighbor.mapX, mapMax.x);
                    mapMax.y = Math.max(neighbor.mapY, mapMax.y);
                    newPositions.add(
                        [
                            neighbor.x,
                            neighbor.y,
                            neighbor.mapX,
                            neighbor.mapY,
                        ].toString()
                    );
                }
            );
        });

        // if (
        //     mapMin.x !== prevMapMin.x ||
        //     mapMin.y !== prevMapMin.y ||
        //     mapMax.x !== prevMapMax.x ||
        //     mapMax.y !== prevMapMax.y
        // ) {
        //     console.log(step, currPositions.length);
        //     drawMap(inputMap, currPositions, mapMin, mapMax, step);
        //     prevMapMax = mapMax;
        //     prevMapMin = mapMin;
        // }

        currPositions = Array.from(newPositions).map((s) =>
            s.split(',').map(Number)
        );
        step++;

        if (step === 327) {
            return countTiles(currPositions);
        }
    }
    return;
};

const getSurroundingInfinite = (map, x, y, mapX, mapY) => {
    const adjVectors = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
    ];

    const height = map.length;
    const width = map[0].length;

    const results = [];
    adjVectors.forEach((vec) => {
        const newPos = {
            x: x + vec[0],
            y: y + vec[1],
            mapX,
            mapY,
        };
        if (newPos.x < 0 || newPos.x >= width) {
            newPos.x = positiveModulo(newPos.x, width);
            newPos.mapX = newPos.x === 0 ? mapX + 1 : mapX - 1;
        }
        if (newPos.y < 0 || newPos.y >= height) {
            newPos.y = positiveModulo(newPos.y, height);
            newPos.mapY = newPos.y === 0 ? mapY + 1 : mapY - 1;
        }

        if (map[newPos.y] && map[newPos.y][newPos.x] !== '#') {
            results.push(newPos);
        }
    });
    return results;
};

const countTiles = (positions) => {
    const centerStableCount = positions.filter(
        ([, , mapX, mapY]) => mapX === 0 && mapY === 0
    ).length;

    const offCenterStableCount = positions.filter(
        ([, , mapX, mapY]) => mapX === 1 && mapY === 0
    ).length;
    const cornerCounts = [
        positions.filter(([, , mapX, mapY]) => mapX === 2 && mapY === 0).length,
        positions.filter(([, , mapX, mapY]) => mapX === 0 && mapY === 2).length,
        positions.filter(([, , mapX, mapY]) => mapX === -2 && mapY === 0)
            .length,
        positions.filter(([, , mapX, mapY]) => mapX === 0 && mapY === -2)
            .length,
    ];
    const edgeInners = [
        positions.filter(([, , mapX, mapY]) => mapX === 1 && mapY === 1).length,
        positions.filter(([, , mapX, mapY]) => mapX === -1 && mapY === 1)
            .length,
        positions.filter(([, , mapX, mapY]) => mapX === -1 && mapY === -1)
            .length,
        positions.filter(([, , mapX, mapY]) => mapX === 1 && mapY === -1)
            .length,
    ];
    const edgeOuters = [
        positions.filter(([, , mapX, mapY]) => mapX === 1 && mapY === 2).length,
        positions.filter(([, , mapX, mapY]) => mapX === -1 && mapY === 2)
            .length,
        positions.filter(([, , mapX, mapY]) => mapX === -1 && mapY === -2)
            .length,
        positions.filter(([, , mapX, mapY]) => mapX === 1 && mapY === -2)
            .length,
    ];
    const n = (26501365 - 65) / 131;
    return (
        centerStableCount * Math.pow(n - 1, 2) +
        offCenterStableCount * Math.pow(n, 2) +
        cornerCounts.reduce((sum, c) => sum + c) +
        edgeOuters.reduce((sum, c) => sum + n * c, 0) +
        edgeInners.reduce((sum, c) => sum + (n - 1) * c, 0)
    );
};

const drawMap = (map, currPositions, mapMin, mapMax, fileName) => {
    const verticalMapCount = mapMax.y - mapMin.y + 1;
    const horizontalMapCount = mapMax.x - mapMin.x + 1;
    let canvas = Array(verticalMapCount * map.length)
        .fill()
        .map(() => Array(horizontalMapCount * map[0].length).fill('.'));
    for (let mapY = 0; mapY < verticalMapCount; mapY++) {
        for (let mapX = 0; mapX < horizontalMapCount; mapX++) {
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[0].length; x++) {
                    if (map[y][x] === '#') {
                        canvas[mapY * map.length + y][
                            mapX * map[0].length + x
                        ] = '#';
                    }
                }
            }
        }
    }
    currPositions.forEach(([x, y, mapX, mapY]) => {
        canvas[(mapY - mapMin.y) * map.length + y][
            (mapX - mapMin.x) * map[0].length + x
        ] = 'O';
    });
    drawImage(
        canvas,
        2,
        {
            '.': 'rgba(40,40,40,1)',
            '#': 'rgba(255, 135, 0, 0.8)',
            O: 'rgba(130, 0, 255, 0.8)',
        },
        `${fileName}.png`
    );
    return;
};

assert.equal(partOne(inputSmall, 6), 16);
console.log(partOne(input, 64));
console.log(partTwo(input));
