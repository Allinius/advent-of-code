const { log } = require('console');
const fs = require('fs');

const parseInput = (fileName) => {
    return fs.readFileSync(fileName, 'utf8').split('\n').map(line => {
        const parts = line.split(' ')
        return {
            op: parts[0],
            first: parts[1],
            second: Number.isInteger(Number.parseInt(parts[2])) ? Number.parseInt(parts[2]) : parts[2],
        }
    })
}

const input = parseInput('input.txt');

const getNextZ = (z, w, a, b, c) => {
    let x = z % 26;
    z = Math.trunc(z / a);
    x = (x + b) === w ? 0 : 1;
    let y = 25 * x + 1;
    z *= y;
    y = (w + c) * x;
    return z + y;
}

const findMonad = (length, z, a, b, c, cache, minMax = 'max') => {
    const varIndex = 14 - length;
    const start = minMax === 'max' ? 9 : 1;
    const end = minMax === 'max' ? 0: 10;
    const sign = minMax === 'max' ? -1 : 1;

    if (length === 1) {
        for (let w = start; w !== end; w += sign) {
            const nextZ = getNextZ(z, w, a[varIndex], b[varIndex], c[varIndex])
            if (nextZ === 0) {
                cache[length].set(z, w);
                return w;
            }
        }
        cache[length].set(z, 0);
        return 0;
    }

    for (let w = start; w !== end; w += sign) {
        const nextZ = getNextZ(z, w, a[varIndex], b[varIndex], c[varIndex]);
        let currMonad;
        if (cache[length - 1].get(nextZ) != null) {
            currMonad = cache[length - 1].get(nextZ);
        } else {
            currMonad = findMonad(length - 1, nextZ, a, b, c, cache, minMax);
        }
        if (currMonad !== 0) {
            currMonad = Number.parseInt('' + w + currMonad);
            cache[length].set(z, currMonad);
            return currMonad;
        }
    }
    cache[length].set(z, 0);
    return 0;
}

const solve = (instructions) => {
    // const a = [1, 1, 1, 26, 1, 1, 26, 1, 1, 26, 26, 26, 26, 26];
    const a = instructions.filter(
        i => i.op === 'div' && i.first === 'z'
    ).map(i => i.second);
    // const b = [12, 11, 14, -6, 15, 12, -9, 14, 14, -5, -9, -5, -2, -7];
    const b = instructions.filter(
        i => i.op === 'add' && i.first === 'x' && Number.isInteger(i.second)
    ).map(i => i.second);
    // const c = [4, 10, 12, 14, 6, 16, 1, 7, 8, 11, 8, 3, 1, 8];
    const c = instructions.filter(
        i => i.op === 'add' && i.first === 'y' && Number.isInteger(i.second)
    ).filter((_, i) => i % 3 === 2).map(i => i.second);

    const cache1 = [];
    const cache2 = [];
    for (let i = 1; i <= 14; i++) {
        cache1[i] = new Map();
        cache2[i] = new Map();
    }
    return {
        max: findMonad(14, 0, a, b, c, cache1),
        min: findMonad(14, 0, a, b, c, cache2, 'min')
    }
}

console.log(solve(input));
