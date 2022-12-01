const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf-8').split(',').map(n => parseInt(n));

const createEmptyFishBook = () => {
    const fishBook = [];
    for (let i = 0; i < 9; i++) {
        fishBook[i] = 0;
    }
    return fishBook;
}

const createFishBook = (fish) => {
    const fishBook = createEmptyFishBook();
    fish.forEach(f => {
        fishBook[f]++;
    });
    return fishBook;
}

const simulateFish = (fish, days) => {
    let fishBook = createFishBook(fish);

    for (let day = 0; day < days; day++) {
        let newFishBook = createEmptyFishBook();
        fishBook.forEach((fishCount, daysRemaining) => {
            if (daysRemaining === 0) {
                newFishBook[8] += fishCount;
                newFishBook[6] += fishCount;
            } else {
                newFishBook[daysRemaining - 1] += fishCount;
            }
        });
        fishBook = newFishBook;
    }
    return fishBook;
}

const countFish = (fishBook) => {
    return fishBook.reduce((prev, curr) => prev + curr);
}

const partOne = (fish) => {
    const finalFishBook = simulateFish(fish, 80);
    return countFish(finalFishBook);
}
const partTwo = (fish) => {
    const finalFishBook = simulateFish(fish, 256);
    return countFish(finalFishBook);
}

console.log(partOne(input));
console.log(partTwo(input));
