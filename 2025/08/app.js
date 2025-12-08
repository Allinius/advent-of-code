const fs = require('fs');
const assert = require('assert');
const { distance } = require('../../common/vec3d');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const [x, y, z] = line.split(',').map(Number);
            return { x, y, z };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const solve = (positions, connectionCount = 10) => {
    const distances = [];
    positions.forEach((position, index) => {
        if (index === positions.length - 1) {
            return;
        }
        for (let i = index + 1; i < positions.length; i++) {
            const dist = distance(positions[index], positions[i]);
            distances.push({
                dist,
                v1: positions[index],
                v2: positions[i],
            });
        }
    });
    distances.sort((a, b) => a.dist - b.dist);

    var circuitSizes = {};
    var nextId = 0;
    var lastConnection;
    const conCount =
        connectionCount === -1 ? distances.length : connectionCount;
    for (let i = 0; i < conCount; i++) {
        if (
            Object.keys(circuitSizes) === 1 &&
            Object.values[circuitSizes][0].circuitNodes.length ===
                positions.length
        ) {
            break;
        }

        const v1 = distances[i].v1;
        const v2 = distances[i].v2;
        if (v1.circuit == null && v2.circuit == null) {
            v1.circuit = nextId;
            v2.circuit = nextId;
            const circuitNodes = [v1, v2];
            v1.circuitNodes = circuitNodes;
            v2.circuitNodes = circuitNodes;
            circuitSizes[nextId++] = 2;
            lastConnection = [v1, v2];
            continue;
        }
        if (v1.circuit === v2.circuit) {
            continue;
        }
        if (v1.circuit != null && v2.circuit != null) {
            const circuitNodes = [...v1.circuitNodes, ...v2.circuitNodes];
            delete circuitSizes[v2.circuit];
            circuitSizes[v1.circuit] += v2.circuitNodes.length;
            circuitNodes.forEach((n) => {
                n.circuit = v1.circuit;
                n.circuitNodes = circuitNodes;
            });
            lastConnection = [v1, v2];
            continue;
        }
        const withoutCir = v1.circuit == null ? v1 : v2;
        const withCir = v1.circuit == null ? v2 : v1;
        const circuitNodes = [...withCir.circuitNodes, withoutCir];
        circuitSizes[withCir.circuit] += 1;
        circuitNodes.forEach((n) => {
            n.circuit = withCir.circuit;
            n.circuitNodes = circuitNodes;
        });
        lastConnection = [v1, v2];
    }

    if (connectionCount === -1) {
        return lastConnection[0].x * lastConnection[1].x;
    }
    return Object.values(circuitSizes)
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((acc, size) => acc * size, 1);
};

assert.equal(solve(inputSmall), 40);
console.log(solve(input, 1000));
assert.equal(solve(inputSmall, -1), 25272);
console.log(solve(input, -1));
