const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const [startPart, velocityPart] = line.split(' @ ');
            const [x, y, z] = startPart.split(', ').map(Number);
            const [vx, vy, vz] = velocityPart.split(', ').map(Number);
            return {
                start: { x, y, z },
                velocity: { x: vx, y: vy, z: vz },
            };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (rays, min, max) => {
    let count = 0;
    rays.forEach((first, index) => {
        if (index === rays.length - 1) {
            return;
        }
        rays.slice(index + 1).forEach((second) => {
            const intersection = getRayIntersection(first, second);
            if (
                intersection &&
                intersection.x >= min &&
                intersection.x <= max &&
                intersection.y >= min &&
                intersection.y <= max
            ) {
                count++;
            }
        });
    });
    return count;
};

const getRayIntersection = (first, second) => {
    const secondTime =
        (first.velocity.x * (second.start.y - first.start.y) +
            first.velocity.y * (first.start.x - second.start.x)) /
        (first.velocity.y * second.velocity.x -
            first.velocity.x * second.velocity.y);
    // intersection happened in the past
    if (
        secondTime < 0 ||
        Number.isNaN(secondTime) ||
        secondTime === Number.POSITIVE_INFINITY ||
        secondTime === Number.NEGATIVE_INFINITY
    ) {
        return;
    }
    const x = second.start.x + secondTime * second.velocity.x;
    const y = second.start.y + secondTime * second.velocity.y;
    const firstTime = (x - first.start.x) / first.velocity.x;
    if (
        firstTime < 0 ||
        Number.isNaN(firstTime) ||
        firstTime === Number.POSITIVE_INFINITY ||
        firstTime === Number.NEGATIVE_INFINITY
    ) {
        return;
    }
    return { x, y, firstTime, secondTime };
};

const partTwo = (rays, findAll) => {
    const velMax = rays.reduce(
        (result, ray) =>
            Math.max(
                result,
                Math.abs(
                    Math.min(ray.velocity.x, ray.velocity.y, ray.velocity.z)
                ),
                Math.abs(
                    Math.max(ray.velocity.x, ray.velocity.y, ray.velocity.z)
                )
            ),
        0
    );

    for (let vx = -velMax; vx <= velMax; vx++) {
        for (let vy = -velMax; vy <= velMax; vy++) {
            const adjustedRays = rays.map((ray) => ({
                ...ray,
                velocity: {
                    x: ray.velocity.x - vx,
                    y: ray.velocity.y - vy,
                },
            }));
            const intersection = getRayIntersection(
                adjustedRays[0],
                adjustedRays[1]
            );
            if (
                intersection &&
                Number.isInteger(intersection.x) &&
                Number.isInteger(intersection.y)
            ) {
                const someFail = adjustedRays.slice(2).some((second, i) => {
                    const secondIntersection = getRayIntersection(
                        adjustedRays[0],
                        second
                    );
                    return !(
                        secondIntersection &&
                        bigNumberEqual(secondIntersection.x, intersection.x) &&
                        bigNumberEqual(secondIntersection.y, intersection.y)
                    );
                });
                if (!someFail) {
                    firstRealRayIntersection = {
                        x:
                            rays[0].start.x +
                            intersection.firstTime * rays[0].velocity.x,
                        y:
                            rays[0].start.y +
                            intersection.firstTime * rays[0].velocity.y,
                        z:
                            rays[0].start.z +
                            intersection.firstTime * rays[0].velocity.z,
                    };
                    secondRealRayIntersection = {
                        x:
                            rays[1].start.x +
                            intersection.secondTime * rays[1].velocity.x,
                        y:
                            rays[1].start.y +
                            intersection.secondTime * rays[1].velocity.y,
                        z:
                            rays[1].start.z +
                            intersection.secondTime * rays[1].velocity.z,
                    };
                    const rockStartPos = {
                        x:
                            firstRealRayIntersection.x -
                            intersection.firstTime * vx,
                        y:
                            firstRealRayIntersection.y -
                            intersection.firstTime * vy,
                        z:
                            (intersection.firstTime *
                                secondRealRayIntersection.z -
                                intersection.secondTime *
                                    firstRealRayIntersection.z) /
                            (intersection.firstTime - intersection.secondTime),
                    };
                    console.log('found candidate');
                    console.log(rockStartPos.x, rockStartPos.y, rockStartPos.z);
                    if (!findAll) {
                        return rockStartPos.x + rockStartPos.y + rockStartPos.z;
                    }
                }
            }
        }
    }
    return;
};

const bigNumberEqual = (a, b) => {
    return Math.abs(a - b) <= 0.4;
};

assert.equal(partOne(inputSmall, 7, 27), 2);
console.log(partOne(input, 200000000000000, 400000000000000));
assert.equal(partTwo(inputSmall), 47);
console.log(partTwo(input, true));
