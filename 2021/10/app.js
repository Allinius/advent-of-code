const fs = require('fs');

const smallInput = fs.readFileSync('input-small.txt', 'utf-8').replace(/\r/g, "").split('\n');
const input = fs.readFileSync('input.txt', 'utf-8').replace(/\r/g, "").split('\n');

const solve = (lines) => {
    const partOneScores = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137
    };
    const partTwoScores = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4
    };
    let score1 = 0;
    let scores2 = [];
    lines.forEach(line => {
        let i = -1;
        let bracketStack = [];
        let invalidPosition = -1;
        while (++i < line.length && invalidPosition === -1) {
            switch (line[i]) {
                case '(':
                    bracketStack.push(')');
                    break;
                case '[':
                    bracketStack.push(']');
                    break;
                case '{':
                    bracketStack.push('}');
                    break;
                case '<':
                    bracketStack.push('>');
                    break;
                default:
                    if (bracketStack.pop() !== line[i]) {
                        invalidPosition = i;
                    }
            }
        }
        if (invalidPosition !== -1) {
            score1 += partOneScores[line[invalidPosition]];
        } else {
            bracketStack.reverse();
            let lineScore = 0;
            bracketStack.forEach(b => {
                lineScore *= 5;
                lineScore += partTwoScores[b]
            });
            scores2.push(lineScore);
        }
    });
    const score2 = scores2.sort((a, b) => a - b)[Math.floor(scores2.length/2)];
    return { score1, score2 };
};

console.log(solve(input));