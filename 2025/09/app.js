const fs = require('fs');
const assert = require('assert');
const { distance } = require('../../common/vec3d');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const [x, y] = line.split(',').map(Number);
            return { x, y };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (positions) => {
    let largest;
    positions.forEach((start, index) => {
        if (index === positions.length - 1) {
            return;
        }
        positions.slice(index + 1).forEach((end) => {
            const rectArea = getArea(start, end);
            if (!largest || rectArea > largest.rectArea) {
                largest = { start, end, rectArea };
            }
        });
    });
    return largest.rectArea;
};

const partTwo = (positions) => {
    let largest;
    const lines = getLines(positions);
    positions.forEach((start, index) => {
        if (index === positions.length - 1) {
            return;
        }
        positions.slice(index + 1).forEach((end) => {
            const rectArea = getArea(start, end);
            if (
                (!largest || rectArea > largest.rectArea) &&
                noLineIntersects(start, end, lines)
            ) {
                largest = { start, end, rectArea };
            }
        });
    });
    return largest.rectArea;
};

const getArea = (start, end) => {
    return (1 + Math.abs(end.x - start.x)) * (1 + Math.abs(end.y - start.y));
};

const getLines = (positions) => {
    const lines = [];
    for (let i = 0; i < positions.length - 1; i++) {
        lines.push([positions[i], positions[i + 1]]);
    }
    lines.push([positions[positions.length - 1], positions[0]]);
    return lines;
};

const noLineIntersects = (rectStart, rectEnd, lines) => {
    for (let i = 0; i < lines.length; i++) {
        const pos = lines[i];
        if (lineIntersectsRect(rectStart, rectEnd, pos[0], pos[1])) {
            return false;
        }
    }
    return true;
};

const lineIntersectsRect = (rectStart, rectEnd, lineStart, lineEnd) => {
    const minX = Math.min(rectStart.x, rectEnd.x);
    const maxX = Math.max(rectStart.x, rectEnd.x);
    const minY = Math.min(rectStart.y, rectEnd.y);
    const maxY = Math.max(rectStart.y, rectEnd.y);

    // horizontal
    if (lineStart.y === lineEnd.y) {
        const y = lineStart.y;

        if (y <= minY || y >= maxY) {
            return false;
        }

        const lineMinX = Math.min(lineStart.x, lineEnd.x);
        const lineMaxX = Math.max(lineStart.x, lineEnd.x);

        return lineMaxX > minX && lineMinX < maxX;
    }

    // vertical
    if (lineStart.x === lineEnd.x) {
        const x = lineStart.x;

        if (x <= minX || x >= maxX) {
            return false;
        }

        const lineMinY = Math.min(lineStart.y, lineEnd.y);
        const lineMaxY = Math.max(lineStart.y, lineEnd.y);

        return lineMaxY > minY && lineMinY < maxY;
    }

    return false;
};

assert.equal(partOne(inputSmall), 50);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 24);
console.log(partTwo(input));
