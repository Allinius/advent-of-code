const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n')
        .map((block) => {
            const parts = block.split('\n');
            const operationParts = parts[2].split(' ').slice(6);
            return {
                startItems: parts[1]
                    .split(' ')
                    .slice(4)
                    .map((c) => parseInt(c)),
                operation: {
                    operator: operationParts[0],
                    value:
                        operationParts[1] !== 'old'
                            ? parseInt(operationParts[1])
                            : operationParts[1],
                },
                test: {
                    div: parseInt(parts[3].split(' ')[5]),
                    true: parseInt(parts[4].split(' ')[9]),
                    false: parseInt(parts[5].split(' ')[9]),
                },
                inspected: 0,
            };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const calculateValue = (old, operation) => {
    const value = operation.value === 'old' ? old : operation.value;
    return operation.operator === '*' ? old * value : old + value;
};

const monkeyTurn = (monkeys, i, decreaseWorry, commonDiv) => {
    const monkey = monkeys[i];
    monkey.items.forEach((item) => {
        // inspect item
        monkey.inspected++;
        let itemWorry = item;
        // increase worry
        itemWorry = calculateValue(itemWorry, monkey.operation);
        // decrease worry
        if (decreaseWorry) {
            itemWorry = Math.floor(itemWorry / 3);
        }
        // test worry
        const remainder = itemWorry % monkey.test.div;
        const targetIndex =
            remainder === 0 ? monkey.test.true : monkey.test.false;

        monkeys[targetIndex].items.push(itemWorry % commonDiv);
    });
    monkey.items = [];
};

const simulateMonkeys = (monkeys, rounds = 20, decreaseWorry = true) => {
    const cloneMonkeys = monkeys.map((m) => ({
        ...m,
        inspected: 0,
        items: [...m.startItems],
    }));
    const commonDiv = monkeys.reduce((acc, monkey) => acc * monkey.test.div, 1);
    for (let round = 0; round < rounds; round++) {
        cloneMonkeys.forEach((monkey, i) => {
            monkeyTurn(cloneMonkeys, i, decreaseWorry, commonDiv);
        });
    }
    return cloneMonkeys
        .sort((a, b) => b.inspected - a.inspected)
        .slice(0, 2)
        .reduce((acc, m) => acc * m.inspected, 1);
};

assert.equal(simulateMonkeys(inputSmall), 10605);
console.log(simulateMonkeys(input));
assert.equal(simulateMonkeys(inputSmall, 20, false), 10197);
assert.equal(simulateMonkeys(inputSmall, 1000, false), 27019168);
console.log(simulateMonkeys(input, 10000, false));
