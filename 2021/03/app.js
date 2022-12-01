const fs = require('fs');

const smallInput = fs.readFileSync('input-small.txt', 'utf-8').replace(/\r/g, "").split('\n').map(s => s.split('').map(b => parseInt(b)));
const input = fs.readFileSync('input.txt', 'utf-8').replace(/\r/g, "").split('\n').map(s => s.split('').map(b => parseInt(b)));

const countMajorityBitColumn = (binNums, colIndex) => {
    const halfCount = binNums.length / 2;
    return binNums.map(row => row[colIndex]).reduce((prev, curr) => prev + curr) >= halfCount ? 1 : 0;
}

const countMajorityBits = (binNums) => {
    const majorityBits = [];
    binNums[0].forEach((_, bitIndex) => {
        majorityBits.push(countMajorityBitColumn(binNums, bitIndex));
    });
    return majorityBits;
}

const partOne = (bitNums) => {
    const gamma = countMajorityBits(bitNums);
    const epsilon = gamma.map(bit => bit === 1 ? 0 : 1);
    
    return {
        gamma,
        epsilon,
        powerConsumption: parseInt(gamma.join(''), 2) * parseInt(epsilon.join(''), 2)
    }
}

const findRating = (binNums, criteria) => {
    let candidates = [...binNums];
    let bitIndex = 0;
    while (candidates.length > 1) {
        let newCandidates = [];

        const majorityBit = countMajorityBitColumn(candidates, bitIndex);
        candidates.forEach(candidate => {
            if (criteria(candidate[bitIndex], majorityBit)) {
                newCandidates.push(candidate);
            }
        })

        bitIndex++;
        if (bitIndex > candidates[0].length) {
            console.log('something went wrong');
            break;
        }
        candidates = [...newCandidates];
    }
    return candidates.length > 0 ? parseInt(candidates[0].join(''), 2) : null;
}

const partTwo = (binNums) => {
    const oxygenRating = findRating(binNums, (candidateBit, majorityBit) => candidateBit === majorityBit);
    const co2Rating = findRating(binNums, (candidateBit, majorityBit) => candidateBit !== majorityBit);

    return {
        oxygenRating,
        co2Rating,
        result: oxygenRating * co2Rating
    }
}

console.log(partOne(input));
console.log(partTwo(input));
