const fs = require('fs');
const assert = require('assert');
const drawImage = require('../../common/image-utils').drawImage;

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((l) => {
            const parts = l.split(' ');
            return {
                type: parts[0],
                value: parts.length > 1 ? parseInt(l.split(' ')[1]) : null,
            };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const drawCRT = (canvas) => {
    const image = [];
    let line = [];
    for (let row = 0; row < canvas.length / 40; row++) {
        const rowIndex = 40 * row;
        image.push(canvas.slice(rowIndex, rowIndex + 40));
    }
    console.log(image.map((l) => l.join('')).join('\n'));
    drawImage(image, 8);
};

const handleInstruction = (instructions, cycle) => {
    const instruction = instructions.shift();
    if (instruction.type === 'addx') {
        return {
            cycleFinished: cycle + 2,
            value: instruction.value,
        };
    }
    return null;
};

const execute = (inputInstructions, shouldDraw = false) => {
    const instructions = [...inputInstructions];
    let register = 1;
    let cycle = 0;
    let scheduledTask;
    const strengths = [];
    const canvas = [];

    while (instructions.length > 0 || scheduledTask) {
        if (scheduledTask && scheduledTask.cycleFinished === cycle) {
            register += scheduledTask.value;
            scheduledTask = null;
        }
        if (instructions.length > 0 && !scheduledTask) {
            scheduledTask = handleInstruction(instructions, cycle);
        }
        if (Math.abs((cycle % 40) - register) <= 1) {
            canvas.push('#');
        } else {
            canvas.push('.');
        }
        cycle++;
        if ((cycle - 20) % 40 === 0) {
            strengths.push(cycle * register);
        }
    }

    if (shouldDraw) {
        drawCRT(canvas);
    }
    return strengths.reduce((acc, s) => acc + s, 0);
};

assert.equal(execute(inputSmall), 13140);
console.log(execute(input, true));
