const fs = require('fs');

const inputSmall = fs.readFileSync('input-small.txt', 'utf-8')
    .split('\n').map((l, y) => 
        l.split('').map((n, x) => ({ x, y, risk: parseInt(n) })
    )
);
const input = fs.readFileSync('input.txt', 'utf-8')
    .split('\n').map((l, y) => 
        l.split('').map((n, x) => ({ x, y, risk: parseInt(n) })
    )
);

const getNeighbours = (map, x, y) => {
    return [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 }
    ].filter(c => c.x >= 0 && c.x < map[0].length && c.y >= 0 && c.y < map.length)
    .map(c => map[c.y][c.x]);
}

const uniformCostSearch = (map, start, end) => {
    for (let y = 0; y < map[0].length; y++) {
        for (let x = 0; x < map.length; x++) {
            map[y][x].dist = Number.MAX_SAFE_INTEGER;
            map[y][x].prev = undefined;
        }
    }
    map[start.y][start.x].dist = 0; // the starting position is never entered, so its risk is not counted

    const frontier = new Set();
    frontier.add(map[start.y][start.x]);
    const explored = new Set();

    while (true) {
        if (frontier.length === 0) {
            return 'fail';
        }
        const frontierArr = Array.from(frontier);
        const node = frontierArr.reduce((min, n) => n.dist < min.dist ? n : min, frontierArr[0]);
        frontier.delete(node);
        if (node.x === end.x && node.y === end.y) {
            return node.dist;
        }
        explored.add(node);
        const neighbours = getNeighbours(map, node.x, node.y);
        neighbours.forEach(n => {
            const alt = node.dist + n.risk;
            if (alt < n.dist) {
                n.dist = alt;
                n.prev = node;
            }
            if (!explored.has(n)) {
                frontier.add(n);
            }
        });
    }
}

const partOne = (map) => {
    const start = { x: 0, y: 0 };
    const end = {
        x: map[0].length - 1,
        y: map.length - 1
    };
    const risk = uniformCostSearch(map, start, end);
    return risk;
}

const partTwo = (map) => {
    const megaMap = [];
    const mapWidth = map[0].length;
    const mapHeight = map.length;
    for (let y = 0; y < 5 * mapHeight; y++) {
        megaMap[y] = [];
        const my = Math.floor(y / mapHeight);


        for (let x = 0; x < 5 * mapWidth; x++) {
            const mx = Math.floor(x / mapWidth);
            const m = mx + my;

            const source = map[y % mapHeight][x % mapHeight];
            megaMap[y][x] = {
                x, y,
                risk: (m + source.risk - 1) % 9 + 1,
            };
        }
    }

    const start = { x: 0, y: 0 };
    const end = {
        x: megaMap[0].length - 1,
        y: megaMap.length - 1
    };
    const risk = uniformCostSearch(megaMap, start, end);
    return risk;
}

// console.log(partOne(inputSmall));
// console.log(partTwo(inputSmall));
console.log(partOne(input));
console.log(partTwo(input));