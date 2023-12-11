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

const bothParts = (starMap, emptyDistance = 2) => {
    const stars = getStars(starMap, emptyDistance);
    return stars.reduce(
        (acc, star1, index) =>
            acc +
            stars
                .slice(index + 1)
                .reduce((acc2, star2) => acc2 + manhattanDist(star1, star2), 0),
        0
    );
};

const getStars = (starMap, emptyDistance) => {
    const emptyRows = [];
    const emptyColumns = [];
    let emptyCount = 0;
    starMap.forEach((row) => {
        if (!row.find((cell) => cell !== '.')) {
            emptyCount++;
        }
        emptyRows.push(emptyCount);
    });
    emptyCount = 0;
    starMap[0].forEach((_, x) => {
        if (!starMap.find((row) => row[x] !== '.')) {
            emptyCount++;
        }
        emptyColumns.push(emptyCount);
    });

    const stars = [];
    starMap.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === '#') {
                stars.push({
                    x: x + emptyColumns[x] * (emptyDistance - 1),
                    y: y + emptyRows[y] * (emptyDistance - 1),
                });
            }
        });
    });
    return stars;
};

const manhattanDist = (star1, star2) => {
    return Math.abs(star1.x - star2.x) + Math.abs(star1.y - star2.y);
};

assert.equal(bothParts(inputSmall), 374);
console.log(bothParts(input));
assert.equal(bothParts(inputSmall, 100), 8410);
console.log(bothParts(input, 1000000));
