const fs = require('fs');
const assert = require('assert');
const array2d = require('../../common/array-2d-util');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line, y) => line.split(''));
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const countEdges = (map, x, y) => {
    const directions = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
    ];
    let edges = 0;
    directions.forEach((dir, index) => {
        const nextDir = directions[(index + 1) % directions.length];
        if (
            map[y + dir.y]?.[x + dir.x]?.type !== map[y][x].type &&
            map[y + nextDir.y]?.[x + nextDir.x]?.type !== map[y][x].type
        ) {
            // two addjacent directions are different
            edges++;
        } else if (
            map[y + dir.y]?.[x + dir.x]?.type === map[y][x].type &&
            map[y + nextDir.y]?.[x + nextDir.x]?.type === map[y][x].type &&
            map[y + dir.y + nextDir.y]?.[x + dir.x + nextDir.x]?.type !==
                map[y][x].type
        ) {
            // two adjacent directions are same but the diagonal between them different
            edges++;
        }
    });
    return edges;
};

const searchRegion = (map, startX, startY, id) => {
    let area = 0;
    let perimeter = 0;
    let edges = 0;
    if (map[startY][startX].regionId != null) {
        return;
    }
    const opened = [map[startY][startX]];
    while (opened.length > 0) {
        const currPlot = opened.pop();
        if (currPlot.regionId != null) {
            continue;
        }
        currPlot.regionId = id;
        const surrounding = array2d
            .getSurrounding(map, currPlot.x, currPlot.y)
            .map((res) => res.value);
        area++;
        perimeter +=
            surrounding.filter((plot) => plot.type !== currPlot.type).length +
            (4 - surrounding.length);

        edges += countEdges(map, currPlot.x, currPlot.y);
        opened.push(
            ...surrounding.filter(
                (plot) => plot.regionId == null && plot.type === currPlot.type
            )
        );
    }
    return { area, perimeter, edges };
};

const solve = (inputMap) => {
    const map = inputMap.map((line, y) =>
        line.map((type, x) => ({
            type,
            regionId: undefined,
            x,
            y,
        }))
    );
    const regions = [];
    let regionId = 0;
    map.forEach((line, y) => {
        line.forEach((plot, x) => {
            if (plot.regionId == null) {
                const { area, perimeter, edges } = searchRegion(
                    map,
                    x,
                    y,
                    regionId
                );
                regions.push({ regionId, area, perimeter, edges, x, y });
                regionId++;
            }
        });
    });
    return {
        partOne: regions.reduce(
            (sum, region) => sum + region.area * region.perimeter,
            0
        ),
        partTwo: regions.reduce(
            (sum, region) => sum + region.area * region.edges,
            0
        ),
    };
};

const testRes = solve(inputSmall);
assert.equal(testRes.partOne, 1930);
assert.equal(testRes.partTwo, 1206);
console.log(solve(input));
