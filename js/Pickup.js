/*
 * A pickup, either health or space junk
 * A child type of MoveableEntity
 */
 
function Pickup(posX, posY, speed, angle, driftSpeed, pickupType) {
  this.driftAngle = 0;
  this.driftSpeed = driftSpeed;
  MoveableEntity.call(this,posX, posY, PICKUP_SIZE, PICKUP_SIZE, angle);
  this.speed = speed;
  this.pickupType = pickupType;
  // 0 health, 1 junk
}

Pickup.prototype = Object.create(MoveableEntity.prototype);
Pickup.prototype.constructor = Pickup;

Pickup.prototype.update = function() {
  this.driftAngle += this.driftSpeed * dt;
  if(this.driftAngle > 2*Math.PI) this.driftAngle -= 2*Math.PI;
  else if (this.driftAngle < 0) this.driftAngle += 2*Math.PI;
  
  
  
  //Call the parent function to update position
  MoveableEntity.prototype.update.call(this);  
}


Pickup.prototype.draw = function() {
  ctx.save();
  ctx.translate((this.posX-this.width/2-camX), 
                (this.posY-this.height/2-camY));
  ctx.rotate(this.driftAngle);

  switch(this.pickupType) {
    case 0 : img = imgHealth;break;
    default : img = imgJunk;
  }
  ctx.drawImage(img,-this.width/2,-this.height/2,this.width,this.height);
  ctx.restore();
}
