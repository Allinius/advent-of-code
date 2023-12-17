const fs = require('fs');
const assert = require('assert');
const vec2d = require('../../common/vec2d');
const { positiveModulo } = require('../../common/number-utils');
const { drawImage } = require('../../common/image-utils');
const Heap = require('heap');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split('').map((char) => parseInt(char)));
};

const inputSmall = parseInput('input-small.txt');
const inputSmall2 = parseInput('input-small2.txt');
const input = parseInput('input.txt');

const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 }, // right
    { x: 0, y: 1 }, // down
    { x: -1, y: 0 }, // left
];

const partOne = (heatMap) => {
    const heap = new Heap((a, b) => a.totalHeat - b.totalHeat);
    heap.push({
        x: 0,
        y: 0,
        totalHeat: heatMap[0][0],
        prev: null,
        prevDir: null,
        prevDirCount: 0,
    });
    const visited = new Set();

    let end;
    while (heap.size() > 0) {
        const current = heap.pop();
        if (
            current.x === heatMap[0].length - 1 &&
            current.y === heatMap.length - 1
        ) {
            end = current;
            break;
        }

        directions.forEach((dir, dirIndex) => {
            if (current.prevDir === dirIndex && current.prevDirCount === 3) {
                return;
            }
            // can't reverse
            if (
                current.prevDir != null &&
                dirIndex === positiveModulo(current.prevDir - 2, 4)
            ) {
                return;
            }

            const neighCoords = vec2d.add({ x: current.x, y: current.y }, dir);
            if (
                neighCoords.x < 0 ||
                neighCoords.y < 0 ||
                neighCoords.x >= heatMap[0].length ||
                neighCoords.y >= heatMap.length
            ) {
                return;
            }

            const newVertex = {
                x: neighCoords.x,
                y: neighCoords.y,
                heat: heatMap[neighCoords.y][neighCoords.x],
                totalHeat:
                    current.totalHeat + heatMap[neighCoords.y][neighCoords.x],
                prev: current,
                prevDir: dirIndex,
                prevDirCount:
                    current.prevDir === dirIndex ? current.prevDirCount + 1 : 1,
            };

            const vertKey = [
                newVertex.x,
                newVertex.y,
                newVertex.prevDir,
                newVertex.prevDirCount,
            ].toString();
            if (!visited.has(vertKey)) {
                visited.add(vertKey);
                heap.push(newVertex);
            }
        });
    }
    drawPath(end, heatMap);
    return end.totalHeat - heatMap[0][0];
};

const partTwo = (heatMap) => {
    const heap = new Heap((a, b) => a.totalHeat - b.totalHeat);
    heap.push({
        x: 0,
        y: 0,
        totalHeat: heatMap[0][0],
        prev: null,
        prevDir: null,
        prevDirCount: 0,
    });
    const visited = new Set();

    let end;
    while (heap.size() > 0) {
        const current = heap.pop();
        if (
            current.x === heatMap[0].length - 1 &&
            current.y === heatMap.length - 1 &&
            current.prevDirCount >= 4
        ) {
            end = current;
            break;
        }

        directions.forEach((dir, dirIndex) => {
            if (
                current.prevDir != null &&
                current.prevDirCount < 4 &&
                dirIndex !== current.prevDir
            ) {
                return;
            }
            if (current.prevDir === dirIndex && current.prevDirCount === 10) {
                return;
            }
            // can't reverse
            if (
                current.prevDir != null &&
                dirIndex === positiveModulo(current.prevDir - 2, 4)
            ) {
                return;
            }

            const neighCoords = vec2d.add({ x: current.x, y: current.y }, dir);
            if (
                neighCoords.x < 0 ||
                neighCoords.y < 0 ||
                neighCoords.x >= heatMap[0].length ||
                neighCoords.y >= heatMap.length
            ) {
                return;
            }

            const newVertex = {
                x: neighCoords.x,
                y: neighCoords.y,
                heat: heatMap[neighCoords.y][neighCoords.x],
                totalHeat:
                    current.totalHeat + heatMap[neighCoords.y][neighCoords.x],
                prev: current,
                prevDir: dirIndex,
                prevDirCount:
                    current.prevDir === dirIndex ? current.prevDirCount + 1 : 1,
            };

            const vertKey = [
                newVertex.x,
                newVertex.y,
                newVertex.prevDir,
                newVertex.prevDirCount,
            ].toString();
            if (!visited.has(vertKey)) {
                visited.add(vertKey);
                heap.push(newVertex);
            }
        });
    }
    drawPath(end, heatMap);
    return end.totalHeat - heatMap[0][0];
};

let imageCount = 0;
const drawPath = (end, heatMap) => {
    let drawMap = heatMap.map((line) => line.map((cell) => cell));
    let curr = end;
    drawMap[curr.y][curr.x] = '#';
    while (curr.prev) {
        curr = curr.prev;
        drawMap[curr.y][curr.x] = '#';
    }
    drawImage(
        drawMap,
        32,
        {
            10: 'rgba(255,165,0,1)',
            9: 'rgba(255,165,0,0.9)',
            8: 'rgba(255,165,0,0.8)',
            7: 'rgba(255,165,0,0.7)',
            6: 'rgba(255,165,0,0.6)',
            5: 'rgba(255,165,0,0.5)',
            4: 'rgba(255,165,0,0.4)',
            3: 'rgba(255,165,0,0.3)',
            2: 'rgba(255,165,0,0.2)',
            1: 'rgba(255,165,0,0.1)',
            10: 'rgba(255,165,0,0)',
            '#': 'rgba(255,255,255,1)',
        },
        `out/${imageCount++}.png`
    );
};

assert.equal(partOne(inputSmall), 102);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 94);
assert.equal(partTwo(inputSmall2), 71);
console.log(partTwo(input));
