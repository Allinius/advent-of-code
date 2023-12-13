const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n')
        .map((pattern) => pattern.split('\n'));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (patterns) => {
    return patterns.reduce((acc, pattern) => {
        let score = acc;
        const reflections = getReflections(pattern);
        if (reflections.horizontal[0]) {
            score += reflections.horizontal[0] + 1;
        }
        if (reflections.vertical[0]) {
            score += 100 * (reflections.vertical[0] + 1);
        }
        return score;
    }, 0);
};

const partTwo = (patterns) => {
    return patterns.reduce((acc, pattern) => {
        const originalReflections = getReflections(pattern);
        const unsmudgedPatterns = [];
        pattern.forEach((line, y) =>
            line.split('').forEach((char, x) => {
                const clone = JSON.parse(JSON.stringify(pattern));
                clone[y] =
                    clone[y].substring(0, x) +
                    (clone[y][x] === '#' ? '.' : '#') +
                    clone[y].substring(x + 1, clone[y].length);
                unsmudgedPatterns.push(clone);
            })
        );
        const smudgeReflections = unsmudgedPatterns
            .map((unsmudgedPattern) => ({
                vertical: getVertical(unsmudgedPattern).filter(
                    (ref) => originalReflections.vertical.indexOf(ref) === -1
                )[0],
                horizontal: getHorizontal(unsmudgedPattern).filter(
                    (ref) => originalReflections.horizontal.indexOf(ref) === -1
                )[0],
            }))
            .filter(
                (reflections) =>
                    reflections.horizontal != null ||
                    reflections.vertical != null
            );
        let score = acc;
        if (smudgeReflections[0].horizontal != null) {
            score += smudgeReflections[0].horizontal + 1;
        }
        if (smudgeReflections[0].vertical != null) {
            score += 100 * (smudgeReflections[0].vertical + 1);
        }
        return score;
    }, 0);
};

const getReflections = (pattern) => {
    return {
        horizontal: getHorizontal(pattern),
        vertical: getVertical(pattern),
    };
};

const getHorizontal = (pattern) => {
    const transposedPattern = pattern[0]
        .split('')
        .reduce(
            (transposed, _, x) => [
                ...transposed,
                pattern.map((line) => line[x]).join(''),
            ],
            []
        );
    return getVertical(transposedPattern);
};

const getVertical = (pattern) => {
    const pairIndices = getPairIndices(pattern, true);
    const reflections = pairIndices.filter((index) =>
        isReflection(pattern, index)
    );
    return reflections;
};

const getPairIndices = (pattern) => {
    return pattern.reduce(
        (acc, curr, index) =>
            index < pattern.length - 1 && curr === pattern[index + 1]
                ? [...acc, index]
                : acc,
        []
    );
};

const isReflection = (pattern, index) => {
    for (let i = 1; i <= Math.min(index, pattern.length - 2 - index); i++) {
        if (pattern[index - i] !== pattern[index + 1 + i]) {
            return false;
        }
    }
    return true;
};

assert.equal(partOne(inputSmall), 405);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 400);
console.log(partTwo(input));
