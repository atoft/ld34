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
  
  //TODO: Should asteroids collide with one another?
  
  //Call the parent function to update position
  MoveableEntity.prototype.update.call(this);  
}

//Asteroids are drawn at their drift angle, rather than their angle of movement
Asteroid.prototype.draw = function() {
  ctx.save();
  ctx.translate((this.posX-this.width/2-camX), 
                (this.posY-this.height/2-camY));
  ctx.rotate(this.driftAngle);

  ctx.beginPath();
  ctx.rect(-this.width/2, -this.height/2, 
            this.width, this.height);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}
