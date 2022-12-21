const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const resolved = [];
    const toResolve = [];
    fs.readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .forEach((line) => {
            const parts = line.split(': ');
            const name = parts[0];
            const valueParts = parts[1].split(' ');
            if (valueParts.length === 1) {
                resolved.push({
                    name,
                    value: parseInt(valueParts[0]),
                });
                return;
            }
            toResolve.push({
                name,
                operator: valueParts[1],
                first: valueParts[0],
                second: valueParts[2],
            });
        });
    return {
        resolved,
        toResolve,
    };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const getValues = (monkey, resolved, partTwo) => {
    const firstFound = resolved.find((r) => r.name === monkey.first);
    const secondFound = resolved.find((r) => r.name === monkey.second);
    let first;
    let second;

    first =
        typeof monkey.first === 'number' ||
        (typeof monkey.first === 'object' && monkey.first.resolved) ||
        (partTwo && monkey.first === 'humn')
            ? monkey.first
            : firstFound != null
            ? firstFound.value
            : null;
    second =
        typeof monkey.second === 'number' ||
        (typeof monkey.second === 'object' && monkey.second.resolved) ||
        (partTwo && monkey.second === 'humn')
            ? monkey.second
            : secondFound != null
            ? secondFound.value
            : null;
    return { first, second };
};

const getResult = (first, second, operator) => {
    if (first == null || second == null || operator == null) {
        return null;
    }
    if (
        first === 'humn' ||
        second === 'humn' ||
        typeof first === 'object' ||
        typeof second === 'object'
    ) {
        return {
            resolved: true,
            operator,
            first,
            second,
        };
    }
    let res;
    switch (operator) {
        case '+':
            res = first + second;
            break;
        case '-':
            res = first - second;
            break;
        case '*':
            res = first * second;
            break;
        case '/':
            res = first / second;
            break;
    }
    return res;
};

const solve = (monkeys, partTwo = false) => {
    let resolved = monkeys.resolved;
    let toResolve = monkeys.toResolve;
    while (resolved.length > 0 && toResolve.length > 0) {
        const newResolved = [];
        const newToResolve = [];
        toResolve.forEach((m) => {
            const { first, second } = getValues(m, resolved, partTwo);
            const res = getResult(
                first,
                second,
                partTwo && m.name === 'root' ? '===' : m.operator
            );

            if (res != null) {
                newResolved.push({
                    name: m.name,
                    value: res,
                });
                return;
            }
            newToResolve.push({
                name: m.name,
                operator: m.operator,
                first: first != null ? first : m.first,
                second: second != null ? second : m.second,
            });
        });
        resolved = newResolved;
        toResolve = newToResolve;
    }

    return resolved.length === 1 ? resolved[0].value : null;
};

const partTwo = (monkeys) => {
    const equation = solve(monkeys, true);
    let res =
        typeof equation.first === 'number' ? equation.first : equation.second;
    let curr =
        typeof equation.first === 'number' ? equation.second : equation.first;

    while (curr !== 'humn') {
        switch (curr.operator) {
            case '+':
                if (typeof curr.first === 'number') {
                    res -= curr.first;
                    curr = curr.second;
                } else {
                    res -= curr.second;
                    curr = curr.first;
                }
                break;
            case '-':
                if (typeof curr.first === 'number') {
                    res = -res + curr.first;
                    curr = curr.second;
                } else {
                    res += curr.second;
                    curr = curr.first;
                }
                break;
            case '*':
                if (typeof curr.first === 'number') {
                    res /= curr.first;
                    curr = curr.second;
                } else {
                    res /= curr.second;
                    curr = curr.first;
                }
                break;
            case '/':
                if (typeof curr.first === 'number') {
                    res = curr.first / res;
                    curr = curr.second;
                } else {
                    res *= curr.second;
                    curr = curr.first;
                }
                break;
        }
    }
    return res;
};

assert.equal(solve(inputSmall), 152);
console.log(solve(input));
assert.equal(partTwo(inputSmall), 301);
console.log(partTwo(input));
