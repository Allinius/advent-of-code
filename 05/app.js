const fs = require('fs');

const ARRAY_ROW_COUNT = 1000;

const input = fs.readFileSync('input.txt', 'utf-8').split('\n').map(l => l.split(' -> ').map(c => {
    const parts = c.split(',');
    return {
        x: parseInt(parts[0]),
        y: parseInt(parts[1])
    }
}));

const countIntersections = (lines, countDiagonal = true) => {
    const map = [];
    for (let i = 0; i < ARRAY_ROW_COUNT; i++) {
        map[i] = [];
    }

    let intersectCount = 0;
    lines.forEach(line => {
        if (!countDiagonal && line[0].x !== line[1].x && line[0].y !== line[1].y) {
            return;
        }
        const xStep = Math.sign(line[1].x - line[0].x);
        const yStep = Math.sign(line[1].y - line[0].y);
        let x = line[0].x;
        let y = line[0].y;
        let stopNext = false;
        while (!stopNext) {
            if (x === line[1].x && y === line[1].y) {
                stopNext = true;
            }
            if (!map[y][x]) {
                map[y][x] = 0;
            }
            if (++map[y][x] === 2) {
                intersectCount++;
            }
            x += xStep;
            y += yStep;
        }
    });
    // drawMap(map, 10, 10);
    return intersectCount
}

const drawMap = (map, width, height) => {
    let canvas = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (!map[y][x]) {
                canvas += '.';
            } else {
                canvas += map[y][x]
            }
        }
        canvas += '\n'
    }
    console.log(canvas);
}

console.log(countIntersections(input, false));
console.log(countIntersections(input));