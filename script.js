const gamesFolder = document.querySelector(".games");
const gameHighlight = document.querySelector(".highlight");
const modal = document.querySelector(".modal");
const span = modal.querySelector(".close");

const title = modal.querySelector(".title");
const image = modal.querySelector(".preview");
const description = modal.querySelector(".description");
const button = modal.querySelector(".button");

let modalChosen;
let mobileMode = false;

const games = {
   "Mystic Blade": "The World of Sorcery and Martial Arts. A 2 player game on a single device for some casual fun and fast pace rounds, with a random map and hero every match!",
   "Tic Tac Toe": "It's a game as old as the hills, but no less fun or popular. Play the classic mode in the usual 3x3 grid or customize the game's grid, and required row length to win!",
   "Flappy Bird": "A giant among the classic games, and a really popular one too. Fly past the vast city and dodge the tubes by going between them!"
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
   description.textContent = "";
   description.innerHTML += gameDesc;

   if (mobileMode === true) {
      button.style.pointerEvents = "none";
      button.innerText = "Not Available"
   } else {
      button.style.pointerEvents = "auto";
      button.innerText = "Play Now"
   }
   
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
   
   if (mobileMode === true) {
      playButton.style.pointerEvents = "none";
      playButton.innerText = "Not Available"
   } else {
      playButton.style.pointerEvents = "auto";
      playButton.innerText = "Play Now"
   }
   
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
function MobileDevice() {
   if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
   }
   
   if (window.innerWidth <= 800 && window.innerHeight <= 600) {
      return true;
   }
   
   if (window.matchMedia("(orientation: portrait)").matches && (window.innerWidth <= 1024 && window.innerHeight <= 1366)) {
      return true;
   }

   return false;
}

function ScrollBar() {
   return document.documentElement.scrollHeight > window.innerHeight;
}

function ReSize() {
   document.documentElement.style.setProperty("--Scroll-Width", ScrollBar() ? `${window.innerWidth - document.documentElement.clientWidth}px` : "0");

   mobileMode = MobileDevice();
}

ReSize();
HighlightSetup();

window.addEventListener("resize", ReSize);