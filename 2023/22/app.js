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
        .map((line) =>
            line.split('~').map((parts) => parts.split(',').map(Number))
        );
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const solve = (input) => {
    const bricks = input.map(([start, end], index) => {
        const diffIndex = [
            end[0] - start[0],
            end[1] - start[1],
            end[2] - start[2],
        ].findIndex((diff) => diff !== 0);
        const cubes = [];
        if (diffIndex === -1) {
            cubes.push([...start]);
        }
        for (let i = start[diffIndex]; i <= end[diffIndex]; i++) {
            const cube = [...start];
            cube[diffIndex] = i;
            cubes.push(cube);
        }

        return {
            index,
            start,
            end,
            diffIndex,
            cubes,
        };
    });
    bricks.sort(
        (a, b) =>
            Math.max(a.start[2], a.end[2]) - Math.max(b.start[2], b.end[2])
    );

    settleBricks(bricks);

    const safeToRemove = bricks.reduce(
        (count, brick) =>
            !brick.supporting ||
            Array.from(brick.supporting).every(
                (secondBrick) => secondBrick.supportedBy.length > 1
            )
                ? count + 1
                : count,
        0
    );

    const fallCount = bricks.reduce((sum, brick) => {
        if (!brick.supporting) {
            return sum;
        }
        let removedBricks = new Set([brick]);
        let queue = [...brick.supporting];
        let fallCount = 0;
        while (queue.length > 0) {
            const newQueue = new Set();
            queue.forEach((currBrick) => {
                if (currBrick.supportedBy.some((b) => !removedBricks.has(b))) {
                    return;
                }
                if (!removedBricks.has(currBrick)) {
                    fallCount++;
                    removedBricks.add(currBrick);
                }
                if (currBrick.supporting) {
                    currBrick.supporting.forEach((supportedBrick) => {
                        if (!removedBricks.has(supportedBrick)) {
                            newQueue.add(supportedBrick);
                        }
                    });
                }
            });
            queue = [...newQueue];
        }
        return sum + fallCount;
    }, 0);

    return { safeToRemove, fallCount };
};

const settleBricks = (bricks) => {
    bricks.sort(
        (a, b) =>
            Math.min(a.start[2], a.end[2]) - Math.min(b.start[2], b.end[2])
    );

    let fallCount = 0;
    const heightMap = Array(10)
        .fill()
        .map(() => Array(10).fill(0));
    bricks.forEach((brick, index) => {
        const newZ =
            brick.cubes.reduce(
                (max, [x, y, _]) =>
                    heightMap[y][x] > max ? heightMap[y][x] : max,
                0
            ) + 1;
        if (newZ !== brick.start[2]) {
            fallCount++;
        }
        const sinkDistance = brick.start[2] - newZ;
        brick.start[2] -= sinkDistance;
        brick.end[2] -= sinkDistance;
        brick.cubes.forEach((cube) => {
            cube[2] -= sinkDistance;
            heightMap[cube[1]][cube[0]] = cube[2];
        });
    });
    bricks.forEach((brick) => {
        let collidingBricks = [];

        bricks.forEach((secondBrick) => {
            if (brick === secondBrick) {
                return;
            }
            if (
                secondBrick.cubes.some(([botX, botY, botZ]) =>
                    brick.cubes.some(
                        ([topX, topY, topZ]) =>
                            topX === botX && topY === botY && topZ === botZ + 1
                    )
                )
            ) {
                collidingBricks.push(secondBrick);
            }
        });

        if (brick.start[2] > 1 && collidingBricks.length > 0) {
            brick.supportedBy = collidingBricks;
            collidingBricks.forEach((secondBrick) => {
                if (!secondBrick.supporting) {
                    secondBrick.supporting = new Set([brick]);
                } else {
                    secondBrick.supporting.add(brick);
                }
            });
        } else if (brick.start[2] > 1) {
            console.log('error');
        }
    });
    return fallCount;
};

const resultSmall = solve(inputSmall);
assert.equal(resultSmall.safeToRemove, 5);
assert.equal(resultSmall.fallCount, 7);

console.log(solve(input));
