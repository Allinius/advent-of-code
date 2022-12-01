const fs = require('fs');

const inputSmall = fs.readFileSync('input-small.txt', 'utf8').replace(/\r/g, "").split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('').split('');
const input = fs.readFileSync('input.txt', 'utf8').replace(/\r/g, "").split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('').split('');

const parsePackets = (packetBits) => {
    const version = parseInt(packetBits.splice(0, 3).join(''), 2);
    const typeId = parseInt(packetBits.splice(0, 3).join(''), 2);

    let encodedNum = '';
    let endLength; // length at which to stop reading sub-packets
    let remainingPackets;
    const subPackets = [];

    if (typeId === 4) { // literal value
        while(true) {
            const continueFlag = packetBits.splice(0,1)[0];
            const bits = packetBits.splice(0,4).join('');
            encodedNum += bits;
            if (continueFlag === '0') {
                break;
            }
        }
    } else { // multiple subpackets
        const lengthTypeId = packetBits.splice(0, 1)[0];
        if (lengthTypeId === '0') {
            const remainingBits = parseInt(packetBits.splice(0, 15).join(''), 2);
            endLength = packetBits.length - remainingBits;
        } else {
            remainingPackets = parseInt(packetBits.splice(0, 11).join(''), 2);
        }
        while (endLength != null && packetBits.length > endLength) {
            subPackets.push(parsePackets(packetBits));
        }
        while (remainingPackets != null && remainingPackets-- > 0) {
            subPackets.push(parsePackets(packetBits));
        }
    }

    encodedNum = parseInt(encodedNum, 2);
    if (isNaN(encodedNum)) {
        encodedNum = undefined;
    }
    return { version, typeId, encodedNum, subPackets };
}

const getVersionSum = (packet) => {
    return packet.version + packet.subPackets.reduce((a, p) => a + getVersionSum(p), 0);
}

const partOne = (packetBits) => {
    const packets = parsePackets(packetBits);
    return getVersionSum(packets);
}

const getPacketValue = (packet) => {
    if (packet.encodedNum != null) {
        return packet.encodedNum;
    }
    const packetValues = packet.subPackets.reduce((a, p) => [...a, getPacketValue(p)], []);
    switch (packet.typeId) {
        case 0:
            return packetValues.reduce((a, v) => a + v, 0);
        case 1:
            return packetValues.reduce((a, v) => a * v, 1);
        case 2:
            return Math.min(...packetValues);
        case 3:
            return Math.max(...packetValues);
        case 5:
            return packetValues[0] > packetValues[1] ? 1 : 0;
        case 6:
            return packetValues[0] < packetValues[1] ? 1 : 0;
        case 7:
            return packetValues[0] === packetValues[1] ? 1 : 0;
    }
}

const partTwo = (packetBits) => {
    const packets = parsePackets(packetBits);
    return getPacketValue(packets);
}

// console.log(partOne(inputSmall));
// console.log(partOne(input));
// console.log(partTwo(inputSmall));
console.log(partTwo(input));
