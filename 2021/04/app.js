const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf-8').split('\n\n');
const numbers = input.splice(0,1)[0].split(',').map(n => parseInt(n));
const boards = input.map(b => b.split('\n'));
boards.forEach(board => {
   for (let i = 0; i < board.length; i++) {
       board[i] = board[i].split(' ').filter(n => n !== '').map(n => parseInt(n));
   } 
});

const initScores = (boards) => {
    const boardScores = [];
    const numberMap = new Map();
    const boardSize = boards[0].length;
    const fullScores = [];
    for (let i = 0; i < boardSize; i++) {
        fullScores.push(boardSize);
    }

    boards.forEach((board, boardIndex) => {
        boardScores.push({
            rowScores: [...fullScores],
            colScores: [...fullScores],
            unmarkedScore: 0
        });
        board.forEach((row, y) => {
            row.forEach((col, x) => {
                boardScores[boardIndex].unmarkedScore += col;

                if (numberMap.has(col)) {
                    numberMap.get(col).push({boardIndex, x, y});
                } else {
                    numberMap.set(col, [{boardIndex, x, y}]);
                }
            });
        });
    });
    return [
        boardScores,
        numberMap
    ];
}

const simulateBingo = (boards, numbers) => {
    const [boardScores, numberMap] = initScores(boards);

    const winners = [];
    for (let i = 0; i < numbers.length; i++) {
        const number = numbers[i];
        if (numberMap.has(number)) {
            const coords = numberMap.get(number);
            coords.forEach(coord => {
                if (winners.findIndex(w => w.board === coord.boardIndex) === -1) {
                    const boardScore = boardScores[coord.boardIndex];
                    boardScore.unmarkedScore -= number;
                    if (--boardScore.rowScores[coord.x] === 0) {
                        winners.push({
                            board: coord.boardIndex,
                            winningNumber: number,
                            unmarkedScore: boardScore.unmarkedScore,
                            finalScore: boardScore.unmarkedScore * number
                        });
                    }
                    if (--boardScore.colScores[coord.y] === 0) {
                        winners.push({
                            board: coord.boardIndex,
                            winningNumber: number,
                            unmarkedScore: boardScore.unmarkedScore,
                            finalScore: boardScore.unmarkedScore * number
                        });
                    }
                }
            });
        }
    }
    return winners;
}
const results = simulateBingo(boards, numbers);
console.log(results[0]);
console.log(results[results.length-1])
