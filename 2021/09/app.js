const fs = require('fs');

const smallInput = fs.readFileSync('input-small.txt', 'utf-8').replace(/\r/g, "").split('\n').map(l => l.split('').map(n => parseInt(n)));
const input = fs.readFileSync('input.txt', 'utf-8').replace(/\r/g, "").split('\n').map(l => l.split('').map(n => parseInt(n)));

const partOne = (map) => {
    const lowPoints = [];
    const lowPointRisks = map.reduce((risk, row, y) => risk + row.reduce((rowRisk, height, x) => {
        const neighbourCoords = [
            {x: x + 1, y: y},
            {x: x - 1, y: y},
            {x: x, y: y + 1},
            {x: x, y: y - 1},
        ];
        const isLowPoint = !neighbourCoords.some(coord => map[coord.y] && map[coord.y][coord.x] <= height);
        if (isLowPoint) {
            lowPoints.push({x, y});
        }
        return isLowPoint ? rowRisk + height + 1 : rowRisk;
    }, 0), 0);

    return {lowPoints, lowPointRisks}
}

const markBasins = (map, basinMap, point, id) => {
    if (map[point.y][point.x] === 9) {
        basinMap[point.y][point.x] = '#';
        return;
    }
    basinMap[point.y][point.x] = id;

    const neighbourCoords = [
        {x: point.x + 1, y: point.y},
        {x: point.x - 1, y: point.y},
        {x: point.x, y: point.y + 1},
        {x: point.x, y: point.y - 1},
    ].filter(c => map[c.y] && map[c.y][c.x] && basinMap[c.y][c.x] === undefined);

    neighbourCoords.forEach(c => markBasins(map, basinMap, c, id));
}

const getBasinSizes = (basinMap) => {
    const sizes = [];
    basinMap.forEach(row => {
        row.forEach(id => {
            if (id !== '#') {
                sizes[id] = sizes[id]  ? sizes[id] + 1 : 1;
            }
        });
    });
    return sizes;
}

const partTwo = (map) => {
    const basinMap = [];
    const basinSizes = [];
    
    map.forEach((_, y) => {
        basinMap[y] = [];
    });

    const lowPoints = partOne(map).lowPoints;

    lowPoints.forEach((lowPoint, index) => {
        markBasins(map, basinMap, lowPoint, index);
    });
    const sizes = getBasinSizes(basinMap);

    return sizes.map((s,i) => ({s, i})).sort((a,b) => b.s - a.s).slice(0,3).reduce((res, size) => res * size.s, 1);
}

console.log(partOne(input).lowPointRisks);
console.log(partTwo(input));
