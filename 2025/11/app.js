const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const [id, connectedPart] = line.split(': ');
            return { id, connectedIds: connectedPart.split(' ') };
        });
};

const inputSmall = parseInput('input-small.txt');
const inputSmall2 = parseInput('input-small2.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    const graph = createGraph(input);
    try {
        JSON.parse(JSON.stringify(graph));
    } catch {
        throw new Error('circular graph');
    }
    return countPaths(graph, 'out');
};

const createGraph = (input, id = 'you') => {
    if (id === 'out') {
        return { id: 'out', connections: [] };
    }
    const inputNode = input.find((n) => n.id === id);
    if (inputNode.connections) {
        return inputNode;
    }
    inputNode.connections = [];
    inputNode.connectedIds.forEach((con) => {
        inputNode.connections.push(createGraph(input, con));
    });
    return inputNode;
};

const countPaths = (node, targetId, cache = new Map()) => {
    if (node.id === targetId) {
        return 1;
    }
    let pathCount = 0;
    node.connections.forEach((con) => {
        if (cache.has(con.id)) {
            pathCount += cache.get(con.id);
            return;
        }
        pathCount += countPaths(con, targetId, cache);
    });
    cache.set(node.id, pathCount);
    return pathCount;
};

const partTwo = (input) => {
    const svr = createGraph(input, 'svr');
    const dac = input.find((n) => n.id === 'dac');
    const fft = input.find((n) => n.id === 'fft');

    const pathsToDac = countPaths(svr, 'dac');
    const pathsToFft = countPaths(svr, 'fft');
    const pathsDacToFft = countPaths(dac, 'fft');
    const pathsFftToDac = countPaths(fft, 'dac');
    const pathsDacToOut = countPaths(dac, 'out');
    const pathsFftToOut = countPaths(fft, 'out');

    return (
        pathsToDac * pathsDacToFft * pathsFftToOut +
        pathsToFft * pathsFftToDac * pathsDacToOut
    );
};

assert.equal(partOne(inputSmall), 5);
console.log(partOne(input));

assert.equal(partTwo(inputSmall2), 2);
console.log(partTwo(input));
