const fs = require('fs');
const assert = require('assert');
const { sumFromTo } = require('../../common/number-utils');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('')
        .map(Number);
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const createDiskBlocks = (compacted) => {
    const diskBlocks = [];
    compacted.forEach((number, i) => {
        if (number === 0) {
            return;
        }
        if (i % 2 === 1) {
            diskBlocks.push({
                id: '.',
                count: number,
            });
            return;
        }
        diskBlocks.push({
            id: i / 2,
            count: number,
        });
    });
    return diskBlocks;
};

const getNextFree = (diskBlocks, from, minSize = 0) => {
    for (let i = from; i < diskBlocks.length; i++) {
        if (diskBlocks[i].id === '.' && diskBlocks[i].count >= minSize) {
            return i;
        }
    }
};

const checksum = (diskBlocks) => {
    let currBlockIndex = 0;
    return diskBlocks.reduce((sum, block, index) => {
        if (block.count === 0 || block.id === '.') {
            currBlockIndex += block.count;
            return sum;
        }
        const result =
            sum +
            block.id *
                sumFromTo(currBlockIndex, currBlockIndex + block.count - 1);
        currBlockIndex += block.count;
        return result;
    }, 0);
};

const partOne = (compacted) => {
    const diskBlocks = createDiskBlocks(compacted);
    let nextFreeIndex = getNextFree(diskBlocks, 0);

    while (nextFreeIndex != null) {
        while (diskBlocks[diskBlocks.length - 1].id === '.') {
            diskBlocks.splice(diskBlocks.length - 1);
        }
        const lastUsed = diskBlocks[diskBlocks.length - 1];
        while (
            nextFreeIndex != null &&
            lastUsed.count > 0 &&
            lastUsed.id !== '.'
        ) {
            if (lastUsed.count === diskBlocks[nextFreeIndex].count) {
                diskBlocks[nextFreeIndex] = { ...lastUsed };
                lastUsed.id = '.';
            } else if (lastUsed.count < diskBlocks[nextFreeIndex].count) {
                diskBlocks[nextFreeIndex].count -= lastUsed.count;
                diskBlocks.splice(nextFreeIndex, 0, { ...lastUsed });
                lastUsed.id = '.';
            } else {
                diskBlocks[nextFreeIndex].id = lastUsed.id;
                lastUsed.count -= diskBlocks[nextFreeIndex].count;
            }
            nextFreeIndex = getNextFree(diskBlocks, nextFreeIndex);
        }
    }

    return checksum(diskBlocks);
};

const partTwo = (compacted) => {
    const diskBlocks = createDiskBlocks(compacted);

    let currUsedId = diskBlocks[diskBlocks.length - 1].id;
    while (currUsedId > 0) {
        const currUsedIndex = diskBlocks.findIndex((b) => b.id === currUsedId);
        const currUsed = diskBlocks[currUsedIndex];
        const validFreeIndex = getNextFree(diskBlocks, 0, currUsed.count);
        if (validFreeIndex == null || validFreeIndex > currUsedIndex) {
            currUsedId--;
            continue;
        }
        const validFree = diskBlocks[validFreeIndex];
        if (validFree.count === currUsed.count) {
            diskBlocks[validFreeIndex] = { ...currUsed };
            currUsed.id = '.';
        } else {
            diskBlocks.splice(validFreeIndex, 0, { ...currUsed });
            validFree.count -= currUsed.count;
            currUsed.id = '.';
        }
        currUsedId--;
    }

    return checksum(diskBlocks);
};

assert.equal(partOne(inputSmall), 1928);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 2858);
console.log(partTwo(input));
