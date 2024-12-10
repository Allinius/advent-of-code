const fs = require('fs');
const assert = require('assert');
const array2d = require('../../common/array-2d-util');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line, y) =>
            line.split('').map((c, x) => ({
                height: Number(c),
                x,
                y,
            }))
        );
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (map) => {
    const trailheads = [];
    map.forEach((line) => {
        line.forEach((el) => {
            if (el.height === 0) {
                trailheads.push(el);
            }
        });
    });

    return trailheads.reduce((sum, trailhead) => {
        const opened = [trailhead];
        const visited = new Set();
        let score = 0;
        while (opened.length > 0) {
            const currNode = opened.pop();
            visited.add(currNode);
            if (currNode.height === 9) {
                score++;
                continue;
            }
            opened.push(
                ...array2d
                    .getSurrounding(map, currNode.x, currNode.y)
                    ?.map((res) => res.value)
                    .filter(
                        (node) =>
                            node.height === currNode.height + 1 &&
                            !visited.has(node)
                    )
            );
        }
        return sum + score;
    }, 0);
};

const partTwo = (map) => {
    const trailheads = [];
    map.forEach((line) => {
        line.forEach((el) => {
            if (el.height === 0) {
                trailheads.push(el);
            }
        });
    });

    return trailheads.reduce((sum, trailhead) => {
        const opened = [trailhead];
        let score = 0;
        while (opened.length > 0) {
            const currNode = opened.pop();
            if (currNode.height === 9) {
                score++;
                continue;
            }
            const destinations = array2d
                .getSurrounding(map, currNode.x, currNode.y)
                ?.map((res) => res.value)
                .filter((node) => node.height === currNode.height + 1);
            opened.push(...destinations);
        }
        return sum + score;
    }, 0);
};

assert.equal(partOne(inputSmall), 36);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 81);
console.log(partTwo(input));
