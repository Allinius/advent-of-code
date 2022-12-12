const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    let start;
    let end;
    const map = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line, y) =>
            line
                .split('')
                .map((c, x) => {
                    if (c === 'S') {
                        start = { x, y };
                        return 'a';
                    } else if (c === 'E') {
                        end = { x, y };
                        return 'z';
                    }
                    return c;
                })
                .map((c) => c.charCodeAt(0))
        );
    return { start, end, map };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const getDestinations = (heightMap, cell) => {
    const width = heightMap[0].length;
    const height = heightMap.length;
    const allDestinations = [
        { x: cell.x + 1, y: cell.y },
        { x: cell.x - 1, y: cell.y },
        { x: cell.x, y: cell.y + 1 },
        { x: cell.x, y: cell.y - 1 },
    ];
    return allDestinations.filter((d) => {
        if (d.x < 0 || d.y < 0 || d.x >= width || d.y >= height) {
            return false;
        }
        if (heightMap[d.y][d.x] - heightMap[cell.y][cell.x] > 1) {
            return false;
        }
        return true;
    });
};

const findShortestPath = (heightMap, starts, end) => {
    const width = heightMap[0].length;
    const height = heightMap.length;
    const distanceMap = Array(height)
        .fill()
        .map(() => Array(width).fill(Number.MAX_SAFE_INTEGER));
    const queue = [];
    starts.forEach((start) => {
        distanceMap[start.y][start.x] = 0;
        queue.push(start);
    });

    while (queue.length > 0) {
        const cell = queue.shift();
        if (cell.x === end.x && cell.y === end.y) {
            break;
        }
        const destinations = getDestinations(heightMap, cell);
        destinations.forEach((d) => {
            if (distanceMap[d.y][d.x] > distanceMap[cell.y][cell.x] + 1) {
                distanceMap[d.y][d.x] = distanceMap[cell.y][cell.x] + 1;
                queue.push(d);
            }
        });
    }

    return distanceMap[end.y][end.x];
};

const partOne = (input) => {
    return findShortestPath(input.map, [input.start], input.end);
};

const partTwo = (input) => {
    const starts = [];
    input.map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === 'a'.charCodeAt(0)) {
                starts.push({ x, y });
            }
        });
    });
    return findShortestPath(input.map, starts, input.end);
};

assert.equal(partOne(inputSmall), 31);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 29);
console.log(partTwo(input));
