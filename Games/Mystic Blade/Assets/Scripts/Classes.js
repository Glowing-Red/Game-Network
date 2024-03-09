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

class Player {
   constructor({
      Hero = "",
      Position = { X: 0, Y: 0},
      Scale = 1,
      Frames = 1,
      Flipped = false
   }) {
      this.Hero = {
         Name: Hero,
         MaxHealth: 100,
         Health: 100,
         Data: null
      };
      this.Position = Position;
      this.WorldPosition = Position;
      this.Velocity = { X: 0, Y: 15 };
      this.Width = 50;
      this.Height = 150;
      this.Image = new Image();
      this.Scale = Scale;
      this.Flipped = Flipped;
      this.Frames = {
         Max: Frames,
         Current: 0,
         Playing: null,
         Tick: 0,
         RefreshRate: 5
      };
      this.Hitbox = {
         Position: { X: 0, Y: 0 },
         Width: 0, Height: 0
      }
      this.Combat = {
         Attacking: false,
         Debounce: false,
         Landed: false,
         Damaged: false,
         Combo: 1,
         Hitbox: {
            Position: { X: 0, Y: 0 },
            Width: 0, Height: 0
         }
      };
   }

   async Init() {
      try {
         this.Hero.Data = await loadJSONData(`./Assets/Heroes/${this.Hero.Name}/Data.json`);
         
         this.Scale = this.Hero.Data.Scale
         this.Animate("Idle");
         
         this.Frames.Max = this.Hero.Data.SpriteSheets.Idle.Frames;
         this.Position = { X: this.WorldPosition.X - this.Hero.Data.Offset.X, Y: this.WorldPosition.Y - this.Hero.Data.Offset.Y };
         
         this.Hitbox = {
            Position: { X: this.Position.X + this.Hero.Data.Hitbox.Offset.X + (this.Flipped === true ? this.Hero.Data.Flip.X : 0), Y: this.Position.Y + this.Hero.Data.Hitbox.Offset.Y },
            Width: this.Hero.Data.Hitbox.Width, Height: this.Hero.Data.Hitbox.Height
         };
      } catch (error) {
         console.log('Error loading JSON data:', error);
      }
   }

   Draw() {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      tempCanvas.width = (this.Image.width / this.Frames.Max) * this.Scale;
      tempCanvas.height = this.Image.height * this.Scale;
      
      tempCanvas.width = tempCanvas.width > 0 ? tempCanvas.width : 1
      tempCanvas.height = tempCanvas.height > 0 ? tempCanvas.height : 1
      
      if (this.Flipped === true) {
         tempCtx.translate(tempCanvas.width, 0);
         tempCtx.scale(-1, 1);
      }

      tempCtx.drawImage(
         this.Image,
         this.Frames.Current * (this.Image.width / this.Frames.Max),
         0,
         this.Image.width / this.Frames.Max,
         this.Image.height,
         0,
         0,
         (this.Image.width / this.Frames.Max) * this.Scale,
         this.Image.height * this.Scale
      )
      
      if (roundOver === true) {
         const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
         const data = imageData.data;
         
         for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] !== 0) {
               data[i] = 0;
               data[i + 1] = 0;
               data[i + 2] = 0;
            }
         }
         
         tempCtx.putImageData(imageData, 0, 0);
      }
      
      ctx.drawImage(
         tempCanvas,
         this.Position.X,
         this.Position.Y,
         (this.Image.width / this.Frames.Max) * this.Scale,
         this.Image.height * this.Scale
      )
      
      if (Debugging === true) {
         ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
         ctx.fillRect(this.Hitbox.Position.X, this.Hitbox.Position.Y, this.Hitbox.Width, this.Hitbox.Height)
   
         if (this.Combat.Attacking) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
            ctx.fillRect(
               this.Combat.Hitbox.Position.X,
               this.Combat.Hitbox.Position.Y,
               this.Combat.Hitbox.Width, this.Combat.Hitbox.Height
            )
         }
      }
   }
   
   Update() {
      this.Draw();
      this.WorldPosition.Y += this.Velocity.Y;
      this.WorldPosition.X += this.Velocity.X;

      if (this.WorldPosition.Y >= currentScenery.Ground) {
         this.Velocity.Y = 0;
         this.WorldPosition.Y = currentScenery.Ground;
      } else {
         this.Velocity.Y++;
      }

      if (this.Hitbox.Position.X <= 0 && this.Flipped === true) {
         this.WorldPosition.X -= this.Velocity.X;
      } else if (this.WorldPosition.X >= 794) {
         this.WorldPosition.X = 794;
      }
      
      this.Position = { X: this.WorldPosition.X - this.Hero.Data.Offset.X, Y: this.WorldPosition.Y - this.Hero.Data.Offset.Y };
      this.Hitbox = {
         Position: { X: this.Position.X + this.Hero.Data.Hitbox.Offset.X + (this.Flipped === true ? this.Hero.Data.Flip.X : 0), Y: this.Position.Y + this.Hero.Data.Hitbox.Offset.Y },
         Width: this.Hero.Data.Hitbox.Width, Height: this.Hero.Data.Hitbox.Height
      };

      const hitBox = this.Hero.Data.Attack["Attack_" + this.Combat.Combo].Hitbox
      this.Combat.Hitbox = {
         Position: { X: this.Hitbox.Position.X + (this.Flipped ? -hitBox.Width : this.Hitbox.Width), Y: this.Hitbox.Position.Y - hitBox.Offset },
         Width: hitBox.Width, Height: hitBox.Height
      }

      this.Frames.Tick++;
      if (this.Frames.Tick % this.Frames.RefreshRate === 0) {
         if (this.Frames.Current < this.Frames.Max - 1) {
            this.Frames.Current++;
         } else {
            if (this.Hero.Health <= 0 || roundOver === true) return;

            if (this.Frames.Playing.includes("Attack")) {
               this.Combat.Attacking = false;

               setTimeout(() => {
                  this.Combat.Debounce = false;
                  
                  if (this.Combat.Landed === true && this.Combat.Combo < Object.keys(this.Hero.Data.Attack).length) {
                     this.Combat.Combo++;
                  } else {
                     this.Combat.Combo = 1;
                  }
                  
                  this.Combat.Landed = false;
               }, this.Hero.Data.Attack["Attack_" + this.Combat.Combo].Cooldown);
            } else if (this.Frames.Playing === "Damaged") {
               this.Combat.Damaged = false;
               this.Animate("Idle");
            }
            
            this.Frames.Current = 0;
         }
      }
   }

   Animate(animation) {
      if (this.Frames.Playing != animation) {
         if (this.Hero.Data.SpriteSheets[animation] != null) {
            this.Image.src = `./Assets/Heroes/${this.Hero.Name}/SpriteSheets/${this.Hero.Data.SpriteSheets[animation].Image}`;
            this.Frames.Max = this.Hero.Data.SpriteSheets[animation].Frames;
            this.Frames.Current = 0;
            this.Frames.Tick = 0;
            this.Frames.Playing = animation;
         }
      }
   }
}