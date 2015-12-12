/*
 * A laser beam. Has a start and end point, and can 
 * test for collision with Entities.
 */
 
var Laser = function( startX, startY, angle ) {
  this.startX = startX;
  this.startY = startY;
  this.angle = angle;
  this.endX = this.startX + LASER_LENGTH*Math.sin(this.angle);
  this.endY = this.startY - LASER_LENGTH*Math.cos(this.angle);
                           
  this.lifespan = LASER_LIFETIME;
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
    entities.remove(this);
  }
}

function intersects(p0X, p0Y, p1X, p1Y,   p2X, p2Y, p3X, p3Y) {
  s1X = p1X - p0X;
  s1Y = p1Y - p0Y;
  
  s2X = p3X - p2X;
  s2Y = p3Y - p2Y;
  
  s = (-s1Y * (p0X - p2X) + s1X * (p0Y - p2Y)) 
       / (-s2X * s1Y + s1X * s2Y);
  t = ( s2X * (p0Y - p2Y) - s2Y * (p0X - p2X)) 
       / (-s2X * s1Y + s1X * s2Y);
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) return true;
  else return false;
}

Laser.prototype.collisionTest = function() {
  didCollide = false;
  for(i=0; i<entities.size();i++) {
    var element = entities.elementAtIndex(i);
    //Collision of line segment with rectangle, treat as 4 line intersections
    p0X = element.posX - Math.cos(element.angle)*element.width/2 + Math.sin(element.angle)*element.height/2;
    p0Y = element.posY - Math.cos(element.angle)*element.height/2 - Math.sin(element.angle)*element.width/2;
    
    p1X = element.posX - Math.cos(element.angle)*element.width/2 - Math.sin(element.angle)*element.height/2;
    p1Y = element.posY - Math.cos(element.angle)*element.height/2 + Math.sin(element.angle)*element.width/2;
    
    p2X = element.posX + Math.cos(element.angle)*element.width/2 - Math.sin(element.angle)*element.height/2;
    p2Y = element.posY + Math.cos(element.angle)*element.height/2 + Math.sin(element.angle)*element.width/2;
    
    p3X = element.posX + Math.cos(element.angle)*element.width/2 + Math.sin(element.angle)*element.height/2;
    p3Y = element.posY + Math.cos(element.angle)*element.height/2 - Math.sin(element.angle)*element.width/2;
    
    if( intersects(this.startX, this.startY, this.endX, this.endY,
                   p0X, p0Y, p1X, p1Y) || 
        intersects(this.startX, this.startY, this.endX, this.endY,
                   p1X, p1Y, p2X, p2Y) ||
        intersects(this.startX, this.startY, this.endX, this.endY,
                   p2X, p2Y, p3X, p3Y) ||
        intersects(this.startX, this.startY, this.endX, this.endY,
                   p3X, p3Y, p0X, p0Y) ) {
      if(element instanceof Player) continue; //TODO: Allow for enemy lasers
      else {
        element.damage(1);
        didCollide = true;
        break;
      }               
    }
  }
  if(didCollide) entities.remove(this);
}

Laser.prototype.draw = function() {
  ctx.beginPath();
  ctx.moveTo(this.startX -camX, this.startY -camY);
  ctx.lineTo(this.endX -camX,   this.endY -camY);
  ctx.strokeStyle="#00ff00";
  ctx.lineWidth = 2;
  ctx.stroke();
}
