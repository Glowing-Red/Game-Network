const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const timerElement = document.getElementById('timer');

let roundTime = 120;
const Debugging = false;

let matchActive = true;
let roundOver = false;
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
let startTime = new Date().getTime();

canvas.width = 1024
canvas.height = 576

const background = new Sprite({
   Position: {
      X: 0,
      Y: 0,
      Offset: 0
   },
   Decal: './Assets/Images/Background.png'
})

const player_1 = new Player({
   Hero: "Shiroku",
   Position: {
      X: 100,
      Y: 250
   },
   Flipped: false,
   SpriteSheet: true
})

const player_2 = new Player({
   Hero: "Raijin",
   Position: {
      X: 500,
      Y: 250
   },
   Flipped: true,
   SpriteSheet: true
})

function ReAnimate(player) {
   if (player.Hero.Health <= 0) {
      player.Animate("Death");
      return;
   }

   if (player.Combat.Attacking || player.Combat.Damaged || roundOver) {
      return;
   }

   if (player.WorldPosition.Y < 250) {
      if (player.Velocity.Y < 0) {
         player.Animate("Jump");
      } else {
         player.Animate("Fall");
      }
   } else if (player.WorldPosition.Y >= 250) {
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

function tick() {
   if (updateTimer(timerElement, startTime, roundTime)) {
      roundOver = true;
   }
   
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   ReAnimate(player_1);
   ReAnimate(player_2);
   
   background.Update();

   if (roundOver === true) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      player_1.Velocity.X = 0;
      player_2.Velocity.X = 0;
   }

   player_1.Update();
   player_2.Update();

   if (roundOver === true) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
   }
   
   Damage(player_1);
   Damage(player_2);

   DisplayHealth(player_1);
   DisplayHealth(player_2);

   setTimeout(function() {
      tick();
   }, 1000 / 40);
}

Promise.all( [ player_1.Init(), player_2.Init() ] ).then(() => {
   tick()
}).catch(error => {
   console.log('Error loading players:', error);
});

function Action(player, event, enabled) {
   if (player.Hero.Health > 0 && !player.Combat.Damaged) {
      switch (event) {
         case "Jump":
            if (enabled === true && player.WorldPosition.Y >= 250 && player.Velocity.Y === 0 && player.Combat.Attacking != true) {
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
            if (enabled === true && player.WorldPosition.Y >= 250 && player.Velocity.Y === 0 && player.Combat.Debounce != true) {
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