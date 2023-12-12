const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    return fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => {
            const [springs, template] = line.split(' ');
            return {
                springs: springs,
                template: template.split(',').map((c) => Number.parseInt(c)),
            };
        });
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = (rows) => {
    return rows.reduce(
        (acc, row) => acc + countValidArrangements(row.springs, row.template),
        0
    );
};

const partTwo = (rows) => {
    return rows.reduce(
        (acc, row) =>
            acc +
            countValidArrangements(
                `${row.springs}?${row.springs}?${row.springs}?${row.springs}?${row.springs}`,
                [
                    ...row.template,
                    ...row.template,
                    ...row.template,
                    ...row.template,
                    ...row.template,
                ]
            ),
        0
    );
};

const countValidArrangements = (row, template) => {
    const count = countValidInner(row, template);
    // console.log(row, count);
    return count;
};

const resultMap = new Map();
const countValidInner = (row, template) => {
    if (resultMap.has(row + template.join())) {
        return resultMap.get(row + template.join());
    }

    // trim dots
    if (row.startsWith('.')) {
        const result = countValidInner(row.replace(/^\.+|\.+$/g, ''), template);
        resultMap.set(row + template.join(), result);
        return result;
    }
    if (template.length === 0) {
        const result = row.indexOf('#') >= 0 ? 0 : 1;
        resultMap.set(row + template.join(), result);
        return result;
    }
    if (row.length < template.reduce((acc, count) => acc + count)) {
        return 0;
    }

    let result = 0;
    if (
        row.slice(0, template[0]).indexOf('.') === -1 &&
        (row.length === template[0] || row[template[0]] !== '#')
    ) {
        result += countValidInner(
            row.slice(template[0] + 1),
            template.slice(1)
        );
    }
    if (row.startsWith('?')) {
        result += countValidInner(row.slice(1), template);
    }

    resultMap.set(row + template.join(), result);
    return result;
};

assert.equal(partOne(inputSmall), 21);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 525152);
console.log(partTwo(input));
