/*
 * A laser beam. Has a start and end point, and can 
 * test for collision with Entities.
 */
 
var Laser = function( startX, startY, endX, endY ) {
  this.startX = startX;
  this.startY = startY;
  this.endX = endX;
  this.endY = endY;
  
  this.lifespan = LASER_LIFETIME;
}

Laser.prototype.update = function() {
  if(this.lifespan > 0) {
    this.lifespan -= 1/dt;
    this.collisionTest();
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
  for(i=0; i<entities.size();i++) {
    var element = entities.elementAtIndex(i);
    //Collision of line segment with rectangle, treat as 4 line intersections
    p0X = element.posX - element.width/2;
    p0Y = element.posY - element.height/2;
    
    p1X = element.posX + element.width/2;
    p1Y = element.posY - element.height/2;
    
    p2X = element.posX + element.width/2;
    p2Y = element.posY + element.height/2;
    
    p3X = element.posX - element.width/2;
    p3Y = element.posY + element.height/2;
    
    if( intersects(this.startX, this.startY, this.endX, this.endY,
                   p0X, p0Y, p1X, p1Y) || 
        intersects(this.startX, this.startY, this.endX, this.endY,
                   p1X, p1Y, p2X, p2Y) ||
        intersects(this.startX, this.startY, this.endX, this.endY,
                   p2X, p2Y, p3X, p3Y) ||
        intersects(this.startX, this.startY, this.endX, this.endY,
                   p3X, p3Y, p0X, p0Y) ) {
      console.log("laser collision");               
    }
  }
}

Laser.prototype.draw = function() {
  ctx.beginPath();
  ctx.moveTo(this.startX -camX, this.startY -camY);
  ctx.lineTo(this.endX -camX,   this.endY -camY);
  ctx.strokeStyle="#00ff00";
  ctx.lineWidth = 2;
  ctx.stroke();
}
