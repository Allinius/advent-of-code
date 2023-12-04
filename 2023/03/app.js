const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (engine) => {
    sum = 0;
    const completeGears = [];
    engine.forEach((line, y) => {
        const width = line.length;
        for (let x = 0; x < width; x++) {
            if (engine[y][x] === '.') {
                continue;
            }
            if (!Number.isNaN(Number.parseInt(engine[y][x]))) {
                const result = checkNumber(engine, x, y);
                if (result.hasAdjSymbol) {
                    sum += result.number;
                }
                if (result.gear) {
                    if (engine[result.gear.y][result.gear.x] === '*') {
                        engine[result.gear.y][result.gear.x] = {
                            ratio: result.number,
                        };
                    } else if (
                        typeof engine[result.gear.y][result.gear.x] === 'object'
                    ) {
                        engine[result.gear.y][result.gear.x].ratio *=
                            result.number;
                        completeGears.push(
                            engine[result.gear.y][result.gear.x].ratio
                        );
                    }
                }
                x += result.digits - 1;
            }
        }
    });
    const gearSum = completeGears.reduce((sum, curr) => sum + curr, 0);
    return { sum, gearSum };
};

const checkNumber = (engine, xStart, y) => {
    let hasAdjSymbol = false;
    let numberString = '';
    let gear = null;
    for (let x = xStart; !Number.isNaN(Number.parseInt(engine[y][x])); x++) {
        numberString += engine[y][x];
        const adjSymbol = findAdjacentSymbol(engine, x, y);
        hasAdjSymbol = hasAdjSymbol || !!adjSymbol;
        if (typeof adjSymbol === 'object') {
            gear = adjSymbol;
        }
    }
    return {
        hasAdjSymbol,
        number: Number.parseInt(numberString),
        digits: numberString.length,
        gear,
    };
};

const findAdjacentSymbol = (engine, xStart, yStart) => {
    let hasAdjSymbol = false;
    gear = null;
    for (let y = yStart - 1; y <= yStart + 1; y++) {
        if (y < 0 || y >= engine.length) {
            continue;
        }
        for (let x = xStart - 1; x <= xStart + 1; x++) {
            if (x < 0 || x >= engine[y].length) {
                continue;
            }
            if (
                engine[y][x] !== '.' &&
                Number.isNaN(Number.parseInt(engine[y][x]))
            ) {
                if (engine[y][x] === '*' || typeof engine[y][x] === 'object') {
                    gear = { x, y };
                }
                hasAdjSymbol = true;
            }
        }
    }
    return gear || hasAdjSymbol;
};

const resultSmall = partOne(inputSmall);
const result = partOne(input);

assert.equal(resultSmall.sum, 4361);
console.log(result.sum);
assert.equal(resultSmall.gearSum, 467835);
console.log(result.gearSum);
