const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs.readFileSync(fileName, 'utf-8').replace(/\r/g, '').split('\n');
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const keypadCache = new Map();
const numpadCache = new Map();
const numpadKeys = {
    A: { x: 2, y: 3 },
    0: { x: 1, y: 3 },
    1: { x: 0, y: 2 },
    2: { x: 1, y: 2 },
    3: { x: 2, y: 2 },
    4: { x: 0, y: 1 },
    5: { x: 1, y: 1 },
    6: { x: 2, y: 1 },
    7: { x: 0, y: 0 },
    8: { x: 1, y: 0 },
    9: { x: 2, y: 0 },
};
const keypadKeys = {
    '^': { x: 1, y: 0 },
    A: { x: 2, y: 0 },
    '<': { x: 0, y: 1 },
    v: { x: 1, y: 1 },
    '>': { x: 2, y: 1 },
};

const getKeypadMoveSequences = (currPos, nextPos, cache, padType) => {
    let moveSequences = [];
    const cacheKey = `${currPos.x},${currPos.y},${nextPos.x},${nextPos.y}`;
    if (cache.has(cacheKey)) {
        moveSequences = cache.get(cacheKey);
    } else {
        const horizontalSequence = [];
        const verticalSequence = [];
        const moveX = nextPos.x - currPos.x;
        const moveY = nextPos.y - currPos.y;
        if (moveX !== 0 && moveY !== 0) {
        }
        if (moveY > 0) {
            verticalSequence.push(...Array(moveY).fill('v'));
        } else if (moveY < 0) {
            verticalSequence.push(...Array(-moveY).fill('^'));
        }
        if (moveX > 0) {
            horizontalSequence.push(...Array(moveX).fill('>'));
        } else if (moveX < 0) {
            horizontalSequence.push(...Array(-moveX).fill('<'));
        }

        if (horizontalSequence.length > 0 && verticalSequence.length > 0) {
            // handle notches (ugly)
            if (padType === 'numpad' && currPos.y === 3 && nextPos.x === 0) {
                // vertical first
                moveSequences.push([
                    ...verticalSequence,
                    ...horizontalSequence,
                    'A',
                ]);
            } else if (
                padType === 'numpad' &&
                nextPos.y === 3 &&
                currPos.x === 0
            ) {
                // horizontal first
                moveSequences.push([
                    ...horizontalSequence,
                    ...verticalSequence,
                    'A',
                ]);
            } else if (
                padType === 'keypad' &&
                currPos.y === 0 &&
                nextPos.x === 0
            ) {
                // vertical first
                moveSequences.push([
                    ...verticalSequence,
                    ...horizontalSequence,
                    'A',
                ]);
            } else if (
                padType === 'keypad' &&
                nextPos.y === 0 &&
                currPos.x === 0
            ) {
                // horizontal first
                moveSequences.push([
                    ...horizontalSequence,
                    ...verticalSequence,
                    'A',
                ]);
            } else {
                moveSequences.push(
                    [...horizontalSequence, ...verticalSequence, 'A'],
                    [...verticalSequence, ...horizontalSequence, 'A']
                );
            }
        } else if (horizontalSequence.length > 0) {
            moveSequences.push([...horizontalSequence, 'A']);
        } else if (verticalSequence.length > 0) {
            moveSequences.push([...verticalSequence, 'A']);
        } else {
            moveSequences.push(['A']);
        }

        cache.set(cacheKey, moveSequences);
    }
    return moveSequences;
};

const lengthCache = new Map();
const getShortestSequenceLength = (targetSequence, maxDepth = 2, depth = 0) => {
    if (lengthCache.has(`${targetSequence}:${maxDepth}:${depth}`)) {
        return lengthCache.get(`${targetSequence}:${maxDepth}:${depth}`);
    }
    if (depth > maxDepth) {
        return targetSequence.length;
    }
    let sequenceLength = 0;
    let currPos = depth === 0 ? numpadKeys['A'] : keypadKeys['A'];
    targetSequence.forEach((symbol) => {
        let nextPos = depth === 0 ? numpadKeys[symbol] : keypadKeys[symbol];

        const moveSequences = getKeypadMoveSequences(
            currPos,
            nextPos,
            depth === 0 ? numpadCache : keypadCache,
            depth === 0 ? 'numpad' : 'keypad'
        );
        const shortestMoveSequence = moveSequences.reduce(
            (shortest, sequence) => {
                const possibleShortest = getShortestSequenceLength(
                    sequence,
                    maxDepth,
                    depth + 1
                );
                return possibleShortest < shortest
                    ? possibleShortest
                    : shortest;
            },
            Infinity
        );
        sequenceLength += shortestMoveSequence;
        currPos = nextPos;
    });

    lengthCache.set(`${targetSequence}:${maxDepth}:${depth}`, sequenceLength);
    return sequenceLength;
};

const partOne = (codes) => {
    return codes.reduce((sum, code) => {
        const shortest = getShortestSequenceLength(code.split(''));
        const codeNumber = parseInt(code);
        return sum + shortest * codeNumber;
    }, 0);
};

const partTwo = (codes) => {
    return codes.reduce((sum, code) => {
        const shortest = getShortestSequenceLength(code.split(''), 25);
        const codeNumber = parseInt(code);
        return sum + shortest * codeNumber;
    }, 0);
};

assert.equal(partOne(inputSmall), 126384);
console.log(partOne(input));

console.log(partTwo(input));
