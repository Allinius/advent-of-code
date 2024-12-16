const fs = require('fs');
const assert = require('assert');
const vec2d = require('../../common/vec2d');
const { positiveModulo } = require('../../common/number-utils');
const { MinPriorityQueue } = require('@datastructures-js/priority-queue');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
};

const inputSmall = parseInput('input-small.txt');
const inputSmall2 = parseInput('input-small2.txt');
const input = parseInput('input.txt');

const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
];

const getLeftRight = (map, position, dirIndex) => {
    const leftDir = directions[positiveModulo(dirIndex - 1, 4)];
    const rightDir = directions[positiveModulo(dirIndex + 1, 4)];
    const leftPos = vec2d.add(position, leftDir);
    const rightPos = vec2d.add(position, rightDir);
    return [map[leftPos.y]?.[leftPos.x], map[rightPos.y]?.[rightPos.x]];
};

const partOne = (inputMap) => {
    let startPos, endPos;
    const map = inputMap.map((line, y) =>
        line.map((tile, x) => {
            if (tile === 'S') {
                startPos = { x, y };
            }
            if (tile === 'E') {
                endPos = { x, y };
            }
            return {
                tile,
                pathScores: [Infinity, Infinity, Infinity, Infinity], // for each entry direction
                paths: [[], [], [], []],
            };
        })
    );

    const opened = new MinPriorityQueue((state) => state.pathScore);
    opened.enqueue({
        position: startPos,
        dirIndex: 1,
        pathScore: 0,
        path: [],
    });
    // const opened = [
    //     {
    //         position: startPos,
    //         dirIndex: 1,
    //         pathScore: 0,
    //         path: [],
    //     },
    // ];
    const endNode = map[endPos.y][endPos.x];

    while (!opened.isEmpty()) {
        const currState = opened.dequeue();
        const mapNode = map[currState.position.y][currState.position.x];

        if (mapNode.pathScores[currState.dirIndex] < currState.pathScore) {
            continue;
        }
        if (Math.min(...endNode.pathScores) < currState.pathScore) {
            break;
        }

        if (mapNode.pathScores[currState.dirIndex] === currState.pathScore) {
            mapNode.paths[currState.dirIndex].push(currState.path);
        } else {
            mapNode.pathScores[currState.dirIndex] = currState.pathScore;
            mapNode.paths[currState.dirIndex] = [currState.path];
        }

        if (mapNode.tile === 'E') {
            continue;
        }

        let [left, right] = getLeftRight(
            map,
            currState.position,
            currState.dirIndex
        );
        let stepPos = currState.position;
        let stepCount = 0;

        // walk to next intersection
        while (
            left?.tile === '#' &&
            right?.tile === '#' &&
            map[stepPos.y][stepPos.x] !== 'E'
        ) {
            const newStepPos = vec2d.add(
                stepPos,
                directions[currState.dirIndex]
            );
            if (
                !map[newStepPos.y]?.map[newStepPos.x] ||
                map[newStepPos.y][newStepPos.x].tile === '#'
            ) {
                break;
            }
            stepPos = newStepPos;
            stepCount++;
            [left, right] = getLeftRight(map, stepPos, currState.dirIndex);
        }

        // const nextStates = [];

        const forwardPos = vec2d.add(stepPos, directions[currState.dirIndex]);
        if (
            map[forwardPos.y]?.[forwardPos.x] &&
            map[forwardPos.y][forwardPos.x].tile !== '#'
        ) {
            opened.enqueue({
                position: forwardPos,
                dirIndex: currState.dirIndex,
                pathScore: currState.pathScore + stepCount + 1,
                path: [...currState.path, stepCount + 1],
            });
        }
        const stepPosNode = map[stepPos.y][stepPos.x];
        const afterTurnPathScore = currState.pathScore + stepCount + 1000;
        if (left && left.tile !== '#') {
            const leftDirIndex = positiveModulo(currState.dirIndex - 1, 4);
            if (stepPosNode.pathScores[leftDirIndex] >= afterTurnPathScore) {
                opened.enqueue({
                    position: stepPos,
                    dirIndex: leftDirIndex,
                    pathScore: afterTurnPathScore,
                    path: [...currState.path, stepCount, 'left'],
                });
            }
        }
        if (right && right.tile !== '#') {
            const rightDirIndex = positiveModulo(currState.dirIndex + 1, 4);
            if (stepPosNode.pathScores[rightDirIndex] >= afterTurnPathScore) {
                opened.enqueue({
                    position: stepPos,
                    dirIndex: positiveModulo(currState.dirIndex + 1, 4),
                    pathScore: afterTurnPathScore,
                    path: [...currState.path, stepCount, 'right'],
                });
            }
        }
    }

    const minScore = Math.min(...map[endPos.y][endPos.x].pathScores);

    const minDirIndex = map[endPos.y][endPos.x].pathScores.indexOf(minScore);
    const minPaths = map[endPos.y][endPos.x].paths[minDirIndex];

    const pathPositions = new Set([`${startPos.x},${startPos.y}`]);
    minPaths.forEach((path) => {
        let currPos = startPos;
        let currDirIndex = 1;
        path.forEach((step) => {
            if (step === 'right') {
                currDirIndex = positiveModulo(currDirIndex + 1, 4);
                return;
            }
            if (step === 'left') {
                currDirIndex = positiveModulo(currDirIndex - 1, 4);
                return;
            }
            for (let i = 0; i < step; i++) {
                currPos = vec2d.add(currPos, directions[currDirIndex]);
                pathPositions.add(`${currPos.x},${currPos.y}`);
            }
        });
    });

    return { minScore, pathTilesCount: pathPositions.size };
};

const resultSmall = partOne(inputSmall);
const resultSmall2 = partOne(inputSmall2);
assert.equal(resultSmall.minScore, 7036);
assert.equal(resultSmall2.minScore, 11048);
assert.equal(resultSmall.pathTilesCount, 45);
assert.equal(resultSmall2.pathTilesCount, 64);

console.log(partOne(input));
