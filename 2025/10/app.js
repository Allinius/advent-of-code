const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const parts = line.split(' ');
            const targetLights = parts[0].replace(/(\[|\])/g, '');
            const targetJoltages = parts[parts.length - 1]
                .replace(/(\{|\})/g, '')
                .split(',')
                .map(Number);
            const buttons = parts.slice(1, parts.length - 1).map((part) =>
                part
                    .replace(/(\(|\))/g, '')
                    .split(',')
                    .map(Number)
            );
            return {
                targetLights,
                buttons,
                targetJoltages,
            };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (machines) => {
    return machines.reduce(
        (sum, machine) => sum + findFewestLightPresses(machine),
        0
    );
};

const findFewestLightPresses = (machine) => {
    const open = machine.buttons.map((button, index) => ({
        presses: 1,
        lights: switchLights(
            Array(machine.targetLights.length).fill('.'),
            button
        ),
        buttonsPressed: `${index}`,
    }));
    const cache = {};
    while (open.length > 0) {
        const state = open.shift();
        if (state.lights.join('') === machine.targetLights) {
            return state.presses;
        }
        const newStates = machine.buttons
            .map((button, index) => ({
                presses: state.presses + 1,
                lights: switchLights(state.lights, button),
                buttonsPressed: `${state.buttonsPressed},${index}`,
            }))
            .filter((newState) => {
                const newLights = newState.lights.join('');
                if (cache[newLights] && cache[newLights] <= newState.presses) {
                    return false;
                }
                cache[newLights] = newState.presses;
                return true;
            });
        open.push(...newStates);
    }
    return 0;
};

const switchLights = (lights, button) => {
    const lightsCopy = [...lights];
    button.forEach((index) => {
        lightsCopy[index] = lightsCopy[index] === '#' ? '.' : '#';
    });
    return lightsCopy;
};

const partTwo = async (machines) => {
    let sum = 0;
    for (let machine of machines) {
        const result = await solveMachine(machine);
        // console.log(result);
        sum += result;
    }
    return sum;
};

const solveMachine = async (machine) => {
    const { init } = require('z3-solver');
    const { Context } = await init();
    const ctx = new Context('main');
    const { Optimize, Int } = ctx;

    const opt = new Optimize();

    const variables = machine.buttons.map((_, i) => Int.const(`x${i}`));

    // each press count >= 0
    opt.add(...variables.map((v) => v.ge(0)));

    machine.targetJoltages.forEach((target, j) => {
        const affecting = machine.buttons
            .map((btn, i) => (btn.includes(j) ? variables[i] : null))
            .filter(Boolean);

        const sum = affecting.reduce((acc, affVar) => acc.add(affVar));

        opt.add(sum.eq(target));
    });

    const total = variables.reduce((acc, v) => acc.add(v));
    opt.minimize(total);

    const result = await opt.check();
    if (result !== 'sat') return null;

    const model = opt.model();
    return variables
        .map((v) => Number(model.get(v).value()))
        .reduce((sum, presses) => sum + presses);
};

assert.equal(partOne(inputSmall), 7);
console.log(partOne(input));
partTwo(inputSmall).then((res) => {
    assert.equal(res, 33);
});
partTwo(input).then((res) => {
    console.log(res);
});
