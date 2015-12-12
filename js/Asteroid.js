/*
 * A space rock, which drifts with a set speed and rotation.
 * A child type of MoveableEntity
 */
 
function Asteroid(posX, posY, width, height, speed, angle, driftSpeed) {
  this.driftAngle = 0;
  this.driftSpeed = driftSpeed;
  MoveableEntity.call(this,posX, posY, width, height, angle);
  this.speed = speed;
  
}

Asteroid.prototype = Object.create(MoveableEntity.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.update = function() {
  this.driftAngle += this.driftSpeed * dt;
  if(this.driftAngle > 2*Math.PI) this.driftAngle -= 2*Math.PI;
  else if (this.driftAngle < 0) this.driftAngle += 2*Math.PI;
  
  
  //Call the parent function to calculate collisions
  MoveableEntity.prototype.update.call(this);  
}

//Asteroids are drawn at their drift angle, rather than their angle of movement
Asteroid.prototype.draw = function() {
  ctx.save();
  ctx.translate((this.posX-this.width/2-camX)*screenScale, 
                (this.posY-this.height/2-camY)*screenScale);
  ctx.rotate(this.driftAngle);

  ctx.beginPath();
  ctx.rect(-this.width*screenScale/2, -this.height/screenScale/2, 
            this.width*screenScale, this.height*screenScale);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}
