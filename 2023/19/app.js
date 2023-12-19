const fs = require('fs');
const assert = require('assert');

const parseInput = (fileName) => {
    const [ruleBlock, partsBlock] = fs
        .readFileSync(fileName, 'utf-8')
        .replace(/\r/g, '')
        .split('\n\n');

    const rules = ruleBlock.split('\n').map((line) => {
        const [name, rest] = line.slice(0, -1).split('{');
        const conditions = rest.split(',').map((part) => {
            const operator =
                part.indexOf('<') >= 0
                    ? '<'
                    : part.indexOf('>') >= 0
                    ? '>'
                    : null;
            if (!operator) {
                return { conditionFun: () => part, resultName: part };
            }
            const [first, result] = part.split(':');
            const [category, valStr] = first.split(operator);
            const threshold = parseInt(valStr);
            return {
                conditionFun: (inputPart) =>
                    (operator === '>' && inputPart[category] > threshold) ||
                    (operator === '<' && inputPart[category] < threshold)
                        ? result
                        : null,
                category,
                operator,
                threshold,
                resultName: result,
            };
        });
        return {
            name,
            conditions,
            next: (inputPart) =>
                conditions.reduce(
                    (res, con) => res || con.conditionFun(inputPart),
                    null
                ),
        };
    });
    rules.forEach((rule) => {
        rule.connections = rule.conditions.reduce((conObj, { resultName }) => {
            if (resultName === 'A' || resultName === 'R') {
                conObj[resultName] = resultName;
                return conObj;
            }
            conObj[resultName] = rules.find((r) => r.name === resultName);
            return conObj;
        }, {});
    });

    const parts = partsBlock
        .split('\n')
        .map((line) =>
            JSON.parse(
                line
                    .replaceAll('=', ':')
                    .replaceAll('x', '"x"')
                    .replaceAll('m', '"m"')
                    .replaceAll('a', '"a"')
                    .replaceAll('s', '"s"')
            )
        );
    return { rules, parts };
};

const inputSmall = parseInput('input-small.txt');
const input = parseInput('input.txt');

const partOne = ({ rules, parts }) => {
    const firstRule = rules.find((r) => r.name === 'in');
    return parts.reduce(
        (acc, part) =>
            evaluatePart(part, firstRule) ? acc + partVal(part) : acc,
        0
    );
};

evaluatePart = (part, rule) => {
    let curr = rule;
    while (curr !== 'A' && curr !== 'R') {
        curr = curr.connections[curr.next(part)];
    }
    return curr === 'A' ? true : false;
};

partVal = (part) => {
    return part.x + part.m + part.a + part.s;
};

const partTwo = ({ rules, parts }) => {
    const firstRule = rules.find((r) => r.name === 'in');
    return countAccepted(firstRule, {
        x: { min: 1, max: 4000 },
        m: { min: 1, max: 4000 },
        a: { min: 1, max: 4000 },
        s: { min: 1, max: 4000 },
    });
};

countAccepted = (current, constraints) => {
    if (current === 'A') {
        // may need to check for negative ranges?
        return (
            (constraints.x.max - constraints.x.min + 1) *
            (constraints.m.max - constraints.m.min + 1) *
            (constraints.a.max - constraints.a.min + 1) *
            (constraints.s.max - constraints.s.min + 1)
        );
    }
    if (current === 'R') {
        return 0;
    }
    let count = 0;
    const constraintAcc = JSON.parse(JSON.stringify(constraints));
    current.conditions.forEach((condition) => {
        if (!condition.category) {
            count += countAccepted(
                current.connections[condition.resultName],
                JSON.parse(JSON.stringify(constraintAcc))
            );
            return;
        } else if (condition.operator === '<') {
            const newConstraint = JSON.parse(JSON.stringify(constraintAcc));
            newConstraint[condition.category].max = Math.min(
                condition.threshold - 1,
                newConstraint[condition.category].max
            );
            constraintAcc[condition.category].min = Math.max(
                condition.threshold,
                newConstraint[condition.category].min
            );
            count += countAccepted(
                current.connections[condition.resultName],
                newConstraint
            );
        } else if (condition.operator === '>') {
            const newConstraint = JSON.parse(JSON.stringify(constraintAcc));
            newConstraint[condition.category].min = Math.max(
                condition.threshold + 1,
                newConstraint[condition.category].min
            );
            constraintAcc[condition.category].max = Math.min(
                condition.threshold,
                newConstraint[condition.category].max
            );
            count += countAccepted(
                current.connections[condition.resultName],
                newConstraint
            );
        } else {
            console.log('error');
        }
    });
    return count;
};

assert.equal(partOne(inputSmall), 19114);
console.log(partOne(input));
assert.equal(partTwo(inputSmall), 167409079868000);
console.log(partTwo(input));
