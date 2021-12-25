const fs = require('fs');

const smallInput = fs.readFileSync('input-small.txt', 'utf8').split('\n').map(l => l.split(''));
const input = fs.readFileSync('input.txt', 'utf8').split('\n').map(l => l.split(''));

const moveAll = (floorMap, type, dir) => {
    const newMap = floorMap.map(r => [...r]);
    let moveCount = 0;
    floorMap.forEach((row, y, floorMap) => {
        row.forEach((cell, x) => {
            const newPos = {
                x: (x + dir.x) % floorMap[0].length,
                y: (y + dir.y) % floorMap.length,
            }
            if (cell === type && floorMap[newPos.y][newPos.x] === '.') {
                newMap[y][x] = '.';
                newMap[newPos.y][newPos.x] = type;
                moveCount++;
            } 
        });
    });
    return {
        map: newMap,
        moveCount
    }
}

const partOne = (floorMap) => {
    let turn = 0;
    let moveCount;
    do {
        turn++;
        moveCount = 0;
        let res = moveAll(floorMap, '>', { x: 1, y: 0 });
        moveCount += res.moveCount;
        res = moveAll(res.map, 'v', { x: 0, y: 1 });
        moveCount += res.moveCount;
        floorMap = res.map;
    } while (moveCount > 0);
    return {floorMap, turn};
}

console.log(partOne(input).turn);
