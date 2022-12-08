const fs = require('fs');
const assert = require('assert');

const initTree = (height) => {
    return {
        height,
        visibleAngles: 0,
        scenicScore: 0,
    };
};

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((l) => l.split('').map((c) => initTree(parseInt(c))));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const calculateVisibility = (treeMap, treeX, treeY) => {
    const tree = treeMap[treeY][treeX];
    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
    ];
    tree.visibleAngles = directions.length;
    const viewingDistances = Array(directions.length).fill(0);
    directions.forEach((d, i) => {
        let currX = treeX + d.x;
        let currY = treeY + d.y;
        while (
            currX >= 0 &&
            currY >= 0 &&
            currX < treeMap[treeX].length &&
            currY < treeMap.length
        ) {
            viewingDistances[i]++;
            if (treeMap[currY][currX].height >= tree.height) {
                tree.visibleAngles--;
                break;
            }
            currX += d.x;
            currY += d.y;
        }
    });
    tree.scenicScore = viewingDistances.reduce((acc, dist) => acc * dist, 1);
    return tree;
};

const solve = (treeMap) => {
    let visible = 0;
    let highestScore = 0;
    for (let y = 0; y < treeMap.length; y++) {
        for (let x = 0; x < treeMap[y].length; x++) {
            const tree = calculateVisibility(treeMap, x, y);
            visible += tree.visibleAngles > 0 ? 1 : 0;
            if (tree.scenicScore > highestScore) {
                highestScore = tree.scenicScore;
            }
        }
    }
    return {
        visible,
        highestScore,
    };
};

assert.deepEqual(solve(inputSmall), { visible: 21, highestScore: 8 });
console.log(solve(input));
