const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const parts = line.replace(/\D+/g, ' ').trim().split(' ');
            return [
                [parseInt(parts[1]), 0, 0],
                [parseInt(parts[2]), 0, 0],
                [parseInt(parts[3]), parseInt(parts[4]), 0],
                [parseInt(parts[5]), 0, parseInt(parts[6])],
            ];
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const collectMaterials = (materials, robots) => {
    const newMats = [...materials];
    materials.forEach((_, i) => (newMats[i] += robots[i]));
    return newMats;
};

const canBuild = (cost, materials) => {
    return cost.find((matCost, i) => matCost > materials[i]) == null;
};

const build = (blueprint, matId, materials, robots) => {
    const newMats = [...materials];
    blueprint[matId].forEach((matCost, i) => {
        newMats[i] -= matCost;
    });
    const newRobots = [...robots];
    newRobots[matId]++;
    return { newMats, newRobots };
};

const calculateMaxCosts = (blueprint) => {
    const max = [...blueprint[0]];
    blueprint.forEach((robotCosts) => {
        for (let i = 0; i < robotCosts.length; i++) {
            max[i] = Math.max(max[i], robotCosts[i]);
        }
    });
    return max;
};

const calculateMaxPotential = (remainning, materials, robots) => {
    return Array(remainning)
        .fill()
        .reduce((acc, _, i) => acc + robots[3] + i + 1, materials[3]);
};

const findHighestGeodes = (
    blueprint,
    globalHelp,
    remaining,
    materials = [0, 0, 0, 0],
    robots = [1, 0, 0, 0]
) => {
    // prune by maxPotential
    const maxPotential = calculateMaxPotential(remaining, materials, robots);
    if (maxPotential < globalHelp.maxGeodes) {
        return 0;
    }
    //

    if (remaining === 1) {
        return robots[3];
    }

    // prune by cache
    const cacheKey = `${robots},${materials}`;
    if (globalHelp.cache[remaining][cacheKey]) {
        return globalHelp.cache[remaining][cacheKey];
    }
    //

    let maxGeodes = 0;
    let madeGoodRobot = false;
    for (let i = 3; i >= 0; i--) {
        // prune by not building more robots than needed
        if (
            !canBuild(blueprint[i], materials) ||
            robots[i] >= globalHelp.maxCosts[i]
        ) {
            continue;
        }
        //

        const { newMats, newRobots } = build(blueprint, i, materials, robots);
        const collectedGeodes = findHighestGeodes(
            blueprint,
            globalHelp,
            remaining - 1,
            collectMaterials(newMats, robots),
            newRobots
        );

        maxGeodes = Math.max(maxGeodes, collectedGeodes);
        // prune by building high tier robots whenever possible
        // prune by not waiting when obsidian or geode robot can be built
        //  i > 2 should always work, i > 1 sometimes works
        if (i > 2) {
            madeGoodRobot = true;
            break;
        }
        //
    }
    if (!madeGoodRobot) {
        maxGeodes = Math.max(
            maxGeodes,
            findHighestGeodes(
                blueprint,
                globalHelp,
                remaining - 1,
                collectMaterials(materials, robots),
                [...robots]
            )
        );
    }

    globalHelp.maxGeodes = Math.max(globalHelp.maxGeodes, maxGeodes);
    globalHelp.cache[remaining][cacheKey] = robots[3] + maxGeodes;
    return robots[3] + maxGeodes;
};

const partOne = (blueprints) => {
    let result = 0;
    blueprints.forEach((bp, i) => {
        const globalHelp = {
            maxGeodes: 0,
            maxCosts: calculateMaxCosts(bp),
            cache: Array(25)
                .fill()
                .map(() => ({})),
        };
        const geodesFound = findHighestGeodes(bp, globalHelp, 24);
        console.log(geodesFound);
        result += (i + 1) * geodesFound;
    });
    return result;
};

const partTwo = (blueprints) => {
    let result = 1;
    blueprints.slice(0, 3).forEach((bp) => {
        const globalHelp = {
            maxGeodes: 0,
            maxCosts: calculateMaxCosts(bp),
            cache: Array(33)
                .fill()
                .map(() => ({})),
        };
        const geodesFound = findHighestGeodes(bp, globalHelp, 32);
        console.log(geodesFound);
        result *= geodesFound;
    });
    return result;
};

// assert.equal(partOne(inputSmall), 33);
// console.log(partOne(input));
// assert.equal(partTwo(inputSmall), 56 * 62);
console.log(partTwo(input));
