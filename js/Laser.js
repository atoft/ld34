/*
 * A laser beam. Has a start and end point, and can 
 * test for collision with Entities.
 */
 
var Laser = function( startX, startY, angle, isPlayers ) {
  this.startX = startX;
  this.startY = startY;
  this.angle = angle;
  this.endX = this.startX + LASER_LENGTH*Math.sin(this.angle);
  this.endY = this.startY - LASER_LENGTH*Math.cos(this.angle);
  this.isPlayers = isPlayers;
                           
  this.lifespan = LASER_LIFETIME;
  
  this.didCollide = false;
}

Laser.prototype.update = function() {
  if(this.lifespan > 0) {
    dX = LASER_SPEED * dt * Math.sin(this.angle);
    dY = LASER_SPEED * dt * Math.cos(this.angle);
  
    this.startX += dX;
    this.startY -= dY;
    this.endX += dX;
    this.endY -= dY;
    
    this.lifespan -= 1/dt;
    this.collisionTest();
  }
  else {
    console.log("removed laser");
    entities.remove(this);
  }
}

Laser.prototype.collisionTest = function() {
  if(this.didCollide) {
    entities.remove(this);
  }
  for(i=0; i<entities.size();i++) {
    var element = entities.elementAtIndex(i);
    if(element instanceof Asteroid) angle = element.driftAngle;
    else angle = element.angle;
    //Collision of line segment with rectangle, treat as 4 line intersections
    p0X = element.posX - Math.cos(angle)*element.width/2 - Math.sin(angle)*element.height/2;
    p0Y = element.posY - Math.cos(angle)*element.height/2 + Math.sin(angle)*element.width/2;
    
    p1X = element.posX - Math.cos(angle)*element.width/2 + Math.sin(angle)*element.height/2;
    p1Y = element.posY + Math.cos(angle)*element.height/2 + Math.sin(angle)*element.width/2;
    
    p2X = element.posX + Math.cos(angle)*element.width/2 + Math.sin(angle)*element.height/2;
    p2Y = element.posY + Math.cos(angle)*element.height/2 - Math.sin(angle)*element.width/2;
    
    p3X = element.posX + Math.cos(angle)*element.width/2 - Math.sin(angle)*element.height/2;
    p3Y = element.posY - Math.cos(angle)*element.height/2 - Math.sin(angle)*element.width/2;
    
    if( intersects(this.startX, this.startY, this.endX, this.endY,
                   p0X, p0Y, p1X, p1Y) || 
        intersects(this.startX, this.startY, this.endX, this.endY,
                   p1X, p1Y, p2X, p2Y) ||
        intersects(this.startX, this.startY, this.endX, this.endY,
                   p2X, p2Y, p3X, p3Y) ||
        intersects(this.startX, this.startY, this.endX, this.endY,
                   p3X, p3Y, p0X, p0Y) ) {
      if(element instanceof Player && this.isPlayers) continue;
      else if(element instanceof AIShip && !this.isPlayers) continue;
      else {
        element.damage(1);
        this.didCollide = true;
        break;
      }               
    }
  }

}

Laser.prototype.draw = function() {
  ctx.beginPath();
  ctx.moveTo(this.startX -camX, this.startY -camY);
  ctx.lineTo(this.endX -camX,   this.endY -camY);
  if(this.isPlayers) ctx.strokeStyle="#00ff00";
  else ctx.strokeStyle="red";
  ctx.lineWidth = 2;
  ctx.stroke();
}
