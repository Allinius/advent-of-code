const fs = require('fs');
const assert = require('assert');

const addDir = (targetDir, dirName) => {
    if (!targetDir.dirs[dirName]) {
        targetDir.dirs[dirName] = {
            parent: targetDir,
            dirs: {},
            files: [],
        };
    }
};

const parseInput = (fileName) => {
    const log = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .slice(1);

    const rootDir = {
        parent: null,
        dirs: {},
        files: [],
    };
    let currDir = rootDir;
    log.forEach((line) => {
        parts = line.split(' ');
        if (parts[1] === 'ls') {
            return;
        }
        if (parts[1] === 'cd') {
            if (parts[2] === '..') {
                currDir = currDir.parent;
                return;
            }
            addDir(currDir, parts[2]);
            currDir = currDir.dirs[parts[2]];
            return;
        }
        if (parts[0] === 'dir') {
            addDir(currDir, parts[1]);
            return;
        }
        currDir.files.push({
            name: parts[1],
            size: parseInt(parts[0]),
        });
    });
    return rootDir;
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const calculateDirSize = (currDir, flatDirs = []) => {
    currDir.size = currDir.files.reduce((acc, file) => acc + file.size, 0);
    currDir.size += Object.keys(currDir.dirs).reduce((acc, dir) => {
        return acc + calculateDirSize(currDir.dirs[dir], flatDirs);
    }, 0);
    flatDirs.push(currDir);
    return currDir.size;
};

const partOne = (rootDir) => {
    const result = [];
    calculateDirSize(rootDir, result);
    const sum = result
        .filter((d) => d.size < 100000)
        .reduce((acc, dir) => acc + dir.size, 0);
    return sum;
};

const partTwo = (rootDir) => {
    const available = 70000000;
    const neededFree = 30000000;
    const result = [];
    const totalUsed = calculateDirSize(rootDir, result);
    const unused = available - totalUsed;

    result.sort((a, b) => a.size - b.size);
    return result.find((d) => d.size + unused >= neededFree).size;
};

assert.equal(partOne(inputSmall), 95437);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 24933642);
console.log(partTwo(input));
