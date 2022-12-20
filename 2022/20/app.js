const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => parseInt(line));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const moveItem = (array, index) => {
    const item = array.splice(index, 1)[0];
    const newIndex = (index + item.value) % array.length;
    array.splice(newIndex, 0, item);
};

const partOne = (input, count = 1) => {
    const items = input.map((n) => ({ value: n }));
    const order = [...items];
    for (let cycle = 0; cycle < count; cycle++) {
        order.forEach((ordIt) => {
            const index = items.findIndex((i) => i === ordIt);
            moveItem(items, index);
        });
    }
    const anchor = items.findIndex((i) => i.value === 0);
    const increments = [1000, 2000, 3000];
    return increments.reduce(
        (acc, inc) => acc + items[(anchor + inc) % items.length].value,
        0
    );
};

const partTwo = (input) => {
    const key = 811589153;
    const mappedInput = input.map((i) => i * key);
    return partOne(mappedInput, 10);
};

assert.equal(partOne(inputSmall), 3);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 1623178306);
console.log(partTwo(input));
