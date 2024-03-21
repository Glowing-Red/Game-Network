const gamesFolder = document.querySelector(".games");
const gameHighlight = document.querySelector(".highlight");
const modal = document.querySelector(".modal");
const span = modal.querySelector(".close");

const title = modal.querySelector(".title");
const image = modal.querySelector(".preview");
const description = modal.querySelector(".description");
const button = modal.querySelector(".button");

let modalChosen;
const games = {
   "Mystic Blade": "The World of Sorcery and Martial Arts.",
   "Tic Tac Toe": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
   "Flappy Bird": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
};

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

function Highlight(game) {
   const heroImage = gameHighlight.querySelector(".hero");
   heroImage.src = `./Games/${game}/Hero.png`;

   const previewImage = gameHighlight.querySelector(".mainPreview").querySelector("img");
   previewImage.src = `./Games/${game}/Preview.png`;

   const previewName = gameHighlight.querySelector(".mainPreview").querySelector("h1");
   previewName.innerText = game;

   const playButton = gameHighlight.querySelector("a");
   playButton.href = `./Games/${game}/game.html`;

   heroImage.onclick = function() {
      modalChosen = heroImage;

      Open(game, games[game]);
   }
}

function HighlightSetup() {
   const sideBar = gameHighlight.querySelector(".side");

   const gameNames = Object.keys(games);
   const selectedGames = [];

   for (i = 0; i < 3; i++) {
      let randomIndex;
      
      do {
         randomIndex = Math.floor(Math.random() * gameNames.length);
      } while (selectedGames.includes(gameNames[randomIndex]))

      selectedGames.push(gameNames[randomIndex])
   }
   
   for (const game of selectedGames) {
      if (games.hasOwnProperty(game)) {
         const sideGame = document.createElement("img");
         sideGame.src = `./Games/${game}/Hero.png`;
         
         sideGame.onclick = function() {
            Highlight(game);
         }

         sideBar.appendChild(sideGame);
      }
   }

   Highlight(selectedGames[0]);
}

for (const game in games) {
   if (games.hasOwnProperty(game)) {
      const gameElement = document.createElement("div");
      gameElement.className = "game";

      const gameImage = document.createElement("img");
      gameImage.src = `./Games/${game}/Preview.png`;

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

HighlightSetup();