const fs = require('fs');
const assert = require('assert');
const {
    intervalUnion,
    intervalIntersection,
} = require('../../common/number-utils');

const manhattanDistance = (vec1, vec2) => {
    return Math.abs(vec2.x - vec1.x) + Math.abs(vec2.y - vec1.y);
};

const parseInput = (fileName) => {
    const lineRegex =
        /Sensor at x=(.+), y=(.+): closest beacon is at x=(.+), y=(.+)/;
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const parts = line
                .replace(lineRegex, '$1,$2,$3,$4')
                .split(',')
                .map((s) => parseInt(s));
            const position = { x: parts[0], y: parts[1] };
            const beacon = { x: parts[2], y: parts[3] };
            const distance = manhattanDistance(position, beacon);
            return { position, beacon, distance };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const getLineIntervals = (sensors, y) => {
    const intervals = [];
    sensors.forEach((sensor) => {
        const pointOnLine = { x: sensor.position.x, y };
        const distanceToLine = manhattanDistance(sensor.position, pointOnLine);
        const overlap = sensor.distance - distanceToLine;
        if (overlap >= 0) {
            intervals.push({
                start: pointOnLine.x - overlap,
                end: pointOnLine.x + overlap,
            });
        }
    });
    return intervals;
};

const partOne = (sensors, y) => {
    const intervals = getLineIntervals(sensors, y);
    const union = intervalUnion(intervals);
    const count = union.reduce(
        (sum, interval) => sum + (interval.end - interval.start),
        0
    );

    return count;
};

const partTwo = (sensors, maxCoord) => {
    const range = { start: 0, end: maxCoord };
    for (let y = 0; y <= maxCoord; y++) {
        const intervals = getLineIntervals(sensors, y);
        const union = intervalUnion(intervals);
        const intersection = intervalIntersection([...union, range]);

        let resX;
        if (intersection.length > 1) {
            resX = intersection[0].end + 1;
        } else if (intersection[0].start !== 0) {
            resX = 0;
        } else if (intersection[0].end !== maxCoord) {
            resX = maxCoord;
        }
        if (resX != null) {
            return 4000000 * resX + y;
        }
    }
    return null;
};

assert.equal(partOne(inputSmall, 10), 26);
console.log(partOne(input, 2000000));
assert.equal(partTwo(inputSmall, 20), 56000011);
console.log(partTwo(input, 4000000));
