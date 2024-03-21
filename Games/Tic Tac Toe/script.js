const canvas = document.querySelector('.gameBoard');
const modal = document.querySelector(".modal");
const closeModal = modal.querySelector(".close");
const sliderGrid = modal.querySelector("#Grid");
const sliderRow = modal.querySelector("#Row");

modal.style.display = "none";

let gameOver = false;
let gameBoard = [];
let gameSettings = {
   size: 3,
   row: 3
}

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

   gameBoard = [];
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
   
   const winCondition = gameSettings.row;
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

function Resize() {
   gameBoard.forEach(row => {
      row.forEach(cellArray => {
         const cell = cellArray[1];
         const gridSize = gameBoard.length;
         
         cell.style.width = `${cell.parentNode.offsetWidth / gridSize - 5}px`;
         cell.style.height = `${cell.parentNode.offsetWidth / gridSize - 5}px`;
         cell.style.fontSize = cell.style.width;
      });
   });
}

window.addEventListener('resize', Resize);

if (canvas) {
   SetupTicTacToe(gameSettings.size);
}

function Restart() {
   if (canvas && gameOver === true) {
      SetupTicTacToe(gameSettings.size);
   }
}

window.onclick = function(event) {
   if (event.target === modal || event.target === closeModal) {
      modal.style.display = "none";
   }
}

function OpenSettings() {
   if (modal.style.display !== "flex") {
      modal.style.display = "flex";
   } else {
      modal.style.display = "none";
   }
}

function UpdateSlider(slider, numerical) {
   if (slider.lastChange == null) {
      slider.lastChange = numerical;
   }
   
   const lastChanged = slider.lastChange;
   const direction = numerical >= lastChanged ? 1 : -1;

   const childNodes = slider.querySelectorAll('*');

   function ProcessNode(index) {
      if ((index < childNodes.length && direction === 1) || (direction === -1 && index >= 0 && index < childNodes.length)) {
         const element = childNodes[index];
         
         if (!isNaN(element.id) && parseInt(element.id)) {
            if (element.classList.contains("sliderActive")) {
               element.classList.remove("sliderActive");
            }

            if (parseInt(element.id) <= numerical) {
               element.classList.add("sliderActive");
            }

            setTimeout(() => {
               ProcessNode(index + direction);
            }, 20);
         } else {
            ProcessNode(index + direction);
         }
      }
   }
   
   ProcessNode((direction === 1 ? 0 : childNodes.length - 1));
}

function Change(target, action) {
   if (action === "Increase" || action === "Decrease") {
      if (target === "Grid") {
         Change(target, action === "Decrease" && gameSettings.size > 3 ? gameSettings.size - 1 : action === "Increase" && gameSettings.size < 8 ? gameSettings.size + 1 : gameSettings.size);
      } else if (target === "Row") {
         Change(target, action === "Decrease" && gameSettings.row > 3 ? gameSettings.row - 1 : action === "Increase" && gameSettings.row < 8 ? gameSettings.row + 1 : gameSettings.row);
      }
   } else if (typeof(action) === "number") {
      if (target === "Grid") {
         if (gameSettings.size === gameSettings.row || action < gameSettings.row) {
            gameSettings.size = action;
            gameSettings.row = action;
         }

         gameSettings.size = action >= 3 ? action : action <= 8 ? action : gameSettings.size ;
      } else if (target === "Row") {
         if (action >= 3 && action <= 8) {
            if (action > gameSettings.size) {
               gameSettings.row = action;
               gameSettings.size = action;
            }
            
            gameSettings.row = action;
         }
      }
      
      UpdateSlider(sliderGrid, gameSettings.size);
      UpdateSlider(sliderRow, gameSettings.row);
   }

   SetupTicTacToe(gameSettings.size);
}