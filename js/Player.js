/*
 * The player's space-ship. A child type of MoveableEntity.
 */
 
function Player(posX, posY, maxSpeed) {
  //TODO: define player constants
  MoveableEntity.call(this,posX, posY, 40, 40, 0);
  this.maxSpeed = maxSpeed;
  this.acceleration = 0.1;
  
}

Player.prototype = Object.create(MoveableEntity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if(leftPressed) {
    this.angle -= 5 *2*Math.PI/360;
  }
  if(rightPressed) {
    this.angle += 5 *2*Math.PI/360;
  }
  if(spacePressed) {
    if(this.speed < this.maxSpeed) this.speed +=this.acceleration;
  }
  else this.speed -= this.acceleration/4;
  if(this.speed <0) this.speed = 0;
  
  if(this.angle > 2*Math.PI) this.angle -= 2*Math.PI;
  else if (this.angle < 0) this.angle += 2*Math.PI;
  //Call the parent function to calculate collisions
  MoveableEntity.prototype.update.call(this);  
}

Player.prototype.draw = function() {
  ctx.save();
  ctx.translate((this.posX-this.width/2 -camX)*screenScale, 
                (this.posY-this.height/2 -camY)*screenScale);
  ctx.rotate(this.angle);

  ctx.beginPath();
  ctx.rect(-this.width*screenScale/2, -this.height/screenScale/2, 
            this.width*screenScale, this.height*screenScale);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}
