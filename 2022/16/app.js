const fs = require('fs');
const assert = require('assert');
const { combinate } = require('../../common/array-utils');

const parseInput = (fileName) => {
    const lineRegex =
        /Valve (.{2}) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? /;
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const parts = line.replace(lineRegex, '$1, $2, ').split(', ');
            return {
                id: parts[0],
                rate: parseInt(parts[1]),
                tunnels: parts.slice(2),
                distances: {},
            };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const findShortestPath = (valves, start, end) => {
    const distanceMap = valves.reduce(
        (acc, valve) => ({
            ...acc,
            [valve.id]: Number.MAX_SAFE_INTEGER,
        }),
        {}
    );

    distanceMap[start] = 0;
    const queue = [start];

    while (queue.length > 0) {
        const valveId = queue.shift();
        if (valveId === end) {
            break;
        }
        const destinations = valves.find((v) => v.id === valveId).tunnels;
        destinations.forEach((d) => {
            if (distanceMap[d] > distanceMap[valveId] + 1) {
                distanceMap[d] = distanceMap[valveId] + 1;
                queue.push(d);
            }
        });
    }

    return distanceMap[end];
};

const reduceGraph = (valves, start) => {
    const usefulValves = valves.filter((v) => v.rate > 0);
    [start, ...usefulValves].forEach((start) => {
        usefulValves.forEach((end) => {
            const distance = findShortestPath(valves, start.id, end.id);
            if (distance == null || start.id === end.id) {
                return;
            }
            start.distances[end.id] = distance;
        });
    });
    return [start, ...usefulValves];
};

const highestPressure = (current, valves, remaining, opened) => {
    if (remaining === 0) {
        return 0;
    }

    const currPressure = current.rate * remaining;
    let maxPressure = currPressure;
    let maxOpened = [...opened, current.id];

    for (let destKey in current.distances) {
        const distance = current.distances[destKey];
        const destination = valves.find((v) => v.id === destKey);
        if (
            distance >= remaining ||
            opened.indexOf(destKey) >= 0 ||
            destination == null
        ) {
            continue;
        }

        const destOpened = [...opened, current.id];
        const destPressure = highestPressure(
            destination,
            valves,
            remaining - distance - 1,
            destOpened
        );
        if (currPressure + destPressure > maxPressure) {
            maxPressure = currPressure + destPressure;
            maxOpened = destOpened;
        }
    }

    maxOpened.forEach((v) => {
        if (opened.indexOf(v) >= 0) {
            return;
        }
        opened.push(v);
    });
    return maxPressure;
};

const partOne = (valves) => {
    const start = valves.find((v) => v.id === 'AA');
    const reducedValves = reduceGraph(valves, start);
    const opened = [];
    const p = highestPressure(start, reducedValves, 30, opened);
    return p;
};

const partTwo = (valves) => {
    const start = valves.find((v) => v.id === 'AA');
    const reducedValves = reduceGraph(valves, start).slice(1);
    // try each pair of combinations
    let max = 0;
    for (let myCount = 1; myCount <= reducedValves.length / 2; myCount++) {
        const myCombinations = combinate(reducedValves, myCount);
        myCombinations.forEach((myValves) => {
            const elephantValves = reducedValves.filter(
                (v) => myValves.find((my) => v.id === my.id) == null
            );
            const myPressure = highestPressure(
                start,
                [start, ...myValves],
                26,
                []
            );
            const elephantPressure = highestPressure(
                start,
                [start, ...elephantValves],
                26,
                []
            );
            if (myPressure + elephantPressure > max) {
                max = myPressure + elephantPressure;
            }
        });
    }
    return max;
};

assert.equal(partOne(inputSmall), 1651);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 1707);
console.log(partTwo(input));
