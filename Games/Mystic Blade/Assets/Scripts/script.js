const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const timerElement = document.getElementById('timer');

let roundTime = 120;
const Debugging = true;

let matchActive = false;
let roundOver = true;

let player_1;
let player_2;

let startTime;
let endTime;

const pickableHeroes = ["Aurelia", "Onimaru", "Raijin", "Shiroku", "Umbra", "Zephyrion"];
const availableSceneries = {
   "Woods": {
      "Layers": {
         "Background": 1,
         "Grass": 3
      },
      "Ground": 300
   },
   "Forest": {
      "Layers": {
         "Background": 1
      },
      "Ground": 250
   },
   "Ruins": {
      "Layers": {
         "Background": 1,
         "Grass": 3
      },
      "Ground": 45
   },
   "Amusement Park": {
      "Layers": {
         "Background": 1,
         "Sand": 3
      },
      "Ground": 270
   },
   "Sky": {
      "Layers": {
         "Background": 1,
         "Clouds": 3
      },
      "Ground": 130
   }
};
const actionKeybinds = {
   "Player_1": {
      "s": "Attack",
      "w": "Jump",
      "a": "Move_Left",
      "d": "Move_Right",
   },
   "Player_2": {
      "ArrowDown": "Attack",
      "ArrowUp": "Jump",
      "ArrowLeft": "Move_Left",
      "ArrowRight": "Move_Right",
   }
};

canvas.width = 1024;
canvas.height = 576;

let currentScenery = [];

function ReAnimate(player) {
   if (player.Hero.Health <= 0) {
      player.Animate("Death");
      return;
   }

   if (player.Combat.Attacking || player.Combat.Damaged || roundOver) {
      return;
   }

   if (player.WorldPosition.Y < currentScenery.Ground) {
      if (player.Velocity.Y < 0) {
         player.Animate("Jump");
      } else {
         player.Animate("Fall");
      }
   } else if (player.WorldPosition.Y >= currentScenery.Ground) {
      if (player.Velocity.X == 0) {
         player.Animate("Idle");
      } else {
         player.Animate("Run");
      }
   }
}

function Damage(player) {
   const enemyPlayer = GetEnemy(player);

   if (player.Combat.Attacking && player.Frames.Playing.includes("Attack") && player.Hero.Data.Attack["Attack_" + player.Combat.Combo].Hitbox.Active.includes(player.Frames.Current)  && player.Combat.Landed != true && rectangularCollision({ rectangle1: player.Combat.Hitbox, rectangle2: enemyPlayer.Hitbox }) && enemyPlayer.Hero.Health > 0) {
      player.Combat.Landed = true;
      enemyPlayer.Hero.Health -= player.Hero.Data.Attack["Attack_" + player.Combat.Combo].Damage;
      enemyPlayer.Combat.Damaged = true;
      enemyPlayer.Velocity.X = 0;

      if (enemyPlayer.Combat.Attacking === true) {
         enemyPlayer.Combat.Attacking = false;
         enemyPlayer.Combat.Combo = 1;

         setTimeout(() => {
            enemyPlayer.Combat.Landed = false;
            enemyPlayer.Combat.Debounce = false;
         }, enemyPlayer.Hero.Data.Attack["Attack_" + enemyPlayer.Combat.Combo].Cooldown + 500);
      }
      
      enemyPlayer.Animate("Damaged");
   }
}

function GameOver() {
   if (roundOver === false && ( player_1.Hero.Health <= 0 ||player_2.Hero.Health <= 0 || updateTimer(timerElement, startTime, roundTime) <= 0 )) {
      roundOver = true;
      endTime = new Date().getTime();
      player_1.Velocity.X = 0;
      player_2.Velocity.X = 0;
   }
}

function tick() {
   GameOver()

   if (roundOver === true && updateTimer(timerElement, endTime, 5) <= 0) {
      Init(pickableHeroes[Math.floor(Math.random() * pickableHeroes.length)], pickableHeroes[Math.floor(Math.random() * pickableHeroes.length)]);
      
      return;
   }
   
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   for (const key in currentScenery.Layers) {
      if (currentScenery.Layers.hasOwnProperty(key)) {
         if (key < 2) {
            for (const index in currentScenery.Layers[key]) {
               currentScenery.Layers[key][index].Update();
            }
         }
      }
   }

   for (const key in currentScenery.Layers) {
      if (currentScenery.Layers.hasOwnProperty(key)) {
         if (key == 2) {
            for (const index in currentScenery.Layers[key]) {
               currentScenery.Layers[key][index].Update();
            }
         }
      }
   }

   ReAnimate(player_1);
   ReAnimate(player_2);

   for (const key in currentScenery.Layers) {
      if (currentScenery.Layers.hasOwnProperty(key)) {
         if (key > 2) {
            for (const index in currentScenery.Layers[key]) {
               currentScenery.Layers[key][index].Update();
            }
         }
      }
   }

   if (roundOver === true) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
   }
   
   Damage(player_1);
   Damage(player_2);

   DisplayHealth(player_1);
   DisplayHealth(player_2);

   setTimeout(function() {
      tick();
   }, 1000 / 40);
}

function Action(player, event, enabled) {
   if (player.Hero.Health > 0 && !player.Combat.Damaged) {
      switch (event) {
         case "Jump":
            if (enabled === true && player.WorldPosition.Y >= currentScenery.Ground && player.Velocity.Y === 0 && player.Combat.Attacking != true) {
               player.Velocity.Y = -20;
            }
   
            break;
         case "Move_Left":
            if (enabled === true) {
               player.Flipped = true;

               if (player.Combat.Attacking != true) {
                  player.Velocity.X = -5;
               }
            } else {
               if (player.Velocity.X < 0) {
                  player.Velocity.X = 0;
               }
            }
   
            break;
         case "Move_Right":
            if (enabled === true) {
               player.Flipped = false;
               
               if (player.Combat.Attacking != true) {
                  player.Velocity.X = 5;
               }
            } else {
               if (player.Velocity.X > 0) {
                  player.Velocity.X = 0;
               }
            }
   
            break;
         case "Attack":
            if (enabled === true && player.WorldPosition.Y >= currentScenery.Ground && player.Velocity.Y === 0 && player.Combat.Debounce != true) {
               player.Combat.Debounce = true;
               player.Combat.Attacking = true;
               player.Velocity.X = 0;
               player.Animate("Attack_" + player.Combat.Combo);
            }
   
            break;
      }
   }
}

function actionKey(key) {
   for (const player in actionKeybinds) {
      if (key in actionKeybinds[player]) {
         return player;
      }
   }

   return null;
}

window.addEventListener("keydown", (event) => {
   if (roundOver === true) return;

   const targetPlayer = actionKey(event.key);
   
   if (targetPlayer && GetPlayer(targetPlayer)) {
      Action(GetPlayer(targetPlayer), actionKeybinds[targetPlayer][event.key], true)
   }
})

window.addEventListener('keyup', (event) => {
   if (roundOver === true) return;

   const targetPlayer = actionKey(event.key);
   
   if (targetPlayer && GetPlayer(targetPlayer)) {
      Action(GetPlayer(targetPlayer), actionKeybinds[targetPlayer][event.key], false)
   }
})

function Init(Hero_1, Hero_2) {
   const randomScenery = Object.keys(availableSceneries)[Math.floor(Math.random() * Object.keys(availableSceneries).length)];

   currentScenery = {
      Name: randomScenery,
      Ground: availableSceneries[randomScenery].Ground,
      Layers: {}
   };

   player_1 = new Player({
      Hero: Hero_1,
      Position: {
         X: 100,
         Y: currentScenery.Ground
      },
      Flipped: false,
      SpriteSheet: true
   });
   
   player_2 = new Player({
      Hero: Hero_2,
      Position: {
         X: 500,
         Y: currentScenery.Ground
      },
      Flipped: true,
      SpriteSheet: true
   });

   currentScenery.Layers["2"] = [];
   currentScenery.Layers["2"].push(player_1);
   currentScenery.Layers["2"].push(player_2);

   for (const layer in availableSceneries[currentScenery.Name].Layers) {
      if (!(availableSceneries[currentScenery.Name].Layers[layer] in currentScenery.Layers)) {
         currentScenery.Layers[availableSceneries[currentScenery.Name].Layers[layer]] = [];
      }
      
      const newLayer = new Sprite({
         Position: {
            X: 0,
            Y: 0,
            Offset: 0
         },
         Decal: `./Assets/Images/Scenery/${currentScenery.Name}/${layer}.png`
      })
      
      currentScenery.Layers[availableSceneries[currentScenery.Name].Layers[layer]].push(newLayer);
   };

   Promise.all( [ player_1.Init(), player_2.Init() ] ).then(() => {
      matchActive = true;
      roundOver = false;
      
      startTime = new Date().getTime();
      
      tick();
   }).catch(error => {
      console.log('Error loading players:', error);
   });
}

Init(pickableHeroes[Math.floor(Math.random() * pickableHeroes.length)], pickableHeroes[Math.floor(Math.random() * pickableHeroes.length)]);