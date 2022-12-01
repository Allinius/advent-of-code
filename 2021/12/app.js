const fs = require('fs');

const smallInput = fs.readFileSync('input-small.txt', 'utf-8').replace(/\r/g, "").split('\n').map(l => l.split('-'));
const input = fs.readFileSync('input.txt', 'utf-8').replace(/\r/g, "").split('\n').map(l => l.split('-'));

const parseInput = (input) => {
    const nodes = new Map();
    input.forEach(path => {
        if (!nodes.has(path[0])) {
            nodes.set(path[0], [path[1]]);
        } else {
            nodes.get(path[0]).push(path[1]);
        }
        if (!nodes.has(path[1])) {
            nodes.set(path[1], [path[0]]);
        } else {
            nodes.get(path[1]).push(path[0]);
        }
    });
    return nodes;
}

const countPaths = (current, end, nodes, visited, canRevisitSmall) => {
    if (current === end) {
        return 1;
    }
    let neighbourPathCount = 0;
    nodes.get(current).forEach(neighbour => {
        
        if (neighbour !== neighbour.toLowerCase() || visited.findIndex(v => v === neighbour) === -1) {
            neighbourPathCount += countPaths(neighbour, end, nodes, [...visited, neighbour], canRevisitSmall);
        } else if (neighbour !== 'start' && neighbour !== 'end' && canRevisitSmall) {
            neighbourPathCount += countPaths(neighbour, end, nodes, [...visited, neighbour], false);
        }
    });
    return neighbourPathCount;
}

const partOne = (input) => {
    const map = parseInput(input);
    return countPaths('start', 'end', map, ['start'], false);
}

const partTwo = (input) => {
    const map = parseInput(input);
    return countPaths('start', 'end', map, ['start'], true);
}

// console.log(partOne(smallInput));
// console.log(partTwo(smallInput));

console.log(partOne(input));
console.log(partTwo(input));

