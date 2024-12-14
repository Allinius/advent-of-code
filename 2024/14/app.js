const fs = require('fs');
const assert = require('assert');
const { positiveModulo } = require('../../common/number-utils');
const { drawImage } = require('../../common/image-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.match(/-*\d+/g).map(Number));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (robots, seconds, areaWidth, areaHeight) => {
    const quadrants = [0, 0, 0, 0];
    const rob = [];
    robots.forEach(([x, y, vx, vy]) => {
        const resX = positiveModulo(x + seconds * vx, areaWidth);
        const resY = positiveModulo(y + seconds * vy, areaHeight);
        rob.push([resX, resY]);
        const midWidth = Math.floor(areaWidth / 2);
        const midHeight = Math.floor(areaHeight / 2);

        if (resX < midWidth) {
            if (resY < midHeight) {
                quadrants[0]++;
            } else if (resY > midHeight) {
                quadrants[2]++;
            }
        } else if (resX > midWidth) {
            if (resY < midHeight) {
                quadrants[1]++;
            } else if (resY > midHeight) {
                quadrants[3]++;
            }
        }
    });
    return quadrants.reduce((res, count) => res * count, 1);
};

const partTwo = (robots, seconds, areaWidth, areaHeight) => {
    for (let second = 0; second < seconds; second++) {
        const canvas = Array(areaHeight)
            .fill()
            .map(() => Array(areaWidth).fill('.'));
        robots.forEach(([x, y, vx, vy], index) => {
            const resX = positiveModulo(x + vx, areaWidth);
            const resY = positiveModulo(y + vy, areaHeight);
            robots[index][0] = resX;
            robots[index][1] = resY;
            canvas[resY][resX] = '#';
        });

        let highestestColumn = 0;
        for (let x = 0; x < areaWidth; x++) {
            let highestColumn = 0;
            let currCol = 0;
            for (let y = 0; y < areaHeight; y++) {
                if (canvas[y][x] === '.') {
                    continue;
                }
                if (currCol === 0) {
                    currCol++;
                    continue;
                }
                if (canvas[y][x] === canvas[y - 1][x]) {
                    currCol++;
                } else {
                    highestColumn = Math.max(currCol, highestColumn);
                    currCol = 0;
                }
            }
            highestestColumn = Math.max(highestestColumn, highestColumn);
        }
        if (highestestColumn > 5) {
            drawImage(canvas, 2, undefined, `out/${second + 1}.png`);
        }
    }
};

assert.equal(partOne(inputSmall, 100, 11, 7), 12);
console.log(partOne(input, 100, 101, 103));

partTwo(input, 10000, 101, 103);
