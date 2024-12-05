const fs = require('fs');
const assert = require('assert');
const vec2d = require('../../common/vec2d');

const parseInput = (fileName) => {
    const [rulesPart, ordersPart] = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');

    return {
        rules: rulesPart.split('\n').map((line) => line.split('|').map(Number)),
        orders: ordersPart
            .split('\n')
            .map((line) => line.split(',').map(Number)),
    };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const isCorrect = (order, rules, tryFix = false) => {
    return order.every((pageA, index) =>
        rules
            .filter((rule) => rule[0] === pageA)
            .every((rule) => {
                const secondIndex = order.indexOf(rule[1]);
                if (secondIndex === -1 || secondIndex > index) {
                    return true;
                }
                if (tryFix) {
                    order.splice(index, 0, order.splice(secondIndex, 1)[0]);
                }
                return false;
            })
    );
};

const partOne = (input) => {
    return input.orders.reduce((sum, order) => {
        return (
            sum +
            (isCorrect(order, input.rules) ? order[(order.length - 1) / 2] : 0)
        );
    }, 0);
};

const partTwo = (input) => {
    return input.orders
        .filter((order) => !isCorrect(order, input.rules))
        .reduce((sum, order) => {
            while (!isCorrect(order, input.rules, true)) {
                // maybe next time :)
            }
            return sum + order[(order.length - 1) / 2];
        }, 0);
};

assert.equal(partOne(inputSmall), 143);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 123);
console.log(partTwo(input));
