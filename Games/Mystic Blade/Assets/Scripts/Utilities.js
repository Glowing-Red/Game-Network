function loadJSONData(path) {
   return new Promise((resolve, reject) => {
      fetch(path).then(response => {
         if (!response.ok) {
            throw new Error('Network response was not ok');
         }
         
         return response.json();
      }).then(jsonData => {
         resolve(jsonData);
      }).catch(error => {
         reject(error);
      });
   });
}

function rectangularCollision({ rectangle1, rectangle2 }) {
   return (
      rectangle1.Position.X + rectangle1.Width >=
      rectangle2.Position.X &&
      rectangle1.Position.X <=
      rectangle2.Position.X + rectangle2.Width &&
      rectangle1.Position.Y + rectangle1.Height >=
      rectangle2.Position.Y &&
      rectangle1.Position.Y <= rectangle2.Position.Y + rectangle2.Height
   )
}

function updateTimer(element, startTime, elapsed) {
   if (roundOver === true) return true;

   var currentTime = new Date().getTime();
   var elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000);
   var remainingTimeInSeconds = elapsed - elapsedTimeInSeconds;

   if (remainingTimeInSeconds <= 0) {
      remainingTimeInSeconds = 0;
   }

   var minutes = Math.floor(remainingTimeInSeconds / 60);
   var seconds = remainingTimeInSeconds % 60;
   
   var formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
   
   element.textContent = minutes + ':' + formattedSeconds;
   
   return remainingTimeInSeconds === 0;
}

function GetEnemy(player) {
   return player === player_1 ? player_2 : player_1
}

function GetPlayer(player) {
   return player === player_1 ? player_1 : player_2
}

function DisplayHealth(target) {
   const player = GetPlayer(target);
   
   const healthPercentage = Math.max(0, (player.Hero.Health / player.Hero.MaxHealth) * 100);
   const healthBar = document.querySelector(`${player === player_1 ? "#player_1" : "#player_2"} .HealthBar`);
   const healtDisplay = document.querySelector(`${player === player_1 ? "#player_1" : "#player_2"} .HealthDisplay`);
   healthBar.style.width = healthPercentage + '%';

   healtDisplay.textContent = `${Math.max(0, player.Hero.Health)}/${player.Hero.MaxHealth}`;
   if (player === player_1) {
      healthBar.style.marginLeft = (100 - healthPercentage) + '%';
   } else {
      healthBar.style.marginRight = (100 - healthPercentage) + '%';
   }
}