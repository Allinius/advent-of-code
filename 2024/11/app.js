const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs.readFileSync(fileName, 'utf-8').replace(/\r/g, '').split(' ');
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const countStones = (stones, targetBlinks = 25) => {
    let numberMap = new Map();
    stones.forEach((stone) => {
        numberMap.set(stone, (numberMap.get(stone) ?? 0) + 1);
    });

    for (let blink = 0; blink < targetBlinks; blink++) {
        const newMap = new Map();
        numberMap.forEach((count, stone) => {
            if (stone === '0') {
                newMap.set('1', (newMap.get('1') ?? 0) + count);
                return;
            }
            if (stone.length % 2 === 0) {
                const stoneA = `${Number(stone.slice(0, stone.length / 2))}`;
                const stoneB = `${Number(stone.slice(stone.length / 2))}`;
                newMap.set(stoneA, (newMap.get(stoneA) ?? 0) + count);
                newMap.set(stoneB, (newMap.get(stoneB) ?? 0) + count);
                return;
            }
            const newStone = `${Number(stone) * 2024}`;
            newMap.set(newStone, (newMap.get(newStone) ?? 0) + count);
        });
        numberMap = newMap;
    }

    return Array.from(numberMap).reduce((acc, [key, count]) => acc + count, 0);
};

assert.equal(countStones(inputSmall), 55312);
console.log(countStones(input));
console.log(countStones(input, 75));
