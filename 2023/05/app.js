const fs = require('fs');
const assert = require('assert');
const {
    intervalUnion,
    intervalIntersection,
} = require('../../common/number-utils');

const parseInput = (fileName) => {
    const clusters = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n')
        .map((cluster) => cluster.split('\n'));
    const seeds = clusters[0][0]
        .split(' ')
        .slice(1)
        .map((n) => Number.parseInt(n));
    const maps = clusters.slice(1).map((cluster) => {
        const name = cluster[0];
        const rules = cluster
            .slice(1)
            .map((line) => {
                const parts = line.split(' ');
                return {
                    destStart: Number.parseInt(parts[0]),
                    sourceStart: Number.parseInt(parts[1]),
                    length: Number.parseInt(parts[2]),
                };
            })
            .sort((a, b) => a.sourceStart - b.sourceStart);
        return { name, rules };
    });
    return {
        seeds,
        maps,
    };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    return input.seeds.reduce((min, seed) => {
        const location = input.maps.reduce(
            (prev, map) => getNext(prev, map.rules),
            seed
        );
        if (location < min) {
            return location;
        }
        return min;
    }, Number.MAX_SAFE_INTEGER);
};

const getNext = (source, rules) => {
    const validRule = rules.find(
        (rule) =>
            rule.sourceStart <= source &&
            rule.sourceStart + rule.length > source
    );
    if (validRule) {
        return validRule.destStart + (source - validRule.sourceStart);
    }
    return source;
};

partTwoBruteForce = (input) => {
    const seedRanges = [];
    let min = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < input.seeds.length; i += 2) {
        seedRanges.push({ start: input.seeds[i], length: input.seeds[i + 1] });
        const start = input.seeds[i];
        const length = input.seeds[i + 1];
        let rangeMin = Number.MAX_SAFE_INTEGER;
        for (let i = start; i < start + length; i++) {
            const seedMin = partOne({ seeds: [i], maps: input.maps });
            if (seedMin < rangeMin) {
                rangeMin = seedMin;
            }
        }
        if (rangeMin < min) {
            min = rangeMin;
        }
    }
    return min;
};

partTwo = (input) => {
    let min = Number.MAX_SAFE_INTEGER;

    const maps = input.maps.map((map) =>
        map.rules.map((rule) => ({
            start: rule.sourceStart,
            end: rule.sourceStart + rule.length - 1,
            diff: rule.destStart - rule.sourceStart,
        }))
    );
    let currRanges = [];

    for (let i = 0; i < input.seeds.length; i += 2) {
        currRanges.push({
            start: input.seeds[i],
            end: input.seeds[i] + input.seeds[i + 1] - 1,
        });
    }

    maps.forEach((rules) => {
        const newRanges = [];
        currRanges.forEach((sourceRange) => {
            newRanges.push(...getNextRanges(sourceRange, rules));
        });
        currRanges = newRanges;
    });

    return currRanges.reduce(
        (min, range) => Math.min(min, range.start),
        Number.MAX_SAFE_INTEGER
    );
};

const getNextRanges = (sourceRange, rules) => {
    // find rules that "intersect" the sourceRange
    const validRules = rules.filter(
        (rule) =>
            Math.max(sourceRange.start, rule.start) <=
            Math.min(sourceRange.end, rule.end)
    );

    const resultRanges = [];
    let currStart = sourceRange.start;
    validRules.forEach((rule) => {
        // handle unmapped 'gap'
        if (currStart < rule.start) {
            resultRanges.push({ start: currStart, end: rule.start - 1 });
            currStart = rule.start;
        }
        const range = {
            start: currStart,
            end: Math.min(rule.end, sourceRange.end),
        };
        currStart = range.end + 1;
        // push the mapped range
        resultRanges.push({
            start: range.start + rule.diff,
            end: range.end + rule.diff,
        });
    });
    // handle unmapped 'gap' at the end
    if (currStart <= sourceRange.end) {
        resultRanges.push({ start: currStart, end: sourceRange.end });
    }
    return resultRanges;
};

assert.equal(partOne(inputSmall), 35);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 46);
console.log(partTwo(input));
