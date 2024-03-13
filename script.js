const gamesFolder = document.querySelector(".games");
const modal = document.querySelector(".modal");
const span = modal.querySelector(".close");

const title = modal.querySelector(".title");
const image = modal.querySelector(".preview");
const description = modal.querySelector(".description");
const button = modal.querySelector(".button");

let modalChosen;

span.onclick = function() {
   Close()
}

window.onclick = function(event) {
   if (event.target == modal) {
      Close()
   }
}

function Close() {
   if (modalChosen) {
      modalChosen.classList.remove("game-hover");
      modalChosen = null;
   }
   
   modal.style.display = "none";
}

function Open(gameName, gameDesc) {
   title.textContent = gameName;
   image.src = `./Games/${gameName}/Preview.png`;
   description.textContent = gameDesc;
   button.href = `./Games/${gameName}/game.html`;
   modal.style.display = "flex";
}

const games = {
   "Mystic Blade": "The World of Sorcery and Martial Arts.",
   "Tic Tac Toe": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
   "Flappy Bird": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
}

for (const game in games) {
   if (games.hasOwnProperty(game)) {
      const gameElement = document.createElement("div");
      gameElement.className = "game"

      const gameImage = document.createElement("img");
      gameImage.src = `./Games/${game}/Preview.png`

      const gameName = document.createElement("div");
      gameName.textContent = game;
      
      gameElement.onmouseenter = function() {
         gameElement.classList.add("game-hover");
      }
      gameElement.onmouseleave = function() {
         if (modalChosen != gameElement) {
            gameElement.classList.remove("game-hover");
         }
      }
      gameElement.onclick = function() {
         modalChosen = gameElement;
         Open(game, games[game]);
      }
      
      gameElement.appendChild(gameImage);
      gameElement.appendChild(gameName);
      gamesFolder.appendChild(gameElement);
   }
}