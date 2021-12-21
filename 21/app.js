class DeterministicDie {
    constructor() {
        this.nextRoll = 0;
        this.sideCount = 100;
        this.timesRolled = 0;
    }

    rollDie(times = 1) {
        let result = 0;
        for (let i = 0; i < times; i++) {
            this.timesRolled++;
            result += this.nextRoll++ % this.sideCount + 1;
        }
        return result;
    }
}

const partOne = (start1, start2) => {
    let positions = [start1 - 1, start2 - 1];
    let scores = [0, 0];
    let playerTurn = 0;
    const die = new DeterministicDie();
    while (scores[0] < 1000 && scores[1] < 1000) {
        const roll = die.rollDie(3);
        positions[playerTurn] = (positions[playerTurn] + roll) % 10;
        scores[playerTurn] += positions[playerTurn] + 1;
        playerTurn = (playerTurn + 1) % 2;
    }
    return Math.min(...scores) * die.timesRolled;
}

const getMapKey = (positions, scores) => {
    return `${positions[0]},${positions[1]},${scores[0]},${scores[1]}`;
}
const decodeMapKey = (key) => {
    const parts = key.split(',');
    const positions = [ parseInt(parts[0]), parseInt(parts[1]) ];
    const scores = [ parseInt(parts[2]), parseInt(parts[3]) ];

    return { positions, scores };
}

const partTwo = (start1, start2) => {
    const rollSplits = [,,,1,3,6,7,6,3,1];
    let gameStates = new Map();
    gameStates.set(getMapKey([start1 - 1, start2 - 1], [0,0]), 1);
    let currPlayer = 0;
    const wins = [0, 0];
    while (Array.from(gameStates.keys()).length > 0) {
        let newStates = new Map();
        gameStates.forEach((universeCount, key) => {
            const state = decodeMapKey(key);
            for (let rollResult = 3; rollResult <= 9; rollResult++) {
                const newPositions = [...state.positions];
                const newScores = [...state.scores];
                newPositions[currPlayer] = (newPositions[currPlayer] + rollResult) % 10;
                newScores[currPlayer] += newPositions[currPlayer] + 1;
                const rollUniverseCount = universeCount * rollSplits[rollResult];
                if (newScores[currPlayer] >= 21) {
                    wins[currPlayer] += rollUniverseCount;
                } else {
                    const key = getMapKey(newPositions, newScores);
                    if (newStates.get(key) != null) {
                        newStates.set(key, newStates.get(key) + rollUniverseCount);
                    } else {
                        newStates.set(key, rollUniverseCount);
                    }
                }
            }
        });
        gameStates = newStates;
        currPlayer = (currPlayer + 1) % 2;
    }
    return wins;
}

console.log(partOne(4, 8));
console.log(partOne(10, 8));
console.log(partTwo(4, 8));
console.log(partTwo(10, 8));
