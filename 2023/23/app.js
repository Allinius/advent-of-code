const fs = require('fs');
const assert = require('assert');
const { positiveModulo } = require('../../common/number-utils');
const { drawImage } = require('../../common/image-utils');
const { getCell, getSurrounding } = require('../../common/array-2d-util');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
];

const partOne = (input) => {
    const map = JSON.parse(JSON.stringify(input));
    const startPos = { x: 1, y: 0 };
    const endPos = { x: map[0].length - 2, y: map.length - 1 };
    map[startPos.y][startPos.x] = 'S';
    map[endPos.y][endPos.x] = 'E';
    map.forEach((line, y) => {
        line.forEach((cell, x) => {
            if (cell !== '.' && cell !== '#') {
                let dirIndex = ['^', '>', 'v', '<'].indexOf(cell);
                if (dirIndex === -1) {
                    // start and end are down directed
                    dirIndex = 2;
                }
                map[y][x] = {
                    type: cell,
                    dirIndex,
                    maxPathLength: 0,
                    x,
                    y,
                };
            }
        });
    });
    let queue = [map[startPos.y][startPos.x]];
    while (queue.length > 0) {
        const newQueue = [];
        queue.forEach((node) => {
            if (node.type === 'E') {
                return;
            }
            const path = [[node.x, node.y, node.dirIndex]];
            while (true) {
                const [lastX, lastY, lastDirIndex] = path[path.length - 1];
                const neighbors = getSurrounding(map, lastX, lastY).filter(
                    (n) =>
                        n.value !== '#' &&
                        n.dirIndex !== positiveModulo(lastDirIndex - 2, 4)
                );
                const nextNodes = [];
                let nextEmpty = [];
                neighbors.forEach((n) => {
                    if (n.value === '.') {
                        nextEmpty.push(n);
                    } else {
                        const nextNode = n.value;
                        if (nextNode.dirIndex === n.dirIndex) {
                            nextNodes.push(n.value);
                        }
                    }
                });
                nextNodes.forEach((nextNode) => {
                    nextNode.maxPathLength = Math.max(
                        nextNode.maxPathLength,
                        node.maxPathLength + path.length
                    );
                    newQueue.push(nextNode);
                });
                if (nextEmpty.length > 1) {
                    console.log('error');
                }
                if (nextEmpty.length === 0) {
                    break;
                }
                const next = nextEmpty[0];
                path.push([next.x, next.y, next.dirIndex]);
            }
        });
        queue = newQueue;
    }
    return map[endPos.y][endPos.x].maxPathLength;
};

const partTwo = (input) => {
    const map = JSON.parse(JSON.stringify(input));
    const startPos = { x: 1, y: 0 };
    const endPos = { x: map[0].length - 2, y: map.length - 1 };
    map[startPos.y][startPos.x] = 'S';
    map[endPos.y][endPos.x] = 'E';

    const nodes = [];
    map.forEach((line, y) =>
        line.forEach((cell, x) => {
            if (cell !== '.') {
                return;
            }
            const adjSlopes = getSurrounding(map, x, y).filter(
                (n) => n.value === '>' || n.value === 'v'
            );
            if (adjSlopes.length > 1) {
                // crossroad detected
                const crossroad = {
                    x,
                    y,
                    directions: adjSlopes.map((n) => n.dirIndex),
                    outgoing: [[], [], [], []],
                };
                nodes.push(crossroad);
                adjSlopes.forEach((slope) => {
                    map[slope.y][slope.x] = crossroad;
                });
            }
        })
    );

    nodes.forEach((node) => {
        node.directions.forEach((dirIndex) => {
            const dir = directions[dirIndex];
            const path = [[node.x + dir.x, node.y + dir.y, dirIndex]];
            while (true) {
                const [lastX, lastY, lastDirIndex] = path[path.length - 1];
                const neighbors = getSurrounding(map, lastX, lastY).filter(
                    (n) =>
                        n.value !== '#' &&
                        n.dirIndex !== positiveModulo(lastDirIndex - 2, 4)
                );
                const nextNodes = [];
                let nextEmpty = [];
                neighbors.forEach((n) => {
                    if (n.value === '.') {
                        nextEmpty.push(n);
                    } else {
                        nextNodes.push([n.value, n.dirIndex]);
                    }
                });
                if (nextNodes.length > 1) {
                    console.log('error');
                }
                if (nextNodes.length === 1) {
                    const [nextNode, entryDirIndex] = nextNodes[0];
                    if (nextNode === 'S') {
                        node.isStarting = true;
                        node.startDistance = path.length;
                        node.startEntryDirIndex = positiveModulo(
                            dirIndex - 2,
                            4
                        );
                    } else if (nextNode === 'E') {
                        node.isEnding = true;
                        node.endDistance = path.length;
                        node.maxPathLength = -1;
                    } else {
                        node.outgoing[dirIndex] = {
                            nextNode,
                            entryDirIndex,
                            distance: path.length,
                        };
                    }
                }
                if (nextEmpty.length > 1) {
                    console.log('error');
                }
                if (nextEmpty.length === 0) {
                    break;
                }
                const next = nextEmpty[0];
                path.push([next.x, next.y, next.dirIndex]);
            }
        });
    });

    const startingNode = nodes.find((n) => n.isStarting);
    let queue = [
        {
            node: startingNode,
            dirIndex: startingNode.startEntryDirIndex,
            totalDistance: startingNode.startDistance,
            visitedNodes: [startingNode],
        },
    ];
    while (queue.length > 0) {
        const newQueue = [];
        queue.forEach(({ node, dirIndex, totalDistance, visitedNodes }) => {
            if (node.isEnding) {
                node.maxPathLength = Math.max(
                    node.maxPathLength,
                    totalDistance + 2 + node.endDistance
                );
                return;
            }
            const validDirections = node.directions.filter(
                (d) => d !== positiveModulo(dirIndex - 2, 4)
            );
            if (validDirections.length === 0) {
                return;
            }
            const outgoing = validDirections
                .map((d) => node.outgoing[d])
                .filter((out) => visitedNodes.indexOf(out.nextNode) === -1);
            outgoing.forEach(({ nextNode, entryDirIndex, distance }) => {
                newQueue.push({
                    node: nextNode,
                    dirIndex: entryDirIndex,
                    totalDistance: totalDistance + 2 + distance,
                    visitedNodes: [...visitedNodes, nextNode],
                });
            });
        });
        queue = newQueue;
    }

    return nodes.find((n) => n.isEnding).maxPathLength;
};

assert.equal(partOne(inputSmall), 94);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 154);
console.log(partTwo(input));
