const prefabPlayer = new Image();
prefabPlayer.src = "./Assets/Player.png"

class Player {
   constructor({
      Position = { X: 0, Y: 0 },
   }) {
      this.Position = Position;
      this.Gravity = 0;
      this.Image = prefabPlayer;
      this.Height = this.Image.height;
      this.Width = this.Image.width;
   }

   Draw() {
      ctx.drawImage(this.Image, this.Position.X, this.Position.Y);
   }
   
   Update() {
      this.Position.Y += this.Gravity;
      
      if (this.Position.Y + this.Height < background.Height - ground.Height && this.Position.Y && this.Position.Y > 0) {
         this.Gravity++;
      } else if (this.Position.Y < 0) {
         this.Gravity = 5;
         this.Position.Y = 1;
      } else if (this.Position.Y + this.Height >= background.Height - ground.Height) {
         this.Gravity = 0;
         this.Position.Y = background.Height - ground.Height - this.Height;
      }

      this.Draw();
   }
}