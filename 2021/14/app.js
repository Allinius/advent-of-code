const fs = require('fs');

const parseInput = (fileName) => {
    const input = fs.readFileSync(fileName, 'utf-8').replace(/\r/g, "").split('\n\n');
    const polymer = input[0];
    const rules = input[1].split('\n').reduce((acc, line) => {
        const parts = line.split(' -> ');
        acc.set(parts[0], parts[1]);
        return acc;
    }, new Map());
    return { polymer, rules };
}

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const addCountToMap = (countMap, key) => {
    if(countMap.has(key)) {
        countMap.set(key, countMap.get(key) + 1);
    } else {
        countMap.set(key, 1);
    }
}

const executeStep = (rules, pairCountMap, countMap) => {
    const newMap = new Map(pairCountMap);
    pairCountMap.forEach((value, key) => {
        if (rules.has(key)) {
            // update pairCountMap
            const products = [
                key[0] + rules.get(key),
                rules.get(key) + key[1]
            ];
            newMap.set(key, newMap.get(key) - value);
            products.forEach(p => {
                const prev = newMap.get(p) ? newMap.get(p) : 0;
                newMap.set(p, prev + value);
            });

            //update countMap
            const prev = countMap.get(rules.get(key)) ? countMap.get(rules.get(key)) : 0;
            countMap.set(rules.get(key), prev + value);
        }
    });
    return newMap;
}

const solve = (polymer, rules, steps) => {
    let pairCountMap = new Map();
    for (let i = 0; i < polymer.length - 1; i++) {
        const pair = polymer.substring(i, i + 2);
        addCountToMap(pairCountMap, pair);
    }
    let countMap = new Map();
    for (let i = 0; i < polymer.length; i++) {
        addCountToMap(countMap, polymer[i]);
    }
    for (let step = 0; step < steps; step++) {
        pairCountMap = executeStep(rules, pairCountMap, countMap);
    }
    let min;
    let max;
    countMap.forEach((value, key) => {
        if (!min) {
            min = value;
        }
        if (!max) {
            max = value;
        }
        if (value > max) {
            max = value;
        }
        if (value < min) {
            min = value;
        }
    });

    return max - min;
}

console.log(solve(input.polymer, input.rules, 10));
console.log(solve(input.polymer, input.rules, 40));
