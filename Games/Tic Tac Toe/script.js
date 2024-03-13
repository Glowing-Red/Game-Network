const canvas = document.querySelector('.gameBoard');
let gameOver = false;

function SetupTicTacToe(gridSize) {
   while (canvas.firstChild) {
      canvas.removeChild(canvas.firstChild);
   }

   gameOver = false;

   if (gridSize < 3) {
      gridSize = 3
   } else if (gridSize > 8) {
      gridSize = 8
   }

   const gameBoard = [];
   let flag = 1;

   for (let row = 0; row < gridSize; row++) {
      const rowArray = []
      const currentRow = document.createElement("div");
      currentRow.classList.add("row");
      canvas.appendChild(currentRow);

      for (let cell = 0; cell < gridSize; cell++) {
         const cellInput = document.createElement("input");
         cellInput.type = "text";
         cellInput.classList.add("cell");
         cellInput.readOnly = true;
         cellInput.style.width = `${currentRow.offsetWidth / gridSize - 5}px`;
         cellInput.style.height = `${currentRow.offsetWidth / gridSize - 5}px`;
         cellInput.style.fontSize = cellInput.style.width;
         
         rowArray.push([-1, cellInput]);
         
         cellInput.onclick = function() {
            if (gameBoard[row][cell][0] === -1 && !gameOver) {
               gameBoard[row][cell][0] = flag;
               cellInput.value = flag == 1 ? "X" : "O";

               const hasWon = [
                  checkWin(row, cell, 0, 1, flag), // Horizontal Direction
                  checkWin(row, cell, 1, 0, flag), // Vertical Direction
                  checkWin(row, cell, 1, 1, flag), // Diagonal Left Direction
                  checkWin(row, cell, 1, -1, flag) // Diagonal Right Direction
               ];
               
               if (hasWon.some(result => result[0] === true)) {
                  gameOver = true;

                  cellInput.style.color = "red";

                  const winningDirection = hasWon.find(result => result[0])[1];
                  for (let i = 0; i < winningDirection.length; i++) {
                     gameBoard[winningDirection[i][0]][winningDirection[i][1]][1].style.color = "red";
                  }

                  setTimeout(function() {
                     Restart();
                  }, 1000);
               } else if (checkGameOver()) {
                  gameOver = true;

                  setTimeout(function() {
                     Restart();
                  }, 1000);
               } else {
                  flag === 1 ? flag = 0 : flag = 1;
               }
            }
         };

         currentRow.appendChild(cellInput);
      }
      
      gameBoard.push(rowArray);
   }

   function InBounds(row, cell) {
      return row >= 0 && row < gridSize && cell >= 0 && cell < gridSize;
   }
   
   const winCondition = 3;
   function checkWin(row, cell, rowIncrement, cellIncrement, flag) {
      let cells = [];
      
      for (let i = 1; i < winCondition; i++) {
         const newRow = row + i * rowIncrement;
         const newcell = cell + i * cellIncrement;

         if (InBounds(newRow, newcell) && gameBoard[newRow][newcell][0] === flag) {
            cells.push([newRow, newcell]);
         } else {
            break;
         }
      }
      
      for (let i = 1; i < winCondition; i++) {
         const newRow = row - i * rowIncrement;
         const newcell = cell - i * cellIncrement;
         
         if (InBounds(newRow, newcell) && gameBoard[newRow][newcell][0] === flag) {
            cells.push([newRow, newcell]);
         } else {
            break;
         }
      }
      
      return [cells.length >= winCondition - 1, cells];
   }

   function checkGameOver() {
      for (let row = 0; row < gridSize; row++) {
         for (let cell = 0; cell < gridSize; cell++) {
            if (gameBoard[row][cell][0] === -1) return false;
         }
      }

      return true;
   }
}

if (canvas) {
   SetupTicTacToe(5);
}

function Restart() {
   if (canvas && gameOver === true) {
      SetupTicTacToe(5);
   }
}

const modal = document.querySelector(".modal");

modal.style.display = "flex";