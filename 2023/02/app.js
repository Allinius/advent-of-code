const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) =>
            line
                .split(': ')[1]
                .split('; ')
                .map((pull) =>
                    pull.split(', ').map((cubes) => {
                        const parts = cubes.split(' ');
                        return {
                            count: Number(parts[0]),
                            color: parts[1],
                        };
                    })
                )
        );
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (games) => {
    const limit = {
        red: 12,
        green: 13,
        blue: 14,
    };
    return games.reduce((sum, pulls, index) => {
        if (
            !pulls.find((pull) =>
                pull.find((cubes) => cubes.count > limit[cubes.color])
            )
        ) {
            return sum + index + 1;
        }
        return sum;
    }, 0);
};

const partTwo = (games) => {
    return games.reduce((power, pulls, index) => {
        const max = {
            red: 0,
            green: 0,
            blue: 0,
        };
        pulls.forEach((pull) =>
            pull.forEach((cubes) => {
                if (cubes.count > max[cubes.color]) {
                    max[cubes.color] = cubes.count;
                }
            })
        );

        return power + max.red * max.green * max.blue;
    }, 0);
};

assert.equal(partOne(inputSmall), 8);
console.log(partOne(input));

assert.equal(partTwo(inputSmall), 2286);
console.log(partTwo(input));
