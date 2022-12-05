const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const [stackInput, instructionInput] = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n')
        .map((i) => i.split('\n'));

    const indexes = stackInput.pop();
    const stacks = [];
    stackInput.reverse().forEach((line) => {
        for (let i = 1; i < line.length; i += 4) {
            const index = parseInt(indexes[i]) - 1;
            if (stacks[index] == null) {
                stacks[index] = [];
            }
            if (line[i] !== ' ') {
                stacks[index].push(line[i]);
            }
        }
    });

    const instructions = instructionInput.map((line) => {
        const parts = line
            .replace(/move (.+?) from (.+?) to (.+?)/, '$1,$2,$3')
            .split(',')
            .map((s) => parseInt(s));
        return {
            count: parts[0],
            from: parts[1] - 1,
            to: parts[2] - 1,
        };
    });
    return { stacks, instructions };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const moveCrates = (input, reverse = true) => {
    const stacks = JSON.parse(JSON.stringify(input.stacks));
    const instructions = input.instructions;
    instructions.forEach((instruction) => {
        const stack = stacks[instruction.from];
        const moveArray = stack.splice(
            stack.length - instruction.count,
            instruction.count
        );

        stacks[instruction.to].push(
            ...(reverse ? moveArray.reverse() : moveArray)
        );
    });
    return stacks.map((s) => s[s.length - 1]).join('');
};

assert.equal(moveCrates(inputSmall), 'CMZ');
console.log(moveCrates(input));
assert.equal(moveCrates(inputSmall, false), 'MCD');
console.log(moveCrates(input, false));
