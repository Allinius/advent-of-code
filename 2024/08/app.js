const fs = require('fs');
const assert = require('assert');
const vec2d = require('../../common/vec2d');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const getAntennas = (map) => {
    const antennas = {};
    map.forEach((line, y) => {
        line.forEach((node, x) => {
            if (node === '.') {
                return;
            }
            if (antennas[node] == null) {
                antennas[node] = [{ x, y }];
            } else {
                antennas[node].push({ x, y });
            }
        });
    });
    return antennas;
};

const countAntennas = (map, maxSteps = 1, includeStarts = false) => {
    const antennas = getAntennas(map);
    const antibodies = new Map();
    Object.keys(antennas).forEach((key) => {
        if (antennas.length <= 1) {
            return;
        }
        antennas[key].forEach((firstPos, index) => {
            antennas[key].slice(index + 1).forEach((secondPos) => {
                if (includeStarts) {
                    antibodies.set(`${firstPos.x}_${firstPos.y}`, firstPos);
                    antibodies.set(`${secondPos.x}_${secondPos.y}`, secondPos);
                }

                const diff = vec2d.difference(secondPos, firstPos);
                const directions = [
                    { startPos: firstPos, transform: vec2d.difference },
                    { startPos: secondPos, transform: vec2d.add },
                ];
                directions.forEach((direction) => {
                    let newPos = direction.transform(direction.startPos, diff);
                    let i = 0;
                    while (
                        i++ < maxSteps &&
                        newPos.x >= 0 &&
                        newPos.x < map[0].length &&
                        newPos.y >= 0 &&
                        newPos.y < map.length
                    ) {
                        const key = `${newPos.x}_${newPos.y}`;
                        if (!antibodies.has(key)) {
                            antibodies.set(key, newPos);
                        }
                        newPos = direction.transform(newPos, diff);
                    }
                });
            });
        });
    });

    return Array.from(antibodies).length;
};

assert.equal(countAntennas(inputSmall), 14);
console.log(countAntennas(input));
assert.equal(countAntennas(inputSmall, Infinity, true), 34);
console.log(countAntennas(input, Infinity, true));
