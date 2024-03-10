class Sprite {
   constructor({
      Position = { X: 0, Y: 0},
      Offset = { X: 0, Y: 0},
      Decal,
      Scale = 1,
      Frames = 1,
      SpriteSheet = false
   }) {
      this.Position = Position;
      this.Offset = Offset;
      this.Width = 50;
      this.Height = 150;
      this.Image = new Image();
      this.Image.src = Decal;
      this.Scale = Scale;
      this.SpriteSheet = SpriteSheet;
      this.Frames = {
         Max: Frames,
         Current: 0,
         Tick: 0,
         RefreshRate: 5
      };
   }

   Draw() {
      ctx.drawImage(
         this.Image,
         this.Frames.Current * (this.Image.width / this.Frames.Max),
         0,
         this.Image.width / this.Frames.Max,
         this.Image.height,
         this.Position.X - this.Offset.X,
         this.Position.Y - this.Offset.Y,
         (this.Image.width / this.Frames.Max) * this.Scale,
         this.Image.height * this.Scale
      )
   }
   
   Update() {
      this.Draw();

      if (this.SpriteSheet === true) {
         this.Frames.Tick++;

         if (this.Frames.Tick % this.Frames.RefreshRate === 0) {
            if (this.Frames.Current < this.Frames.Max - 1) {
               this.Frames.Current++;
            } else {
               this.Frames.Current = 0;
            }
         }
      }
   }
}