const getCell = (map, x, y) => {
    if (map && x >= 0 && y >= 0 && x < map[0].length && y < map.length) {
        return map[y][x];
    }
};

const getSurrounding = (map, x, y, useDiagonal = false) => {
    const adjVectors = useDiagonal
        ? [
              [x, y - 1],
              [x + 1, y - 1],
              [x + 1, y],
              [x + 1, y + 1],
              [x, y + 1],
              [x - 1, y + 1],
              [x - 1, y],
              [x - 1, y - 1],
          ]
        : [
              [x, y - 1],
              [x + 1, y],
              [x, y + 1],
              [x - 1, y],
          ];
    const results = [];
    adjVectors.forEach(([x, y], dirIndex) => {
        const value = getCell(map, x, y);
        if (value) {
            results.push({
                x,
                y,
                value,
                dirIndex,
            });
        }
    });
    return results;
};

module.exports = {
    getCell,
    getSurrounding,
};
