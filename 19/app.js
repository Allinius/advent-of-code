const fs = require('fs');
const arrayUtils = require('../common/array-utils');
const vec3d = require('../common/vec3d');

const parseInput = (fileName) => {
    return fs.readFileSync(fileName, 'utf8').split('\n\n').map((scannerInput) => 
        scannerInput.split('\n').filter((line, i) => i !== 0).map(line => {
            const parts = line.split(',');
            return {
                x: parseInt(parts[0]),
                y: parseInt(parts[1]),
                z: parseInt(parts[2]),
                distances: new Map()
            }
        })
    );
}

const smallInput = parseInput('input-small.txt');
const input = parseInput('input.txt');

const findAllOrientations =  () => {
    const vec = {
        x: 1,
        y: 2,
        z: 3
    };
    let orientations = [];
    for (let xr = 0; xr < 4; xr++) {
        for (let yr = 0; yr < 4; yr++) {
            for (let zr = 0; zr < 4; zr++) {
                newVec = vec3d.rotate(vec, xr, yr, zr);
                if (!orientations.find(o => o.x === newVec.x && o.y === newVec.y && o.z === newVec.z)) {
                    orientations.push(newVec);
                }
            }
        }
    }
    return orientations;
}

const applyOrientation = (vec, orientation) => {
    const xSign = Math.sign(orientation.x);
    const ySign = Math.sign(orientation.y);
    const zSign = Math.sign(orientation.z);
    const axes = ['', 'x', 'y', 'z'];
    const mapping = {
        x: axes[Math.abs(orientation.x)],
        y: axes[Math.abs(orientation.y)],
        z: axes[Math.abs(orientation.z)],
    };
    return {
        ...vec,
        x: xSign * vec[mapping.x],
        y: ySign * vec[mapping.y],
        z: zSign * vec[mapping.z]
    };
}

const recalculateDistances = (scanner) => {
    scanner.forEach((beacon) => {
        beacon.distances = new Map();
    });
    scanner.forEach((beacon1, i) => {
        scanner.forEach((beacon2, j) => {
            if (i !== j) {
                beacon1.distances.set(j, vec3d.manhattanDistance(beacon1, beacon2))
            }
        })
    });
}

const partOne = (scanners) => {
    scanners.forEach(scanner => {
        recalculateDistances(scanner);
    });
    const orientations = findAllOrientations();

    const scanner1 = scanners[0];
    let remainingScanners = scanners.slice(1);
    let scannerPositions = [
        {x: 0, y: 0, z: 0}
    ];
    while (remainingScanners.length > 0) {
        for (let si = 0; si < remainingScanners.length; si++) {
            const scanner2 = remainingScanners[si];
            
            let beacon1;
            let beacon2;
            let intersection;
            let foundMatch = false;
            for (let i = 0; i < scanner1.length; i++) {
                beacon1 = scanner1[i];
                const distArray1 = Array.from(beacon1.distances.values());
                for (let j = 0; j < scanner2.length; j++) {
                    beacon2 = scanner2[j];
                    const distArray2 = Array.from(beacon2.distances.values());
                    intersection = arrayUtils.intersection(distArray1, distArray2)
                    if (intersection.length >= 11) {
                        foundMatch = true;
                        break;
                    }
                }
                if (foundMatch) {
                    break;
                }
            }

            // find the correct orientation
            let scanner2From1 = [];
            let foundOrientation = false;
            for (let i = 0; i < orientations.length; i++) {
                const rotated2 = scanner2.map(b => applyOrientation(b, orientations[i]));
                const offset = vec3d.difference(beacon1, applyOrientation(beacon2, orientations[i]));
                let passCount = 0;
                for (let j = 0; j < scanner1.length; j++) {
                    for (let k = 0; k < rotated2.length; k++) {
                        if (vec3d.eq(scanner1[j],vec3d.add(rotated2[k], offset))) {
                            passCount++;
                        }
                    }
                }
                if (passCount >= 12) {
                    foundOrientation = true;
                    scanner2From1 = rotated2.map(b => vec3d.add(b, offset));
                    scannerPositions.push(offset);
                    scanner2From1.forEach(beacon => {
                        if (!scanner1.find(b => b.x === beacon.x && b.y === beacon.y && b.z === beacon.z)) {
                            scanner1.push(beacon);
                        }
                    });
                    recalculateDistances(scanner1);
                    break;
                }
            }

            if (foundOrientation) {
                remainingScanners.splice(si, 1);
            }
        }
    }
    let maxScannerDistance = 0;
    scannerPositions.forEach(scanner1 => {
        scannerPositions.forEach(scanner2 => {
            maxScannerDistance = Math.max(maxScannerDistance, vec3d.manhattanDistance(scanner1, scanner2));
        })
    })
    return {beaconCount: scanner1.length, maxScannerDistance };
}

console.log(partOne(smallInput));
console.log(partOne(input));
