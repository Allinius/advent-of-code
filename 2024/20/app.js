const fs = require('fs');
const assert = require('assert');
const { getSurrounding } = require('../../common/array-2d-util');
const { manhattanDistance } = require('../../common/vec2d');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const searchMap = (map, startPos, endPos, stepsLabel) => {
    const opened = [{ x: startPos.x, y: startPos.y, steps: 0 }];
    stepsMap = new Map();
    while (opened.length > 0) {
        const currState = opened.pop();
        const currNode = map[currState.y][currState.x];
        if (stepsLabel) {
            if (
                currNode[stepsLabel] == null ||
                currNode[stepsLabel] > currState.steps
            ) {
                currNode[stepsLabel] = currState.steps;
            }
        } else {
            const coordLabel = `${currNode.x},${currNode.y}`;
            if (
                !stepsMap.has(coordLabel) ||
                stepsMap.get(coordLabel) > currState.steps
            ) {
                stepsMap.set(coordLabel, currState.steps);
            }
        }

        if (endPos && currState.x === endPos.x && currState.y === endPos.y) {
            continue;
        }
        const surr = getSurrounding(map, currState.x, currState.y).filter(
            (n) => n.value.tile !== '#'
        );
        surr.forEach((neighbor) => {
            const neighborSteps =
                stepsLabel != null
                    ? neighbor.value[stepsLabel] ?? Infinity
                    : stepsMap.get(`${neighbor.x},${neighbor.y}`) ?? Infinity;
            if (neighborSteps > currState.steps + 1) {
                opened.push({
                    x: neighbor.x,
                    y: neighbor.y,
                    steps: currState.steps + 1,
                });
            }
        });
    }
    if (!endPos) {
        return;
    }
    return stepsLabel != null
        ? map[endPos.y][endPos.x][stepsLabel]
        : stepsMap.get(`${endPos.x},${endPos.y}`);
};

const getTilesAtDistance = (map, x, y, distance) => {
    const directionSet = new Set();
    for (let x = 0; x <= distance; x++) {
        directionSet.add(`${x},${distance - x}`);
        directionSet.add(`${x},${x - distance}`);
        directionSet.add(`${-x},${distance - x}`);
        directionSet.add(`${-x},${x - distance}`);
    }
    const directions = Array.from(directionSet).map((dirString) => {
        const [x, y] = dirString.split(',').map(Number);
        return { x, y };
    });

    return directions
        .map((dir) => map[y + dir.y]?.[x + dir.x])
        .filter((node) => node != null);
};

const countPossibleCheats = (inputMap, minSave, cheatDuration = 2) => {
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
                x,
                y,
                tile,
            };
        })
    );

    searchMap(map, startPos, endPos, 'fromStart');
    searchMap(map, endPos, undefined, 'toEnd');

    const path = [];
    let currNode = map[endPos.y][endPos.x];
    while (currNode.x !== startPos.x || currNode.y !== startPos.y) {
        const surrs = getSurrounding(map, currNode.x, currNode.y).filter(
            (n) => n.value.fromStart === currNode.fromStart - 1
        );
        if (surrs.length > 1) {
            console.log('multiple paths');
        }
        path.unshift(surrs[0].value);
        currNode = surrs[0].value;
    }

    const shortcuts = new Set();
    path.forEach((node) => {
        for (let duration = cheatDuration; duration > 1; duration--) {
            const destinations = getTilesAtDistance(
                map,
                node.x,
                node.y,
                duration
            ).filter((node) => node.tile !== '#');
            destinations.forEach((dest) => {
                if (node.toEnd - dest.toEnd - duration + 1 >= minSave) {
                    shortcuts.add(`${node.x},${node.y},${dest.x},${dest.y}`);
                }
            });
        }
    });
    return shortcuts.size;
};
assert.equal(countPossibleCheats(inputSmall, 36), 4);
console.log(countPossibleCheats(input, 100));
assert.equal(countPossibleCheats(inputSmall, 68, 20), 3 + 4 + 22 + 12 + 14);
console.log(countPossibleCheats(input, 100, 20));
