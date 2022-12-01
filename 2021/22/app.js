const fs = require('fs');

class Cuboid {
    constructor(xMin, xMax, yMin, yMax, zMin, zMax) {
        this.xMin = xMin;
        this.xMax = xMax; 
        this.yMin = yMin;
        this.yMax = yMax;
        this.zMin = zMin;
        this.zMax = zMax;
    }

    intersect(other) {
        const xMin = Math.max(this.xMin, other.xMin);
        const xMax = Math.min(this.xMax, other.xMax);
        const yMin = Math.max(this.yMin, other.yMin);
        const yMax = Math.min(this.yMax, other.yMax);
        const zMin = Math.max(this.zMin, other.zMin);
        const zMax = Math.min(this.zMax, other.zMax);
        if (xMin <= xMax && yMin <= yMax && zMin <= zMax) {
            return new Cuboid(xMin, xMax, yMin, yMax, zMin, zMax);
        }
        return null;
    }

    size() {
        const xSize = this.xMax - this.xMin + 1;
        const ySize = this.yMax - this.yMin + 1;
        const zSize = this.zMax - this.zMin + 1;
        return xSize * ySize * zSize;
    }
}

const parseInput = (fileName) => {
    return fs.readFileSync(fileName, 'utf8').replace(/\r/g, "").split('\n').map(line => {
        const [state, coordPart] = line.split(' ');
        const sign = state === 'on' ? 1 : -1;
        const coords = coordPart.split(',').map(c => 
            c.substring(2).split('..').map(n => parseInt(n))
        );
        const cuboid = new Cuboid(coords[0][0], coords[0][1], coords[1][0], coords[1][1], coords[2][0], coords[2][1]);
        return {
            sign,
            cuboid
        };
    });
}

const smallInput = parseInput('input-small.txt');
const input = parseInput('input.txt');

const countLit = (instructions) => {
    const processed = [];
    instructions.forEach((instruction, i) => {
        const newProcessed = [];
        if (instruction.sign === 1) {
            newProcessed.push(instruction);
        }
        processed.forEach(pi => {
            const intersection = instruction.cuboid.intersect(pi.cuboid);
            if (intersection) {
                newProcessed.push({
                    sign: -1 * pi.sign,
                    cuboid: intersection
                });
            }
        });
        processed.push(...newProcessed);
    });
    return processed.reduce((acc, i) => acc + (i.sign * i.cuboid.size()), 0);
}

// console.log(countLit(smallInput));
console.log(countLit(input.slice(0,20)))
console.log(countLit(input));



