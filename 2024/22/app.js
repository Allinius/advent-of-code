const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map(Number);
};

const inputSmall = parseInput('input-small.txt');
const inputSmall2 = parseInput('input-small2.txt');
const input = parseInput('input.txt');

const mixPrune = (secret, number) => {
    return (secret ^ number) & 0xffffff;
};

const calculateNext = (number) => {
    number = mixPrune(number, number << 6);
    number = mixPrune(number, number >> 5);
    number = mixPrune(number, number << 11);
    return number;
};

const partOne = (initialNumbers) => {
    return initialNumbers.reduce((sum, initial) => {
        let secret = initial;
        for (let i = 0; i < 2000; i++) {
            secret = calculateNext(secret);
        }
        return sum + secret;
    }, 0);
};

const partTwo = (initialNumbers) => {
    const sequenceMap = new Map();
    initialNumbers.forEach((initial, sellerId) => {
        let secret = initial;
        let lastFive = [initial % 10];
        for (let i = 0; i < 2000; i++) {
            secret = calculateNext(secret);
            const lastDigit = secret % 10;
            if (lastFive.length > 4) {
                lastFive = lastFive.slice(1);
            }
            lastFive.push(lastDigit);
            if (i > 2) {
                const diffs = lastFive
                    .slice(1)
                    .map((digit, index) => digit - lastFive[index]);
                if (!sequenceMap.get(diffs.toString())) {
                    sequenceMap.set(diffs.toString(), new Map());
                }
                const sellerMap = sequenceMap.get(diffs.toString());
                if (!sellerMap.has(sellerId)) {
                    sellerMap.set(sellerId, lastDigit);
                }
            }
        }
    });
    return Array.from(sequenceMap)
        .map(([sequence, sellerMap]) => [
            sequence,
            Array.from(sellerMap).reduce(
                (sum, [sellerId, price]) => sum + price,
                0
            ),
        ])
        .sort((a, b) => b[1] - a[1])[0];
};

assert.equal(partOne(inputSmall), 37327623);
console.log(partOne(input));
assert.equal(partTwo(inputSmall2)[1], 23);
console.log(partTwo(input));
