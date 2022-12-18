const difference = (vec1, vec2) => {
    return {
        x: vec1.x - vec2.x,
        y: vec1.y - vec2.y,
        z: vec1.z - vec2.z,
    };
};

const add = (vec1, vec2) => {
    return {
        x: vec1.x + vec2.x,
        y: vec1.y + vec2.y,
        z: vec1.z + vec2.z,
    };
};

const eq = (vec1, vec2) => {
    return vec1.x === vec2.x && vec1.y === vec2.y && vec1.z === vec2.z;
};

const magnitude = (vec) => {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
};

const manhattanDistance = (vec1, vec2) => {
    return (
        Math.abs(vec2.x - vec1.x) +
        Math.abs(vec2.y - vec1.y) +
        Math.abs(vec2.z - vec1.z)
    );
};

const rotateX90 = (vec) => {
    return {
        x: vec.x,
        y: -vec.z,
        z: vec.y,
    };
};
const rotateY90 = (vec) => {
    return {
        x: vec.z,
        y: vec.y,
        z: -vec.x,
    };
};
const rotateZ90 = (vec) => {
    return {
        x: -vec.y,
        y: vec.x,
        z: vec.z,
    };
};

const rotate = (vector, timesX, timesY, timesZ) => {
    let newVec = vector;
    for (let xc = 0; xc < timesX; xc++) {
        newVec = rotateX90(newVec);
    }
    for (let yc = 0; yc < timesY; yc++) {
        newVec = rotateY90(newVec);
    }
    for (let zc = 0; zc < timesZ; zc++) {
        newVec = rotateZ90(newVec);
    }
    return newVec;
};

module.exports = {
    difference,
    add,
    eq,
    magnitude,
    manhattanDistance,
    rotate,
};
