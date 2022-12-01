const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
  return fs
    .readFileSync(fileName, 'utf-8')
    .replace(/\r/g, '')
    .split('\n\n')
    .map((cluster) => cluster.split('\n').map((s) => parseInt(s)));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (elves) => {
  return Math.max(...elves.map((e) => e.reduce((sum, cal) => sum + cal)));
};

const partTwo = (elves) => {
  const elfTotals = elves.map((e) => e.reduce((sum, cal) => sum + cal));
  return elfTotals
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((sum, cal) => sum + cal);
};

assert.equal(partOne(inputSmall), 24000);
console.log(partOne(input));

assert.equal(partTwo(inputSmall), 45000);
console.log(partTwo(input));
