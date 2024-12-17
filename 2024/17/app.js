const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const [registersPart, programPart] = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');
    const registers = registersPart
        .split('\n')
        .map((line) => Number(line.match(/\d+/)?.[0]));
    const program = programPart.match(/\d+/g).map(Number);
    return { registers, program };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const getComboValue = (comboOperand, registers) => {
    switch (comboOperand) {
        case 1:
        case 2:
        case 3:
            return comboOperand;
        case 4:
        case 5:
        case 6:
            return registers[comboOperand - 4];
        default:
            console.log('unsupported combo operand code');
    }
};

const executeInstruction = (instructionIndex, program, registers) => {
    let nextInstruction = instructionIndex + 2;
    let output;
    let numerator, denominator;
    switch (program[instructionIndex]) {
        case 0:
            // adv
            numerator = registers[0];
            denominator = Math.pow(
                2,
                getComboValue(program[instructionIndex + 1], registers)
            );
            registers[0] = Math.floor(numerator / denominator);
            break;
        case 1:
            // bxl
            registers[1] = registers[1] ^ program[instructionIndex + 1];
            break;
        case 2:
            // bst
            registers[1] =
                getComboValue(program[instructionIndex + 1], registers) % 8;
            break;
        case 3:
            // jnz
            if (registers[0] !== 0) {
                nextInstruction = program[instructionIndex + 1];
            }
            break;
        case 4:
            // bxc
            registers[1] = (registers[1] ^ registers[2]) >>> 0;
            break;
        case 5:
            // out
            output =
                getComboValue(program[instructionIndex + 1], registers) % 8;
            break;
        case 6:
            // bdv
            numerator = registers[0];
            denominator = Math.pow(
                2,
                getComboValue(program[instructionIndex + 1], registers)
            );
            registers[1] = Math.floor(numerator / denominator);
        case 7:
            // cdv
            numerator = registers[0];
            denominator = Math.pow(
                2,
                getComboValue(program[instructionIndex + 1], registers)
            );
            registers[2] = Math.floor(numerator / denominator);
    }
    return { nextInstruction, output };
};

const partOne = (input) => {
    const registers = JSON.parse(JSON.stringify(input.registers));
    let instructionIndex = 0;
    const outputs = [];

    while (instructionIndex < input.program.length) {
        const { nextInstruction, output } = executeInstruction(
            instructionIndex,
            input.program,
            registers
        );
        instructionIndex = nextInstruction;
        if (output != null) {
            outputs.push(output);
        }
    }
    return outputs.join(',');
};

const partTwoBF = (input) => {
    let result;
    let regAValue = 15560637;
    // let regAValue = 0;
    let lastOutput = 0;
    let longestMatchingDigits = 0;
    // let increment = 1;
    let increment = 8388352 + 256;
    while (result == null) {
        const registers = [regAValue, 0, 0];
        let instructionIndex = 0;
        const outputs = [];
        while (instructionIndex < input.program.length) {
            const { nextInstruction, output } = executeInstruction(
                instructionIndex,
                input.program,
                registers
            );
            instructionIndex = nextInstruction;
            if (output != null) {
                outputs.push(output);
                if (
                    outputs[outputs.length - 1] !==
                    input.program[outputs.length - 1]
                ) {
                    break;
                }
            }
        }
        let matchingDigits = 0;
        for (let d = 0; d < outputs.length; d++) {
            if (outputs[d] === input.program[d]) {
                matchingDigits++;
            } else {
                break;
            }
        }
        if (matchingDigits > longestMatchingDigits) {
            console.log(
                `regAValue: ${regAValue}, diff: ${
                    regAValue - lastOutput
                } diff / incr: ${
                    (regAValue - lastOutput) / increment
                } matching digits: ${matchingDigits}`
            );
            console.log(outputs.toString());
            lastOutput = regAValue;
            longestMatchingDigits = matchingDigits;
            if (matchingDigits === input.program.length) {
                result = regAValue;
                break;
            }
        }
        regAValue += increment; // 536870912 / 8388608
    }

    console.log(parseInt(result - 256).toString(2));
    return result - 256;
};

const partTwoSolve = () => {
    const program = [2, 4, 1, 1, 7, 5, 1, 5, 4, 0, 0, 3, 5, 5, 3, 0];
    // let registers = ['001', '010', '011', '100', '101', '110', '111'];
    let registers = ['100'];

    for (let i = program.length - 2; i >= 0; i--) {
        let newRegisters = [];
        registers.forEach((registerStart, regI) => {
            possibles = [
                '000',
                '001',
                '010',
                '011',
                '100',
                '101',
                '110',
                '111',
            ];
            possibles.forEach((tribit) => {
                const registerA = registerStart + tribit;
                let paddedRegA = registerA.padStart(8, '0');

                const a = parseInt(paddedRegA, 2);
                const a3x1 = parseInt(paddedRegA.slice(-3), 2) ^ 1;
                const c = Math.floor(a / Math.pow(2, a3x1));
                const b = (a3x1 ^ 5 ^ c) >>> 0;
                if (b % 8 === program[i]) {
                    newRegisters.push(registerA);
                }
            });
        });
        registers = newRegisters;
    }
    return Math.min(...registers.map((regBinary) => parseInt(regBinary, 2)));
};

assert.equal(partOne(inputSmall), '4,6,3,5,6,3,5,2,1,0');
console.log(partOne(input));
// console.log(partTwoBF(input));
console.log(partTwoSolve());
