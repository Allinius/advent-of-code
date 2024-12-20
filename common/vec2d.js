const add = (vec1, vec2) => {
    return {
        x: vec1.x + vec2.x,
        y: vec1.y + vec2.y,
    };
};

const difference = (vec1, vec2) => {
    return {
        x: vec1.x - vec2.x,
        y: vec1.y - vec2.y,
    };
};

const scalarMultiply = (vec, n) => {
    return {
        x: vec.x * n,
        y: vec.y * n,
    };
};

const manhattanDistance = (vec1, vec2) => {
    return Math.abs(vec2.x - vec1.x) + Math.abs(vec2.y - vec1.y);
};

module.exports = {
    add,
    difference,
    scalarMultiply,
    manhattanDistance,
};
