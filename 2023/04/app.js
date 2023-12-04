const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const parts = line.replace(/\s+/g, ' ').split(':');
            const numbers = parts[1].split(' | ').map((numString) =>
                numString
                    .trim()
                    .split(' ')
                    .map((n) => Number.parseInt(n))
            );
            return {
                id: Number.parseInt(parts[0].split(' ')[1]),
                winning: numbers[0],
                mine: numbers[1],
            };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (cards) => {
    return cards.reduce((sum, card) => {
        const count = card.mine.filter(
            (n) => card.winning.indexOf(n) >= 0
        ).length;
        return count === 0 ? sum : sum + Math.pow(2, count - 1);
    }, 0);
};

const partTwo = (cards) => {
    cards.forEach((card) => {
        card.matches = card.mine.filter(
            (n) => card.winning.indexOf(n) >= 0
        ).length;
        card.count = 1;
    });
    cards.forEach((card, index) => {
        expand(cards, index);
    });
    return cards.reduce((sum, card) => sum + card.count, 0);
};

const expand = (cards, index) => {
    for (let i = 1; i <= cards[index].matches; i++) {
        cards[index + i].count++;
        expand(cards, index + i);
    }
};

assert.equal(partOne(inputSmall), 13);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 30);
console.log(partTwo(input));
