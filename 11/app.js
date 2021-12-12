const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf-8')
    .split('\n')
    .map((l, y) => 
        l.split('').map((s, x) => ({
            energy: parseInt(s),
            x,
            y,
            flashed: false
        }))
    );

const flashOctopus = (octopuses, octopus) => {
    let flashCount = 1;

    const neighboursToFlash = [];
    for (let x = octopus.x - 1; x <= octopus.x + 1; x++) {
        for (let y = octopus.y - 1; y <= octopus.y + 1; y++) {
            if (x === octopus.x && y === octopus.y) {
                continue;
            }
            const neighbour = octopuses[y] ? octopuses[y][x] : undefined;
            if (neighbour) {
                neighbour.energy += 1;
                if (neighbour.energy > 9 && !neighbour.flashed) {
                    neighbour.flashed = true;
                    neighboursToFlash.push(neighbour);
                }
            }
        }
    }

    neighboursToFlash.forEach(neighbour => {
        flashCount += flashOctopus(octopuses, neighbour);
    });

    return flashCount;    
}

const simulateStep = (octopuses) => {
    const initFlashes = [];
    octopuses.forEach((row, y) => {
        row.forEach((octopus, x) => {
            octopus.energy += 1;
            octopus.flashed = false;
            if (octopus.energy > 9) {
                octopus.flashed = true;
                initFlashes.push(octopus);
            }
            return octopus;
        })
    });

    let flashCount = 0;
    initFlashes.forEach(octopus => {
        flashCount += flashOctopus(octopuses, octopus);
    });

    octopuses.forEach(row => {
        row.forEach(octopus => {
            if (octopus.energy > 9) {
                octopus.energy = 0;
            }
        });
    });

    return flashCount;
}

const partOne = (octopuses, steps) => {
    let flashes = 0;
    for (let s = 0; s < steps; s++) {
        flashes += simulateStep(octopuses);
    }
    console.log(octopuses.map(row => row.map(o => o.energy).join('')).join('\n'));
    return flashes;
}

const partTwo = (octopuses) => {
    let s = -1;
    let allFlashed = false;
    while (!allFlashed) {
        s++;
        allFlashed = true;
        simulateStep(octopuses);
        octopuses.forEach(row => {
            row.forEach(octopus => {
                if (!octopus.flashed) {
                    allFlashed = false;
                }
            });
        });
        if (allFlashed) {
            return s + 1;
        }
    }
}

// parts are destructive to the input
console.log(partOne(input, 100));
// console.log(partTwo(input));