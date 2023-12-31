   window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const playWithAIButton = document.querySelector('#playWithAI');
    const playWithFriendButton = document.querySelector('#playWithFriend');
    const announcer = document.querySelector('.announcer');
    const gameContainer = document.querySelector('.container'); 
    const controlsSection = document.querySelector('.controls');

    gameContainer.style.display = 'none'; // Initially, hide the game board


    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = false;
    let isAIEnabled = false;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

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

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        if (!board.includes(''))
            announce(TIE);
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won🥳';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won🥳';
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }
        return true;
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();

            if (isAIEnabled && isGameActive && currentPlayer === 'O') {
                const aiIndex = computerMove();
                const aiTile = tiles[aiIndex];
                setTimeout(() => {
                    userAction(aiTile, aiIndex);
                }, 1000); // Delay for a more realistic AI move
            }
        }
    }

    const computerMove = () => {
        // Check for a winning move for the AI
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                if (checkWin('O')) {
                    return i;
                }
                board[i] = '';
            }
        }

        // Check for a winning move for the player and block it
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                if (checkWin('X')) {
                    board[i] = 'O';
                    return i;
                }
                board[i] = '';
            }
        }

        // Choose a random empty tile
        const emptyTiles = board.reduce((acc, cell, index) => {
            if (cell === '') {
                acc.push(index);
            }
            return acc;
        }, []);

        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        return emptyTiles[randomIndex];
    }

    const checkWin = (player) => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    }

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');
        currentPlayer = 'X';
        playWithAIButton.disabled = false;
        playWithFriendButton.disabled = false;

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });

        if (isAIEnabled && currentPlayer === 'O') {
            // AI's turn (delayed for a more realistic move)
            setTimeout(() => {
                const aiIndex = computerMove();
                const aiTile = tiles[aiIndex];
                userAction(aiTile, aiIndex);
            }, 1000);
        }
    };

    playWithAIButton.addEventListener('click', () => {
        isAIEnabled = true;
        playWithAIButton.disabled = true;
        playWithFriendButton.disabled = true;
        isGameActive = true;
        gameContainer.style.display = 'grid';
        controlsSection.style.display = 'none';
        document.querySelector('.display').style.display = 'block'; // Show player's turn display
        resetBoard();
    });

    playWithFriendButton.addEventListener('click', () => {
        isAIEnabled = false;
        playWithAIButton.disabled = true;
        playWithFriendButton.disabled = true;
        isGameActive = true;
        gameContainer.style.display = 'grid';
        document.querySelector('.display').style.display = 'block'; // Show player's turn display
        controlsSection.style.display = 'none';
        resetBoard();
    });


    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', () => {
        isGameActive = true;
        gameContainer.style.display = 'grid';
        controlsSection.style.display = 'none';
        resetBoard();
    });
});

