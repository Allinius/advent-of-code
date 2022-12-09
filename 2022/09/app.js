const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const dirs = {
        R: { x: 1, y: 0 },
        L: { x: -1, y: 0 },
        U: { x: 0, y: 1 },
        D: { x: 0, y: -1 },
    };
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((l) => ({
            direction: dirs[l.split(' ')[0]],
            count: parseInt(l.split(' ')[1]),
        }));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const segmentDirection = (segment, target) => {
    const diff = {
        x: target.x - segment.x,
        y: target.y - segment.y,
    };
    if (Math.abs(diff.x) <= 1 && Math.abs(diff.y) <= 1) {
        return { x: 0, y: 0 };
    }
    return {
        x: Math.sign(diff.x),
        y: Math.sign(diff.y),
    };
};

const markVisited = (visited, pos) => {
    const key = `${pos.x},${pos.y}`;
    visited[key] = visited[key] ? visited[key] + 1 : 1;
};

const moveRope = (rope, direction) => {
    for (let i = 0; i < rope.length; i++) {
        const dir = i > 0 ? segmentDirection(rope[i], rope[i - 1]) : direction;
        rope[i] = {
            x: rope[i].x + dir.x,
            y: rope[i].y + dir.y,
        };
    }
};

const simulateRope = (instructions, segments = 2) => {
    const visited = {};
    const rope = Array(segments).fill({ x: 0, y: 0 });
    instructions.forEach((instruction) => {
        for (let i = 0; i < instruction.count; i++) {
            moveRope(rope, instruction.direction);
            markVisited(visited, rope[rope.length - 1]);
        }
    });
    return Object.keys(visited).length;
};

assert.equal(simulateRope(inputSmall), 13);
console.log(simulateRope(input));

assert.equal(simulateRope(inputSmall, 10), 1);
console.log(simulateRope(input, 10));
