window.addEventListener('error', function() {
   location.reload();
});

const score = document.getElementById("score");
const canvas = document.querySelector(".display");
const ctx = canvas.getContext('2d');

const background = new Scenery({
   Decal: "./Assets/Background.png",
   Offset: -35,
   Speed: 3
});

const ground = new Scenery({
   Decal: "./Assets/Ground.png",
   Offset: background.Height - 35,
   Speed: 1
});

const player = new Player({
   Position: { X: 50, Y: background.Height/2 }
})

const pipeStart = 300;
const pipeSpacing = 250;

const pipesArray = [
   new Pipes({
      Position: { X: pipeStart, Y: generatePosition().Y, Gap: generatePosition().Gap }
   }),
   new Pipes({
      Position: { X: pipeStart + pipeSpacing, Y: generatePosition().Y, Gap: generatePosition().Gap }
   }),
   new Pipes({
      Position: { X: pipeStart + pipeSpacing * 2, Y: generatePosition().Y, Gap: generatePosition().Gap }
   })
]

function point() {
   return false
}

let scoreActivated = false;
let nearestPipe = 0;
let scoreCount = 0;

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
      score.innerText = "Game Over";
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

tick();

window.addEventListener("keydown", (event) => {
   if (event.key === "w" ||event.key === "ArrowUp" || event.keyCode === 32) {
      player.Gravity = -10;
   }
})