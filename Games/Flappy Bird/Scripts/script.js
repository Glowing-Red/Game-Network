const score = document.getElementById("score");
const canvas = document.querySelector(".display");
const ctx = canvas.getContext('2d');

const pipeStart = 300;
const pipeSpacing = 150;
const button = new Image()
button.src = "./Assets/Start.png"

let scoreActivated = false;
let nearestPipe = 0;
let scoreCount = 0;
let highScore = scoreCount;
let background;
let ground;
let player;
let pipesArray;
let gameOver = true;

function tick() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   
   background.Update();
   
   pipesArray.forEach(function(pipe, index) {
      pipe.Update();
      
      if (pipe.Position.X + pipe.Width <= 0) {
         const targetIndex = index - 1 >= 0 ? index - 1 : pipesArray.length - 1;
         
         pipe.Position.Y = generatePosition().Y;
         pipe.Position.Gap = generatePosition().Gap;
         
         pipe.Refresh();
         
         pipe.Position.X = pipesArray[targetIndex].Position.X + pipeSpacing;
      }
   });
   
   if (pipesArray[nearestPipe].Position.X + pipesArray[nearestPipe].Width * 1.25 < player.Position.X) {
      nearestPipe = nearestPipe + 1 < pipesArray.length ? nearestPipe + 1 : 0;
   }
   
   player.Update();

   ground.Update();

   if (pipeTouched({ Player: player, Pipe: pipesArray[nearestPipe] })) {
      DisplayMenu();
      return;
   } else {
      if (scoreActivated === false && pipeEntered({ Player: player, Pipe: pipesArray[nearestPipe] }) === true) {
         scoreActivated = true;
      } else if (scoreActivated === true && pipeEntered({ Player: player, Pipe: pipesArray[nearestPipe] }) === false) {
         scoreCount++;
         scoreActivated = false;
      }
   }
   
   score.innerText = scoreCount.toString().padStart(3, '0');

   setTimeout(function() {
      tick();
   }, 1000 / 40);
}

function WaitForLoad(paths) {
   return new Promise((resolve, reject) => {
      const promises = paths.map(url => {
         return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
               resolve();
            };
            img.onerror = function() {
               reject('Error loading image: ' + url);
            };
            img.src = url;
         });
      });

      Promise.all(promises).then(() => {
         resolve();
      }).catch(error => {
         reject(error);
      });
   });
}

function LoadAssets(folder, files) {
   return new Promise((resolve, reject) => {
      const paths = files.map(filename => folder + '/' + filename);
      
      WaitForLoad(paths).then(() => {
         resolve();
      }).catch(error => {
         reject(error);
      });
   });
}

function DisplayMenu() {
   gameOver = true;
   score.style.display = "none";

   const newHighscore = scoreCount > highScore ? true : false;
   highScore = scoreCount > highScore ? scoreCount : highScore;

   ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   ctx.save();
   ctx.scale(1, 3);

   ctx.font = "12px 'Press Start 2P'";
   ctx.fillStyle = "white";
   ctx.fillText("Current Score:" + scoreCount, canvas.width*0.325, canvas.height*0.08);
   ctx.fillText("High Score:" + highScore, canvas.width*0.325, canvas.height*0.05);

   if (newHighscore === true) {
      ctx.font = "14px 'Press Start 2P'";
      ctx.fillText("New High Score!", canvas.width*0.3, canvas.height*0.13);
   }

   ctx.restore();
   
   ctx.drawImage(button, canvas.width/2 - button.width/2, canvas.height*0.55 - button.height/2);
}

function RestartGame() {
   pipesArray = [
      new Pipes({
         Position: { X: pipeStart, Y: generatePosition().Y, Gap: generatePosition().Gap }
      }),
      new Pipes({
         Position: { X: pipeStart + pipeSpacing, Y: generatePosition().Y, Gap: generatePosition().Gap }
      }),
      new Pipes({
         Position: { X: pipeStart + pipeSpacing * 2, Y: generatePosition().Y, Gap: generatePosition().Gap }
      }),
      new Pipes({
         Position: { X: pipeStart + pipeSpacing * 3, Y: generatePosition().Y, Gap: generatePosition().Gap }
      })
   ]
   
   player.Position.Y = background.Height/2;
   nearestPipe = 0;  
   player.Gravity = 0;
   scoreCount = 0;
   scoreActivated = false;
   gameOver = false;
   score.style.display = "flex";

   tick();
}

function SetupGame() {
   LoadAssets("./Assets", ["Background.png", "Ground.png", "Pipe.png", "Player.png"]).then(() => {
      background = new Scenery({
         Decal: "./Assets/Background.png",
         Offset: -35,
         Speed: 2.5
      });
      
      ground = new Scenery({
         Decal: "./Assets/Ground.png",
         Offset: background.Height - 35,
         Speed: 2
      });
      
      player = new Player({
         Position: { X: 50, Y: background.Height/2 }
      })
      
      gameOver = false;

      background.Update();
      player.Update();
      ground.Update();

      DisplayMenu();
   }).catch(error => {
      console.log("Error loading assets:", error);
   });
}

window.addEventListener("keydown", (event) => {
   if (gameOver === false && (event.keyCode === 87 ||event.keyCode === 38 || event.keyCode === 32)) {
      player.Gravity = -10;
   }
})

canvas.addEventListener("click", function(event) {
   if (gameOver === true) {
      const rect = canvas.getBoundingClientRect();
      const mousePos = {
         X: event.clientX - rect.left,
         Y: event.clientY - rect.top
      };
      const buttonPos = {
         X: canvas.width/2 - button.width/2,
         Y: canvas.height*0.55 - button.height/2
      }

      const ratio = {
         X: (canvas.clientWidth / canvas.width),
         Y: (canvas.clientHeight / canvas.height)
      };

      if (
         mousePos.X / ratio.X >= buttonPos.X &&
         mousePos.X / ratio.X <= buttonPos.X + button.width &&
         mousePos.Y / ratio.Y >= buttonPos.Y &&
         mousePos.Y / ratio.Y <= buttonPos.Y + button.height
      ) {
         gameOver = false;
         RestartGame();
      }
   } else {
      player.Gravity = -10;
   }
})

SetupGame();