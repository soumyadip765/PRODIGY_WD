document.addEventListener('DOMContentLoaded', () => {
    const board = ['','','','','','','','',''];
    let currentPlayer = 'X';
    let gameActive = true;
    let gameMode = 'pvp';
    let difficulty = 'medium';
    
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const pvpButton = document.getElementById('pvp-btn');
    const pvcButton = document.getElementById('pvc-btn');
    const resetButton = document.getElementById('reset-btn');
    const difficultyContainer = document.getElementById('difficulty-container');
    const difficultyButtons = document.querySelectorAll('#difficulty-container button');
    
    const winningConditions = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // columns
        [0,4,8], [2,4,6] // diagonals
    ];
    
    // Initialize game
    function initGame() {
        boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
    
    // Handle cell click
    function handleCellClick(e) {
        const index = e.target.dataset.index;
        if (board[index] !== '' || !gameActive) return;
        
        board[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.classList.add(currentPlayer.toLowerCase());
        
        checkResult();
        
        if (gameMode === 'pvc' && gameActive && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
    
    // Check game result
    function checkResult() {
        let roundWon = false;
        
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                condition.forEach(i => 
                    document.querySelector(`[data-index="${i}"]`).classList.add('winner'));
                break;
            }
        }
        
        if (roundWon) {
            statusElement.innerHTML = `<i class="fas fa-trophy"></i> ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }
        
        if (!board.includes('')) {
            statusElement.innerHTML = `<i class="fas fa-handshake"></i> Draw!`;
            gameActive = false;
            return;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusElement.innerHTML = `<i class="fas fa-user"></i> ${currentPlayer}'s turn`;
    }
    
    // Computer move logic
    function computerMove() {
        let move;
        
        if (difficulty === 'easy') {
            move = getRandomMove();
        } 
        else if (difficulty === 'medium') {
            move = findWinningMove('O') || findWinningMove('X') || getRandomMove();
        } 
        else { // hard
            move = findWinningMove('O') || findWinningMove('X') || 
                  (board[4] === '' ? 4 : getBestCorner());
        }
        
        if (move !== -1) {
            const cell = document.querySelector(`[data-index="${move}"]`);
            board[move] = 'O';
            cell.textContent = 'O';
            cell.classList.add('o');
            checkResult();
        }
    }
    
    // Helper functions for computer moves
    function findWinningMove(player) {
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            if (board[a] === player && board[b] === player && board[c] === '') return c;
            if (board[a] === player && board[c] === player && board[b] === '') return b;
            if (board[b] === player && board[c] === player && board[a] === '') return a;
        }
        return null;
    }
    
    function getRandomMove() {
        const emptyCells = board.map((cell, i) => cell === '' ? i : null).filter(val => val !== null);
        return emptyCells.length ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : -1;
    }
    
    function getBestCorner() {
        const corners = [0, 2, 6, 8];
        const emptyCorners = corners.filter(i => board[i] === '');
        return emptyCorners.length ? emptyCorners[Math.floor(Math.random() * emptyCorners.length)] : getRandomMove();
    }
    
    // Reset game
    function resetGame() {
        board.fill('');
        currentPlayer = 'X';
        gameActive = true;
        statusElement.innerHTML = `<i class="fas fa-user"></i> X's turn`;
        initGame();
    }
    
    // Set game mode
    function setGameMode(mode) {
        gameMode = mode;
        pvpButton.classList.toggle('active', mode === 'pvp');
        pvcButton.classList.toggle('active', mode === 'pvc');
        
        // Show/hide difficulty options
        if (mode === 'pvc') {
            difficultyContainer.classList.add('visible');
        } else {
            difficultyContainer.classList.remove('visible');
        }
        
        resetGame();
    }
    
    // Set difficulty
    function setDifficulty(level) {
        difficulty = level;
        difficultyButtons.forEach(btn => 
            btn.classList.toggle('active', btn.dataset.difficulty === level));
    }
    
    // Event listeners
    pvpButton.addEventListener('click', () => setGameMode('pvp'));
    pvcButton.addEventListener('click', () => setGameMode('pvc'));
    resetButton.addEventListener('click', resetGame);
    difficultyButtons.forEach(btn => 
        btn.addEventListener('click', () => setDifficulty(btn.dataset.difficulty)));
    
    // Start game
    initGame();
});