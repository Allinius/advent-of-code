const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const [designPart, towelPart] = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');
    return {
        designs: designPart.split(', '),
        towels: towelPart.split('\n'),
    };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

checkTowelPossible = (towel, designs) => {
    const states = [{ towel }];
    let possibleCount = 0;
    while (states.length > 0) {
        const state = states.pop();
        if (state.towel.length === 0) {
            possibleCount++;
            continue;
        }

        designs?.forEach((design) => {
            if (state.towel.startsWith(design)) {
                states.push({
                    towel: state.towel.slice(design.length),
                });
            }
        });
    }
    return possibleCount;
};

partOne = (input) => {
    input.designs.sort((a, b) => a.length - b.length);
    const filteredDesigns = input.designs.filter(
        (design, index) =>
            !checkTowelPossible(design, input.designs.slice(0, index))
    );

    return input.towels.reduce(
        (possibleCount, towel) =>
            checkTowelPossible(towel, filteredDesigns)
                ? possibleCount + 1
                : possibleCount,
        0
    );
};

const checkTowelPossibleWithCache = (towel, designs, cache) => {
    if (towel.length === 0) {
        return 1;
    }
    if (cache.has(towel)) {
        return cache.get(towel);
    }

    let possibleCount = 0;
    designs?.forEach((design) => {
        if (towel.startsWith(design)) {
            possibleCount += checkTowelPossibleWithCache(
                towel.slice(design.length),
                designs,
                cache
            );
        }
    });
    cache.set(towel, possibleCount);
    return possibleCount;
};

const partTwo = (input) => {
    return input.towels.reduce(
        (possibleCount, towel) =>
            possibleCount +
            checkTowelPossibleWithCache(towel, input.designs, new Map()),
        0
    );
};

assert.equal(partOne(inputSmall), 6);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 16);
console.log(partTwo(input));
