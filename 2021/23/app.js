const fs = require('fs');

const parseInput = (fileName) => {
    const a = fs.readFileSync(fileName, 'utf8').split('\n').map((line, y) => 
        line.split('').flatMap(c => 
            c === 'A' || c === 'B' || c === 'C' || c === 'D' ? c : []
        )
    ).filter(a => a.length > 0).reduce((acc, line, i) => i === 0 ? line : line.map((c, j) => [...acc[j], c]));
    return a;
}

const input = parseInput('input.txt');
const input2 = parseInput('input2.txt');

const findDestinations = (map, info, x, y) => {
    const c = y == null ? map[x] : map[x][y];
    targetX = info[c].target;
    const dests = [];
    if (y != null) {
        if (x === targetX && !map[x].slice(y + 1).find(a => a !== c)) { // he should be home
            return dests;
        }
        if (map[x].slice(0,y).find(a => a != null)) { // blocked by other in room
            return dests;
        }
        for (let dx = x - 1; dx >= 0; dx--) { // traverse left
            if (map[dx] == null) {
                dests.push({x: dx});
            } else if (!Array.isArray(map[dx])) {
                break;
            } else if (dx === targetX) {
                if (map[targetX].findIndex(a => a != null && a !== c) !== -1) { // home room blocked by other amphipods
                    continue;
                }
                let targetY = map[targetX].lastIndexOf(null);
                return [ {x: targetX, y: targetY} ];
            }
        }
        for (let dx = x + 1; dx < map.length; dx++) { // traverse right
            if (map[dx] == null) {
                dests.push({x: dx});
            } else if (!Array.isArray(map[dx])) {
                break;
            } else if (dx === targetX) {
                if (map[targetX].findIndex(a => a != null && a !== c) !== -1) { // home room blocked by other amphipods
                    continue;
                }
                let targetY = map[targetX].lastIndexOf(null);
                return [ {x: targetX, y: targetY} ];
            }
        }
    } else {
        const sign = Math.sign(targetX - x);
        for (let dx = x + sign; dx !== targetX; dx += sign) {
            if (map[dx] != null && !Array.isArray(map[dx])) { // way home blocked
                return dests;
            }
        }
        if (map[targetX].findIndex(a => a != null && a !== c) !== -1) { // home room blocked by other amphipods
            return dests;
        }
        let targetY = map[targetX].lastIndexOf(null);
        dests.push({x: targetX, y: targetY});
    }
    return dests;
}

const moveAmphipod = (map, x, y, dx, dy) => {
    const c = y == null ? map[x] : map[x][y];
    if (y != null) {
        map[x][y] = null;
    } else {
        map[x] = null;
    }
    if (dy != null) {
        map[dx][dy] = c;
    } else {
        map[dx] = c;
    }
}

const getAmphipodCoords = (map) => {
    return map.flatMap((tile, x) => 
        Array.isArray(tile) ? 
            tile.map((c, y) => c != null ? {x, y, type: map[x][y]} : null).filter(c => c != null) : 
            tile != null ? { x, type: map[x] } : null
    ).filter( c => c != null );
}

const countSteps = (x, y, dx, dy) => {
    if (y == null || dy == null) {
        const ry = y == null ? -1 : y;
        const rdy = dy == null ? -1 : dy;
        return Math.abs(dx - x) + Math.abs(rdy - ry);
    } else {
        return Math.abs(dx - x) + y + dy + 2;
    }
}

const findMinRoute = (map, info, energyUsed, currMin, path) => {
    if (energyUsed > currMin) {
        return { min: energyUsed, path };
    }
    const pods = getAmphipodCoords(map);
    const canMoveHome = [];
    let canMove = [];
    pods.forEach(pod => {
        pod.destinations = findDestinations(map, info, pod.x, pod.y);
        pod.targetX = info[pod.type].target;
        const home = pod.destinations.find(d => d.x === targetX);
        if (home != null) { // pod can move straight home
            canMoveHome.push(pod);
        } else if (pod.destinations.length > 0) {
            canMove.push(pod);
        }
    });
    if (canMoveHome.length > 0) {
        canMove = canMoveHome;
    }

    let newMin = currMin;
    let minPath;
    
    if (canMove.length > 0) {
        canMove.forEach(pod => {
            pod.destinations.forEach(dest => {
                // clone map
                const newMap = [...map].map(t => Array.isArray(t) ? [...t] : t);
                
                const moveEnergy = info[pod.type].cost * countSteps(pod.x, pod.y, dest.x, dest.y);
                let newPath = [...path, {pod, dest, moveEnergy}];
                moveAmphipod(newMap, pod.x, pod.y, dest.x, dest.y);
                
                const res = findMinRoute(newMap, info, energyUsed + moveEnergy, newMin, newPath);
                if (res.min < newMin) {
                    newMin = res.min;
                    minPath = res.path;
                }
            });
        });
    } else {
        let everyoneHome = true;
        for (let i = 0; i < pods.length; i++) {
            if (pods[i].x !== info[pods[i].type].target) {
                everyoneHome = false;
                break;
            }
        }
        if (everyoneHome) {
            return { min: energyUsed, path };
        }
    }
    return { min: newMin, path: minPath };
}

const drawMap = (map) => {
    let output = map.map(t => Array.isArray(t) || t == null ? '.' : t).join('') + '\n';
    const roomXs = [2, 4, 6, 8];
    for (let y = 0; y < 2; y++) {
        for (let x = 0; x < map.length; x++) {
            output += roomXs.includes(x) ? map[x][y] != null ? map[x][y] : '.' : '#';
        }
        output += '\n';
    }
    console.log(output);
}

const drawPath = (map, path) => {
    const newMap = [...map].map(t => Array.isArray(t) ? [...t] : t);
    drawMap(newMap);
    path.forEach(step => {
        moveAmphipod(newMap, step.pod.x, step.pod.y, step.dest.x, step.dest.y);
        console.log(step.moveEnergy);
        drawMap(newMap);
    });
}

const solve = (input, draw = false) => {
    const map = [null, null, input[0], null, input[1], null, input[2], null, input[3], null, null];
    const info = {
        A: {
            cost: 1,
            target: 2
        },
        B: {
            cost: 10,
            target: 4
        },
        C: {
            cost: 100,
            target: 6
        },
        D: {
            cost: 1000,
            target: 8
        }
    }
    const result = findMinRoute(map, info, 0, Infinity, []);
    if (draw) {
        drawPath(map, result.path);
    }
    return result.min;
}

console.log(solve(input));
console.log(solve(input2));
