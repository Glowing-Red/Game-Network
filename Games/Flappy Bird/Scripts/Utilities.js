function generatePosition() {
   return { Y: -150 + Math.random() * 300, Gap: 150 + Math.random() * 50 }
}


function pipeTouched({ Player, Pipe }) {
   return ((
         Player.Position.X + Player.Width >= Pipe.Position.X &&
         Player.Position.X <= Pipe.Position.X + Pipe.Width
      ) && (
         (
            Player.Position.Y + Player.Height >= Pipe.Pipes.Bottom.Y &&
            Player.Position.Y <= Pipe.Pipes.Bottom.Y + Pipe.Height
         ) || (
            Player.Position.Y + Player.Height >= Pipe.Pipes.Top.Y &&
            Player.Position.Y <= Pipe.Pipes.Top.Y + Pipe.Height
         )
      )
   )
}

function pipeEntered({ Player, Pipe }) {
   return (
      Player.Position.X + Player.Width > Pipe.Position.X &&
      Player.Position.X < Pipe.Position.X + Pipe.Width && 
      Player.Position.Y + Player.Height > Pipe.Pipes.Bottom.Y - Pipe.Position.Gap &&
      Player.Position.Y <  Pipe.Pipes.Bottom.Y
   )
}