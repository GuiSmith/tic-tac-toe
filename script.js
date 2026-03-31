const board = document.getElementById("board");
        const turnText = document.getElementById("turnText");

        let humanMark = "X";
        let aiMark = "O";
        let currentPlayer = "X";
        let gameActive = true;

        let gameState = ["", "", "", "", "", "", "", "", ""];

        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        function createBoard() {
            board.innerHTML = "";
            gameState.forEach((cell, index) => {
                const cellDiv = document.createElement("div");
                cellDiv.classList.add("cell");
                cellDiv.dataset.index = index;
                cellDiv.innerText = cell;
                cellDiv.addEventListener("click", handleCellClick);
                board.appendChild(cellDiv);
            });
        }

        function handleCellClick(e) {
            const index = e.target.dataset.index;

            if (gameState[index] !== "" || !gameActive || currentPlayer !== humanMark) return;

            makeMove(index, humanMark);

            if (gameActive) {
                currentPlayer = aiMark;
                turnText.innerText = "Vez da IA...";
                setTimeout(aiMove, 400);
            }
        }

        function makeMove(index, player) {
            gameState[index] = player;

            const cell = document.querySelector(`[data-index='${index}']`);
            cell.innerText = player;
            cell.classList.add(player.toLowerCase());

            checkWinner();
        }

        function checkWinner() {
            for (let combination of winningCombinations) {
                const [a, b, c] = combination;

                if (
                    gameState[a] &&
                    gameState[a] === gameState[b] &&
                    gameState[a] === gameState[c]
                ) {
                    turnText.innerText = `${gameState[a]} venceu!`;
                    gameActive = false;
                    return;
                }
            }

            if (!gameState.includes("")) {
                turnText.innerText = "Empate!";
                gameActive = false;
                return;
            }

            if (currentPlayer === humanMark) {
                turnText.innerText = "Vez de X";
            } else {
                turnText.innerText = "Vez da IA";
            }
        }

        // ===== MINIMAX =====

        function getEmptyIndexes(board) {
            return board
                .map((val, index) => val === "" ? index : null)
                .filter(v => v !== null);
        }

        function checkIfWinnerFound(board, player) {
            return winningCombinations.some(([a, b, c]) =>
                board[a] === player &&
                board[b] === player &&
                board[c] === player
            );
        }

        function minimax(board, player) {
            const emptySpots = getEmptyIndexes(board);

            if (checkIfWinnerFound(board, humanMark)) {
                return { score: -1 };
            } else if (checkIfWinnerFound(board, aiMark)) {
                return { score: 1 };
            } else if (emptySpots.length === 0) {
                return { score: 0 };
            }

            const moves = [];

            for (let i = 0; i < emptySpots.length; i++) {
                const move = {};
                move.index = emptySpots[i];

                board[emptySpots[i]] = player;

                if (player === aiMark) {
                    const result = minimax(board, humanMark);
                    move.score = result.score;
                } else {
                    const result = minimax(board, aiMark);
                    move.score = result.score;
                }

                board[emptySpots[i]] = "";
                moves.push(move);
            }

            let bestMove;

            if (player === aiMark) {
                let bestScore = -Infinity;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }

            return moves[bestMove];
        }

        function aiMove() {
            if (!gameActive) return;

            const bestMove = minimax(gameState, aiMark).index;
            makeMove(bestMove, aiMark);

            if (gameActive) {
                currentPlayer = humanMark;
                turnText.innerText = "Vez de X";
            }
        }

        function resetGame() {
            gameState = ["", "", "", "", "", "", "", "", ""];
            gameActive = true;
            currentPlayer = humanMark;
            turnText.innerText = "Vez de X";
            createBoard();
        }

        createBoard();