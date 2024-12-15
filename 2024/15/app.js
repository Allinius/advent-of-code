const fs = require('fs');
const assert = require('assert');
const vec2d = require('../../common/vec2d');
const { drawImage } = require('../../common/image-utils');

const parseInput = (fileName) => {
    const [mapSegment, moveSegment] = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');

    return {
        map: mapSegment.split('\n').map((line) => line.split('')),
        moves: moveSegment.replaceAll('\n', '').split(''),
    };
};

const inputSmall = parseInput('input-small.txt');
const inputSmall2 = parseInput('input-small2.txt');
const input = parseInput('input.txt');

const directions = {
    '^': { x: 0, y: -1 },
    '>': { x: 1, y: 0 },
    v: { x: 0, y: 1 },
    '<': { x: -1, y: 0 },
};

const attemptMove = (map, moveSymbol, robotPos) => {
    const direction = directions[moveSymbol];
    let boxCount = 0;
    let canMove;
    let scanPos = robotPos;
    while (canMove == null) {
        scanPos = vec2d.add(scanPos, direction);
        const scanTile = map[scanPos.y][scanPos.x];
        if (scanTile === '#') {
            canMove = false;
            break;
        }
        if (scanTile === '.') {
            canMove = true;
            break;
        }
        if (scanTile === 'O') {
            boxCount++;
        }
    }
    if (!canMove) {
        return robotPos;
    }

    const newRobotPos = vec2d.add(robotPos, direction);
    map[robotPos.y][robotPos.x] = '.';
    map[newRobotPos.y][newRobotPos.x] = '@';

    if (boxCount > 0) {
        const newBoxPos = vec2d.add(
            newRobotPos,
            vec2d.scalarMultiply(direction, boxCount)
        );
        map[newBoxPos.y][newBoxPos.x] = 'O';
    }
    return newRobotPos;
};

const partOne = (input) => {
    const map = JSON.parse(JSON.stringify(input.map));
    let robotPos;
    map.forEach((line, y) => {
        line.forEach((tile, x) => {
            if (tile === '@') {
                robotPos = { x, y };
            }
        });
    });

    input.moves.forEach((move) => {
        robotPos = attemptMove(map, move, robotPos);
    });

    return map.reduce(
        (sum, line, y) =>
            sum +
            line.reduce(
                (lineSum, tile, x) =>
                    lineSum + (tile === 'O' ? 100 * y + x : 0),
                0
            ),
        0
    );
};

const attemptMoveBig = (map, moveSymbol, robotPos) => {
    const direction = directions[moveSymbol];
    const boxesToMove = [];
    const openBoxes = [];
    let canMove;
    let scanPos = vec2d.add(robotPos, direction);
    const scanTile = map[scanPos.y][scanPos.x];
    if (scanTile === '#') {
        canMove = false;
    }
    if (scanTile === '.') {
        canMove = true;
    }
    if (scanTile === '[') {
        openBoxes.push({ x: scanPos.x, y: scanPos.y });
    }
    if (scanTile === ']') {
        openBoxes.push({ x: scanPos.x - 1, y: scanPos.y });
    }

    while (openBoxes.length > 0) {
        const currBox = openBoxes.pop();
        const scanPos1 = vec2d.add(currBox, direction);
        const scanPos2 = vec2d.add(scanPos1, { x: 1, y: 0 });
        const scanTile1 = map[scanPos1.y][scanPos1.x];
        const scanTile2 = map[scanPos2.y][scanPos2.x];

        if (scanTile1 === '#' || scanTile2 === '#') {
            canMove = false;
            break;
        }

        boxesToMove.push(currBox);

        if (direction.x > 0 && scanTile2 === '[') {
            openBoxes.push(scanPos2);
        }
        if (direction.x < 0 && scanTile1 === ']') {
            openBoxes.push(vec2d.add(scanPos1, { x: -1, y: 0 }));
        }
        if (direction.x !== 0) {
            continue;
        }

        // vertical move
        if (scanTile1 === '[') {
            openBoxes.push(scanPos1);
            continue;
        }

        if (scanTile1 === ']') {
            openBoxes.push(vec2d.add(scanPos1, { x: -1, y: 0 }));
        }

        if (scanTile2 === '[') {
            openBoxes.push(scanPos2);
        }
    }

    if (canMove === false) {
        return robotPos;
    }

    if (direction.x !== 0) {
        boxesToMove.sort(
            (boxA, boxB) => Math.sign(direction.x) * (boxB.x - boxA.x)
        );
    }
    if (direction.y !== 0) {
        boxesToMove.sort(
            (boxA, boxB) => Math.sign(direction.y) * (boxB.y - boxA.y)
        );
    }
    boxesToMove.forEach((boxPos) => {
        const newBoxPos = vec2d.add(boxPos, direction);
        map[boxPos.y][boxPos.x] = '.';
        map[boxPos.y][boxPos.x + 1] = '.';
        map[newBoxPos.y][newBoxPos.x] = '[';
        map[newBoxPos.y][newBoxPos.x + 1] = ']';
    });

    const newRobotPos = vec2d.add(robotPos, direction);
    map[robotPos.y][robotPos.x] = '.';
    map[newRobotPos.y][newRobotPos.x] = '@';

    return newRobotPos;
};

const partTwo = (input, draw = false) => {
    const map = [];
    input.map.forEach((line) => {
        const newLine = [];
        line.forEach((tile) => {
            switch (tile) {
                case '#':
                    newLine.push('#', '#');
                    break;
                case 'O':
                    newLine.push('[', ']');
                    break;
                case '.':
                    newLine.push('.', '.');
                    break;
                case '@':
                    newLine.push('@', '.');
                    break;
            }
        });
        map.push(newLine);
    });
    let robotPos;
    map.forEach((line, y) => {
        line.forEach((tile, x) => {
            if (tile === '@') {
                robotPos = { x, y };
            }
        });
    });

    input.moves.forEach((move, moveIndex) => {
        robotPos = attemptMoveBig(map, move, robotPos);
        if (draw) {
            drawImage(
                map,
                5,
                {
                    '#': 'rgb(37, 37, 37)',
                    '.': 'rgb(211, 211, 211)',
                    '@': 'rgb(32, 197, 142)',
                    '[': 'rgb(117, 86, 65)',
                    ']': 'rgb(117, 86, 65)',
                },
                `out/${moveIndex}.png`
            );
        }
    });

    return map.reduce(
        (sum, line, y) =>
            sum +
            line.reduce(
                (lineSum, tile, x) =>
                    lineSum + (tile === '[' ? 100 * y + x : 0),
                0
            ),
        0
    );
};

assert.equal(partOne(inputSmall), 10092);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 9021);
console.log(partTwo(input, true));
