class Scenery {
   constructor({
      Decal,
      Offset = 0,
      Speed = 0
   }) {
      this.Image = new Image();
      this.Image.src = Decal;
      this.Width = this.Image.width;
      this.Height = this.Image.height;
      this.Offset = Offset;
      this.X = 0;
      this.Speed = Speed;
   }

   Draw() {
      ctx.drawImage(this.Image, this.X, this.Offset);
      ctx.drawImage(this.Image, this.Width + this.X, this.Offset);
   }
   
   Update() {

      if (this.X <= -this.Width) {
         this.X = 0;
      }

      this.Draw();
      
      this.X -= this.Speed;
   }
}