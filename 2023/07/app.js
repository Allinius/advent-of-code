const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const parts = line.split(' ');
            return {
                cards: parts[0].split('').map((c) => {
                    switch (c) {
                        case 'T':
                            return 10;
                        case 'J':
                            return 11;
                        case 'Q':
                            return 12;
                        case 'K':
                            return 13;
                        case 'A':
                            return 14;
                        default:
                            return Number.parseInt(c);
                    }
                }),
                bid: Number.parseInt(parts[1]),
            };
        });
};

const partBoth = (hands, hasJokers = false) => {
    const sorted = hands
        .map((h) => ({ ...h, score: getHandPoints(h, hasJokers) }))
        .sort((a, b) => {
            if (a.score - b.score === 0) {
                return 0;
            }
            return a.score - b.score;
        });
    return sorted.reduce((score, hand, i) => score + (i + 1) * hand.bid, 0);
};

getHandPoints = (hand, hasJokers = false) => {
    const base = 15;
    const cardScore = hand.cards.reduce(
        (score, card, i) =>
            score +
            Math.pow(base, 5 - i - 1) * (hasJokers && card === 11 ? 1 : card),
        0
    );
    const result = [...hand.cards]
        .sort((a, b) => b - a)
        .reduce((res, card, i) => {
            if (!res[card]) {
                res[card] = 1;
            } else {
                res[card]++;
            }
            return res;
        }, {});

    const cardCounts = Object.entries(result)
        .map((e) => ({
            card: Number.parseInt(e[0]),
            count: e[1],
        }))
        .sort((a, b) => b.count - a.count);

    const jokerCount = cardCounts.find((c) => c.card === 11);
    if (hasJokers && jokerCount && cardCounts.length > 1) {
        const boostIndex = cardCounts[0].card === 11 ? 1 : 0;
        const count = jokerCount.count;
        jokerCount.count = 0;
        cardCounts[boostIndex].count += count;
    }
    return (
        cardScore +
        Math.pow(base, 5) *
            cardCounts.reduce(
                (score, card) => score + [0, 0, 1, 3, 5, 6][card.count],
                0
            )
    );
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

assert.equal(partBoth(inputSmall), 6440);
console.log(partBoth(input));
assert.equal(partBoth(inputSmall, true), 5905);
console.log(partBoth(input, true));
