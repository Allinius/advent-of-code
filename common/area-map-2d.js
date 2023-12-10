class AreaMap2D {
    constructor(map) {
        this.map = map;
    }

    getCell(x, y) {
        if (
            this.map &&
            x >= 0 &&
            y >= 0 &&
            x < this.map[0].length &&
            y < this.map.length
        ) {
            return this.map[y][x];
        }
    }

    getSurrounding(x, y, useDiagonal = false) {
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
        adjVectors.forEach((vec) => {
            const cell = this.getCell(vec[0], vec[1]);
            if (cell) {
                results.push({
                    x: vec[0],
                    y: vec[1],
                    value: cell,
                });
            }
        });
        return results;
    }
}

module.exports = AreaMap2D;
