const fs = require('fs');

const simulateStep = (probe) => {
    return {
        x: probe.x + probe.vx,
        y: probe.y + probe.vy,
        vx: Math.max(probe.vx - 1, 0),
        vy: probe.vy - 1
    }
}

const partOne = (yMin, yMax) => {
    const initProbe = {
        x: 0,
        y: 0,
        vx: 0,
        vy: undefined
    };
    let vy = 1;
    let maxMaxHeight = 0;
    let failMax = yMax - yMin;
    let failCount = 0;
    while (true) {
        let probe = {...initProbe, vy: vy++};
        let steps = 0;
        let maxHeight = 0;
        let success = false;
        while (probe.y >= yMin) {
            steps++;
            probe = simulateStep(probe);
            maxHeight = Math.max(probe.y, maxHeight);
            if (probe.y <= yMax && probe.y >= yMin) {
                failCount = 0;
                success = true;
                maxMaxHeight = Math.max(maxHeight, maxMaxHeight);
                break;
            }
        }
        if (!success) {
            failCount++
        }
        if (failCount > failMax) {
            break;
        }
    }
    return maxMaxHeight;
}

const landsInTarget = (probe, xMin, xMax, yMin, yMax) => {
    if (probe.x >= xMin && probe.x <= xMax && probe.y >= yMin && probe.y <= yMax) {
        return true;
    }
    if (probe.x > xMax || probe.y < yMin) {
        return false;
    }
    return landsInTarget({
        x: probe.x + probe.vx,
        y: probe.y + probe.vy,
        vx: Math.max(probe.vx - 1, 0),
        vy: probe.vy - 1
    }, xMin, xMax, yMin, yMax);
}

const partTwo = (xMin, xMax, yMin, yMax) => {
    let solutionCount = 0;
    for (let vx = 0; vx <= xMax; vx++) {
        for (let vy = yMin; vy <= -yMin; vy++) {
            const probe = {
                x: 0,
                y: 0,
                vx, vy
            };
            if (landsInTarget(probe, xMin, xMax, yMin, yMax)) {
                solutionCount++;
            }
        }
    }
    return solutionCount;
}

console.log(partOne(-10, -5));
console.log(partOne(-125, -71));
console.log(partTwo(20, 30, -10, -5));
console.log(partTwo(138, 184, -125, -71));