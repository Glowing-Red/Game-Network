const prefabPipe = new Image();
prefabPipe.src = "./Assets/Pipe.png"

function flippedPipe() {
   const prefabCanvas = document.createElement('canvas');
   const prefabCtx = prefabCanvas.getContext('2d');
   
   prefabCanvas.height = prefabPipe.height;
   prefabCanvas.width = prefabPipe.width;
   
   prefabCtx.translate(0, prefabCanvas.height);
   prefabCtx.scale(1, -1);
   
   prefabCtx.drawImage(prefabPipe, 0, 0);

   return prefabCanvas;
}

class Pipes {
   constructor({
      Position = { X: 0, Y: 0, Gap: 0 },
   }) {
      this.Position = Position;
      this.Height = prefabPipe.height;
      this.Width = prefabPipe.width;
      this.Pipes = { Top: { Image: null, Y: null }, Bottom: { Image: null, Y: null } };

      this.Refresh();
   }

   Refresh() {
      this.Pipes.Top.Image = flippedPipe();
      this.Pipes.Bottom.Image = prefabPipe;
      
      this.Pipes.Top.Y = -prefabPipe.height + ((background.Height - ground.Height)/2) - this.Position.Y - (this.Position.Gap/2 -1.25);
      this.Pipes.Bottom.Y = prefabPipe.height - (background.Height/2) - ground.Height - this.Position.Y + (this.Position.Gap/2 -1.25);
   }

   Draw() {
      this.Pipes.Top.Image = flippedPipe();

      ctx.drawImage(this.Pipes.Top.Image, this.Position.X, this.Pipes.Top.Y);
      ctx.drawImage(this.Pipes.Bottom.Image, this.Position.X, this.Pipes.Bottom.Y);
   }
   
   Update() {
      this.Position.X -= 1;

      this.Draw();
   }
}