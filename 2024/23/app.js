const fs = require('fs');
const assert = require('assert');
const { combinate } = require('../../common/array-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split('-'));
};

const inputSmall = parseInput('input-small.txt');

const createGraph = (connections) => {
    const graph = {};
    connections.forEach(([first, second]) => {
        let firstNode = graph[first] ?? {
            id: first,
            neighbors: [],
        };
        let secondNode = graph[second] ?? {
            id: second,
            neighbors: [],
        };
        firstNode.neighbors.push(secondNode.id);
        secondNode.neighbors.push(firstNode.id);
        graph[first] = firstNode;
        graph[second] = secondNode;
    });
    return graph;
};

const partOne = (connections) => {
    const graph = createGraph(connections);
    const cliques = new Set();
    const visited = new Set();
    Object.keys(graph).forEach((firstId) => {
        visited.add(firstId);
        const first = graph[firstId];
        if (first.neighbors.length < 2) {
            return;
        }
        first.neighbors.forEach((secondId) => {
            const second = graph[secondId];
            if (second.neighbors.length < 2 || visited.has(secondId)) {
                return;
            }
            second.neighbors.forEach((thirdId) => {
                const third = graph[thirdId];
                if (
                    third.neighbors.length < 2 ||
                    visited.has(third) ||
                    third === second
                ) {
                    return;
                }
                if (third.neighbors.indexOf(firstId) >= 0) {
                    cliques.add([firstId, secondId, thirdId].sort().toString());
                }
            });
        });
    });
    return Array.from(cliques).filter((clique) =>
        clique.split(',').some((id) => id.startsWith('t'))
    ).length;
};

const partTwo = (connections) => {
    const graph = createGraph(connections);
    const maxSize = graph[Object.keys(graph)[0]].neighbors.length;

    for (let size = maxSize; size > 1; size--) {
        const cliques = new Set();

        Object.keys(graph).forEach((firstId) => {
            const combinations = combinate(graph[firstId].neighbors, size);
            const cliqueCombinations = combinations.filter((combination) => {
                const groupId = [...combination, firstId].sort().toString();
                return combination.every((id) => {
                    neighCombinations = combinate(graph[id].neighbors, size);
                    return neighCombinations.some((neighCombination) => {
                        const neighGroupId = [...neighCombination, id]
                            .sort()
                            .toString();
                        return groupId === neighGroupId;
                    });
                });
            });
            cliqueCombinations.forEach((cliqueCombination) => {
                cliques.add([...cliqueCombination, firstId].sort().toString());
            });
        });
        if (cliques.size > 0) {
            return Array.from(cliques)[0];
        }
    }
};

assert.equal(partOne(inputSmall), 7);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 'co,de,ka,ta');
console.log(partTwo(input));
