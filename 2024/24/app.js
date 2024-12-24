const fs = require('fs');
const assert = require('assert');
const arrayUtil = require('../../common/array-utils');

const parseInput = (fileName) => {
    const [wiresPart, gatesPart] = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');

    const wires = {};
    wiresPart.split('\n').forEach((wireLine) => {
        const [name, value] = wireLine.split(': ');
        wires[name] = { result: Number(value) };
    });

    const gateIds = [];
    gatesPart.split('\n').forEach((gateLine) => {
        const [firstPart, output] = gateLine.split(' -> ');
        const [first, operator, second] = firstPart.split(' ');
        wires[output] = {
            inputWires: [first, second].sort(),
            operator,
        };
        gateIds.push(output);
    });
    return { wires, gateIds };
};

const inputSmall = parseInput('input-small.txt');
const inputSmall2 = parseInput('input-small2.txt');
const input = parseInput('input.txt');

const getWireValue = (id, wires) => {
    if (wires[id]?.result != null) {
        // if (!wires[id].expression) {
        //     wires[id].expression = id;
        // }
        return wires[id].result;
    }
    const [first, second] = wires[id].inputWires.map((inputWireId) =>
        getWireValue(inputWireId, wires)
    );
    switch (wires[id].operator) {
        case 'AND':
            wires[id].result = first & second;
            // wires[id].expression = `(${wires[id].inputWires[0]}) AND (${wires[id].inputWires[1]})`;
            // wires[id].expression = `(${
            //     wires[wires[id].inputWires[0]].expression
            // }) AND (${wires[wires[id].inputWires[1]].expression})`;
            return wires[id].result;
        case 'OR':
            wires[id].result = first | second;
            // wires[id].expression = `(${wires[id].inputWires[0]}) OR (${wires[id].inputWires[1]})`;
            // wires[id].expression = `(${
            //     wires[wires[id].inputWires[0]].expression
            // }) OR (${wires[wires[id].inputWires[1]].expression})`;
            return wires[id].result;
        case 'XOR':
            wires[id].result = first ^ second;
            // wires[id].expression = `(${wires[id].inputWires[0]}) XOR (${wires[id].inputWires[1]})`;
            // wires[id].expression = `(${
            //     wires[wires[id].inputWires[0]].expression
            // }) XOR (${wires[wires[id].inputWires[1]].expression})`;
            return wires[id].result;
    }
};

const getNumber = (prefix, wires, binary = false) => {
    let result = '';
    let currBit = 0;
    let currBitString = currBit.toString().padStart(2, '0');
    while (wires[`${prefix}${currBitString}`] != null) {
        result = getWireValue(`${prefix}${currBitString}`, wires) + result;
        let currGate = wires[`${prefix}${currBitString}`];
        // console.log(`${prefix}${currBitString}: ${currGate.expression}`)
        currBitString = (++currBit).toString().padStart(2, '0');
    }
    if (binary) {
        return result;
    }
    return parseInt(result, 2);
};

const partOne = (input) => {
    const wires = JSON.parse(JSON.stringify(input.wires));
    return getNumber('z', wires);
};

const logGate = (wires, gateId, prefix = '') => {
    if (!gateId) {
        return;
    }
    console.log(`${prefix}+ ${wires[gateId]?.operator || ''} ${gateId}`);
    logGate(wires, wires[gateId]?.inputWires?.[0], prefix + '|  ');
    logGate(wires, wires[gateId]?.inputWires?.[1], prefix + '|  ');
};

const getNodes = (wires, gateId) => {
    if (!gateId) {
        return [];
    }
    const nodes = [gateId];
    nodes.push(...getNodes(wires, wires[gateId]?.inputWires?.[0]));
    nodes.push(...getNodes(wires, wires[gateId]?.inputWires?.[1]));
    return Array.from(new Set(nodes));
};

const renameWire = (wires, from, to) => {
    const gate = wires[from];
    wires[to] = gate;
    delete wires[from];
    Object.keys(wires).forEach((key) => {
        const index = wires[key].inputWires?.indexOf(from);
        if (index >= 0) {
            wires[key].inputWires[index] = to;
            wires[key].inputWires.sort();
        }
    });
};

const swapWires = (wires, first, second) => {
    const f = wires[first];
    wires[first] = wires[second];
    wires[second] = f;
};

const findWire = (wires, inputWires, operator) => {
    return Object.keys(wires).find(
        (key) =>
            wires[key].inputWires?.toString() === inputWires.toString() &&
            wires[key].operator === operator
    );
};

const partTwo = (input) => {
    const wires = JSON.parse(JSON.stringify(input.wires));
    // kth <-> z02
    swapWires(wires, 'kth', 'z12');
    // gsd <-> z26
    swapWires(wires, 'gsd', 'z26');
    // tbt <-> z32
    swapWires(wires, 'tbt', 'z32');
    // vpm <-> qnf
    swapWires(wires, 'vpm', 'qnf');

    const x = getNumber('x', wires);
    const y = getNumber('y', wires);
    const z = getNumber('z', wires, true);
    const correctZ = (x + y).toString(2);

    for (let i = 0; i < z.length; i++) {
        const wireString = `z${i.toString().padStart(2, '0')}`;
        const wire = wires[wireString];
        const remainderWire = findWire(wires, wire.inputWires, 'AND');
        if (!remainderWire) {
            console.log(`couldn't find remainder wire for ${wireString}`);
        } else if (wire.operator === 'XOR') {
            renameWire(wires, remainderWire, 'remainder' + wireString);
        }

        if (i < 2  || i === z.length - 1) {
            continue;
        }

        if (wire.operator !== 'XOR') {
            console.log('sus');
        }
        const resultWire = wire.inputWires.find(
            (key) => wires[key].operator === 'XOR'
        );
        const remWire = wire.inputWires.find(
            (key) => wires[key].operator === 'OR'
        );
        if (!resultWire || !remWire) {
            console.log('sus');
        }

        const inputWires = wire.inputWires;
    }

    return [z, correctZ];
};

assert.equal(partOne(inputSmall), 4);
assert.equal(partOne(inputSmall2), 2024);
console.log(partOne(input));

console.log(partTwo(input));
