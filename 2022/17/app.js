const fs = require('fs');
const assert = require('assert');
const vec2d = require('../../common/vec2d');

const parseInput = (fileName) => {
    return fs.readFileSync(fileName, 'utf-8').replace(/\r/g, '').split('');
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const rocks = [
    [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
    ],
    [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
    ],
    [
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 0, y: 2 },
    ],
    [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
    ],
    [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
    ],
];
rockHeights = [1, 3, 3, 4, 2];

const getDirection = (instruction) => {
    switch (instruction) {
        case '<':
            return { x: -1, y: 0 };
        case '>':
            return { x: 1, y: 0 };
    }
};
const checkCollision = (map, rock, position, direction) => {
    for (let coord of rock) {
        const newPos = vec2d.add(vec2d.add(position, coord), direction);
        if (!map[newPos.y] || map[newPos.y][newPos.x] !== '.') {
            return true;
        }
    }
    return false;
};

const createLines = (width, height) => {
    return Array(height)
        .fill()
        .map(() => Array(width).fill('.'));
};

const findHighestRock = (map) => {
    return map.findIndex((row) => row.indexOf('#') !== -1);
};

const dropRock = (map, rock, rockHeight, instructions, nextInst) => {
    const yOffset = 3;
    const xOffset = 2;
    const width = 7;
    let rockPosition = { x: xOffset, y: 0 };
    map.unshift(...createLines(width, yOffset));
    map.unshift(...createLines(width, rockHeight));

    let i = nextInst;
    while (true) {
        const instruction = instructions[i++];
        i %= instructions.length;
        // try to execute instruction
        const iDirection = getDirection(instruction);
        if (!checkCollision(map, rock, rockPosition, iDirection)) {
            rockPosition = vec2d.add(rockPosition, iDirection);
        }
        // move rock down
        const downDirection = { x: 0, y: 1 };
        if (!checkCollision(map, rock, rockPosition, downDirection)) {
            rockPosition = vec2d.add(rockPosition, downDirection);
        } else {
            // rock stopped
            rock.forEach((coord) => {
                map[rockPosition.y + coord.y][rockPosition.x + coord.x] = '#';
            });
            map.splice(0, findHighestRock(map));
            break;
        }
    }
    return i;
};

captureSnapshot = (map, nextRockIndex, nextInst) => {
    const captureRows = 50;
    return (
        '' +
        nextInst +
        nextRockIndex +
        JSON.stringify(map.slice(0, captureRows))
    );
};

const simulateTetris = (
    instructions,
    targetCount = 2022,
    detectLoops = true
) => {
    const map = [];
    let nextInst = 0;
    let nextRockIndex = 0;
    let rocksStopped = 0;
    const snapshots = {};
    let skippedHeight = 0;
    while (rocksStopped < targetCount) {
        nextInst = dropRock(
            map,
            rocks[nextRockIndex],
            rockHeights[nextRockIndex],
            instructions,
            nextInst
        );
        rocksStopped++;

        nextRockIndex = (nextRockIndex + 1) % rocks.length;

        if (!detectLoops) {
            continue;
        }
        if (snapshots[nextInst] == null) {
            snapshots[nextInst] = [];
        }
        const currSnapshot = captureSnapshot(map, nextRockIndex, nextInst);
        snapshots[nextInst].push({
            rocksStopped,
            height: map.length,
            snapshot: currSnapshot,
        });
        if (snapshots[nextInst].length == 2) {
            const firstSnapshot = snapshots[nextInst][0];
            if (currSnapshot === firstSnapshot.snapshot) {
                const rocksDiff =
                    snapshots[nextInst][1].rocksStopped -
                    snapshots[nextInst][0].rocksStopped;
                const heightDiff =
                    snapshots[nextInst][1].height -
                    snapshots[nextInst][0].height;

                const loopsRequired = Math.floor(
                    (targetCount - rocksStopped) / rocksDiff
                );
                rocksStopped += loopsRequired * rocksDiff;
                skippedHeight += loopsRequired * heightDiff;
            }
        }
    }
    return map.length + skippedHeight;
};

assert.equal(simulateTetris(inputSmall), 3068);
console.log(simulateTetris(input));
assert.equal(simulateTetris(inputSmall, 1000000000000), 1514285714288);
console.log(simulateTetris(input, 1000000000000));
