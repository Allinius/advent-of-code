const fs = require('fs');

const parseInput = (fileName) => {
    const parts = fs.readFileSync(fileName, 'utf-8').split('\n\n').map(part => part.split('\n'));
    const coords = parts[0].map(p => {
        const coordParts = p.split(',');
        return { x: parseInt(coordParts[0]), y: parseInt(coordParts[1]) };
    });
    const folds = parts[1].map(p => {
        const foldParts = p.substring(11).split('=');
        return { axis: foldParts[0], coord: parseInt(foldParts[1]) };
    });

    return { coords, folds }
}

const smallInput = parseInput('input-small.txt');
const input = parseInput('input.txt');

const fold = (coords, axis, foldCoord) => {
    coords.forEach(c => {
        if (c[axis] > foldCoord) {
            c[axis] = foldCoord - (c[axis] - foldCoord);
        }
    });
    return coords;
}

const countCoords = (coords, action) => {
    let width = 0;
    let height = 0;
    coords.forEach(c => {
        width = c.x > width ? c.x : width;
        height = c.y > height ? c.y : height
    });
    const canvas = [];
    for (let y = 0; y <= height; y++) {
        canvas[y] = [];
        for (let x = 0; x <= width; x++) {
            canvas[y][x] = '.';
        }
    }
    let count = 0;
    coords.forEach(c => {
        if (canvas[c.y][c.x] === '.') {
            canvas[c.y][c.x] = '#';
            count++;
        }
    });
    if (action === 'draw') {
        console.log(canvas.map(l => l.join('')).join('\n'));
    }
    return count;
}

const partOne = (paper) => {
    fold(paper.coords, paper.folds[0].axis, paper.folds[0].coord);
    return countCoords(paper.coords);
}

const partTwo = (paper) => {
    paper.folds.forEach(f => {
        fold(paper.coords, f.axis, f.coord);
    });
    countCoords(paper.coords, 'draw');
}

console.log(partOne(smallInput));
partTwo(smallInput);
console.log(partOne(input));
partTwo(input);
