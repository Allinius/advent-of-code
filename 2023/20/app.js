const fs = require('fs');
const assert = require('assert');
const { arrayLCM } = require('../../common/number-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const [nameStr, outputsPart] = line.split(' -> ');
            const outputs = outputsPart.split(', ');
            const type =
                nameStr[0] === '%'
                    ? 'flipflop'
                    : nameStr[0] === '&'
                    ? 'conjunction'
                    : 'broadcast';
            const name =
                nameStr[0] === '%' || nameStr[0] === '&'
                    ? nameStr.slice(1)
                    : nameStr;
            return { name, type, outputs };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    const nodes = prepareGraph(input);
    let totalCount = { low: 0, high: 0 };
    for (let i = 0; i < 1000; i++) {
        const count = pushButton(nodes);
        totalCount.low += count.low;
        totalCount.high += count.high;
    }
    return totalCount.low * totalCount.high;
};

const partTwo = (input) => {
    const nodes = prepareGraph(input);

    const endNode = nodes.find((n) => n.name === 'rx');
    const suspiciousNames = endNode.inputs[0].inputs.map((n) => n.name);
    const suspiciousNodes = suspiciousNames.map((name) =>
        nodes.find((n) => n.name === name)
    );
    suspiciousNodes.forEach((node) => {
        node.history = [];
        node.inputIndexToIgnore = node.inputs.findIndex(
            (i) => i.inputs.length !== 1
        );
    });
    let pressCount = 0;
    while (++pressCount) {
        const result = pushButton(nodes, suspiciousNames);
        if (result.watchResult.length > 0) {
            result.watchResult
                .map((name) => suspiciousNodes.find((n) => n.name === name))
                .forEach((node) => {
                    node.history.push(pressCount);
                    if (node.history.length === 2) {
                        node.cycleFound = true;
                        node.cycleLength = node.history[1] - node.history[0];
                    }
                });
        }
        if (suspiciousNodes.every((n) => n.cycleFound)) {
            return arrayLCM(suspiciousNodes.map((n) => n.cycleLength));
        }
    }
};

const prepareGraph = (definitions) => {
    const nodes = JSON.parse(JSON.stringify(definitions));
    nodes.forEach((node) => {
        node.outputs = node.outputs.map((outputName) => {
            const output = nodes.find((n) => n.name === outputName);
            if (!output) {
                const newNode = {
                    name: outputName,
                    type: 'mystery',
                    inputs: [node],
                };
                nodes.push(newNode);
                return newNode;
            } else if (!output.inputs) {
                output.inputs = [node];
            } else {
                output.inputs.push(node);
            }
            return output;
        });
        if (node.type === 'flipflop') {
            node.turnedOn = false;
        }
    });
    nodes
        .filter((n) => n.type === 'conjunction')
        .forEach((node) => {
            node.inputMemory = node.inputs.map(() => false);
        });
    return nodes;
};

const pushButton = (nodes, nodesToWatch = []) => {
    const startingNode = nodes.find((n) => n.name === 'broadcaster');
    // button press start
    let queue = startingNode.outputs.map((o) => [o, false, 'broadcaster']);
    let result = { low: 1, high: 0, watchResult: [] };
    while (queue.length > 0) {
        const newQueue = [];
        queue.forEach(([node, command, sourceName]) => {
            result[command ? 'high' : 'low']++;
            if (node.type === 'flipflop' && command === false) {
                node.turnedOn = !node.turnedOn;
                newQueue.push(
                    ...node.outputs.map((o) => [o, node.turnedOn, node.name])
                );
            } else if (node.type === 'conjunction') {
                const inputIndex = node.inputs.findIndex(
                    (i) => i.name === sourceName
                );
                if (nodesToWatch.indexOf(node.name) >= 0 && command === false) {
                    result.watchResult.push(node.name);
                }
                if (inputIndex === null) {
                    return;
                }
                node.inputMemory[inputIndex] = command;
                if (!node.inputMemory.some((i) => i === false)) {
                    newQueue.push(
                        ...node.outputs.map((o) => [o, false, node.name])
                    );
                } else {
                    newQueue.push(
                        ...node.outputs.map((o) => [o, true, node.name])
                    );
                }
            }
        });
        queue = newQueue;
    }
    return result;
};

assert.equal(partOne(inputSmall), 32000000);
console.log(partOne(input));
console.log(partTwo(input));
