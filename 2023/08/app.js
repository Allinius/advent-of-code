const fs = require('fs');
const assert = require('assert');
const { arrayLCM } = require('../../common/number-utils');

const parseInput = (fileName) => {
    const [instructionPart, rulePart] = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');
    const instructions = instructionPart.split('');
    const nodes = rulePart.split('\n').map((line) => {
        const [name, destPart] = line.split(' = ');
        const [L, R] = destPart.slice(1, -1).split(', ');
        return { name, L, R };
    });
    return { instructions, nodes };
};

const inputSmall = parseInput('input-small.txt');
const inputPart2 = parseInput('input-part-2.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    const nodes = getLinkedNodes(input.nodes);

    let step = 0;
    let currNode = nodes.find((n) => n.name === 'AAA');
    while (currNode.name !== 'ZZZ') {
        currNode =
            currNode[input.instructions[step % input.instructions.length]];

        step++;
    }
    return step;
};

const getLinkedNodes = (nodes) => {
    const nodesClone = JSON.parse(JSON.stringify(nodes));
    nodesClone.forEach((node) => {
        node.L = nodesClone.find((n) => n.name === node.L);
        node.R = nodesClone.find((n) => n.name === node.R);
    });
    return nodesClone;
};

const partTwo = (input) => {
    const nodes = getLinkedNodes(input.nodes);

    const startNodes = nodes.filter((n) => n.name[2] === 'A');

    for (let startNode of startNodes) {
        let step = 0;
        let currNode = startNode;
        while (!startNode.cycleLength) {
            const instructionIndex = step % input.instructions.length;
            currNode = currNode[input.instructions[instructionIndex]];

            step++;

            if (currNode.name[2] === 'Z') {
                if (startNode.firstZ) {
                    startNode.cycleLength = step - startNode.firstZ;
                    break;
                }
                startNode.firstZ = step;
            }
        }
    }
    return arrayLCM(startNodes.map((n) => n.cycleLength));
};

assert.equal(partOne(inputSmall), 6);
console.log(partOne(input));
assert.equal(partTwo(inputPart2), 6);
console.log(partTwo(input));
