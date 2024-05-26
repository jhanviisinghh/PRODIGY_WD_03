// script.js
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let mode = 'player'; // 'player' or 'ai'
let scores = { X: 0, O: 0 };

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const playerXScoreDisplay = document.getElementById('playerXScore');
const playerOScoreDisplay = document.getElementById('playerOScore');
const modeRadios = document.querySelectorAll('input[name="mode"]');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    checkResult();

    if (gameActive && mode === 'ai' && currentPlayer === 'O') {
        aiMove();
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        scores[currentPlayer]++;
        updateScores();
        return;
    }

    if (!board.includes('')) {
        statusDisplay.textContent = 'Game ended in a draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = '');
}

function aiMove() {
    let bestMove = getBestMove();
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    checkResult();
}

function getBestMove() {
    // Check if AI can win in the next move
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWin('O')) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }
    // Check if player can win in the next move, block it
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWin('X')) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }
    // Otherwise, pick a random empty cell
    let emptyCells = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function checkWin(player) {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return board[index] === player;
        });
    });
}

function updateScores() {
    playerXScoreDisplay.textContent = scores.X;
    playerOScoreDisplay.textContent = scores.O;
}

function handleModeChange(event) {
    mode = event.target.value;
    resetGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
modeRadios.forEach(radio => radio.addEventListener('change', handleModeChange));

statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
updateScores();
