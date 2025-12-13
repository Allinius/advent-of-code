const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const blocks = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');
    const shapes = blocks.slice(0, -1).map((block) => {
        const blockArr = block
            .split('\n')
            .slice(1)
            .map((line) => line.split(''));
        let size = 0;
        for (let y = 0; y < blockArr.length; y++) {
            for (let x = 0; x < blockArr[0].length; x++) {
                if (blockArr[y][x] === '#') {
                    size++;
                }
            }
        }
        return { shape: blockArr, size };
    });
    const areas = blocks
        .slice(-1)[0]
        .split('\n')
        .map((line) => {
            const [sizePart, presentCounts] = line.split(': ');
            const [cols, rows] = sizePart.split('x').map(Number);
            const counts = presentCounts
                .split(' ')
                .map((count) => Number(count));
            return { rows, cols, counts };
        });
    return { shapes, areas };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (input) => {
    generateShapeVariations(input);

    return input.areas.reduce(
        (canFit, area) =>
            canFitShapes(area, input.shapes) ? canFit + 1 : canFit,
        0
    );
};

const generateShapeVariations = (input) => {
    input.shapes = input.shapes.map((shapeObj) => {
        const variations = [];
        let currentShape = shapeObj.shape;
        for (let i = 0; i < 4; i++) {
            currentShape = rotateShape(currentShape);
            addIfNotExists(variations, currentShape);
            const flipped = flipShape(currentShape);
            addIfNotExists(variations, flipped);
        }
        return { variations, size: shapeObj.size };
    });
};

const rotateShape = (shape) => {
    const rows = shape.length;
    const cols = shape[0].length;
    const newShape = Array(cols)
        .fill(0)
        .map(() => Array(rows).fill('.'));
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            newShape[x][rows - 1 - y] = shape[y][x];
        }
    }
    return newShape;
};

const flipShape = (shape) => {
    const rows = shape.length;
    const cols = shape[0].length;
    const newShape = Array(rows)
        .fill(0)
        .map(() => Array(cols).fill('.'));
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            newShape[y][cols - 1 - x] = shape[y][x];
        }
    }
    return newShape;
};

const addIfNotExists = (variations, shape) => {
    for (const varShape of variations) {
        if (areShapesEqual(varShape, shape)) {
            return;
        }
    }
    variations.push(shape);
};

const areShapesEqual = (shapeA, shapeB) => {
    for (let y = 0; y < shapeA.length; y++) {
        for (let x = 0; x < shapeA[0].length; x++) {
            if (shapeA[y][x] !== shapeB[y][x]) {
                return false;
            }
        }
    }
    return true;
};

const canFitShapes = (area, shapes) => {
    const areaSize = area.rows * area.cols;
    const shapesVolume = area.counts.reduce((sum, count, index) => {
        return sum + count * shapes[index].size;
    }, 0);
    if (shapesVolume > areaSize) {
        // console.log('Area', area, 'can fit: ', false);
        return false;
    }
    const grid = Array(area.rows)
        .fill(0)
        .map(() => Array(area.cols).fill('.'));
    const canFit = canFitRecursive(grid, area, shapes);
    // console.log('Area', area, 'can fit:', canFit);
    return canFit;
};

const canFitRecursive = (grid, area, shapes, shapeIndex = 0) => {
    if (shapeIndex >= shapes.length) {
        return true;
    }
    const shapeVariations = shapes[shapeIndex].variations;
    const shapeWidth = shapeVariations[0][0].length;
    const shapeHeight = shapeVariations[0].length;
    const count = area.counts[shapeIndex];
    if (count === 0) {
        return canFitRecursive(grid, area, shapes, shapeIndex + 1);
    }
    for (let y = 0; y <= area.rows - shapeHeight; y++) {
        for (let x = 0; x <= area.cols - shapeWidth; x++) {
            for (const shape of shapeVariations) {
                if (canPlaceShape(grid, shape, x, y)) {
                    placeShape(grid, shape, x, y, '#');
                    area.counts[shapeIndex]--;
                    if (canFitRecursive(grid, area, shapes, shapeIndex)) {
                        return true;
                    }
                    placeShape(grid, shape, x, y, '.');
                    area.counts[shapeIndex]++;
                }
            }
        }
    }
    return false;
};

const canPlaceShape = (grid, shape, startX, startY) => {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[0].length; x++) {
            if (shape[y][x] === '#' && grid[startY + y][startX + x] === '#') {
                return false;
            }
        }
    }
    return true;
};

const placeShape = (grid, shape, startX, startY, tile) => {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[0].length; x++) {
            if (shape[y][x] === '#') {
                grid[startY + y][startX + x] = tile;
            }
        }
    }
};

assert.equal(partOne(inputSmall), 2);
console.log(partOne(input));
