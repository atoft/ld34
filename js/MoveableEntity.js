/*
 * A moving object such as a ship or a rock.
 */
 
 
var MoveableEntity = function(posX, posY, width, height, angle, doCollision) {
  this.posX = posX;
  this.posY = posY;
  
  this.width = width;
  this.height = height;
  
  this.angle = angle;
  this.speed = 0;
  
  this.doCollision = doCollision;
    
  //this.collide = false;
  
}

MoveableEntity.prototype.update = function() {      
  //this.collide = false;
  
  //Update position
  xSpeed = this.speed * Math.sin(this.angle);
  ySpeed = -this.speed * Math.cos(this.angle);
  
  this.posX += xSpeed * dt;
  this.posY += ySpeed * dt;
  
  //Correct for out of bounds
  if(this.posX < 0) this.posX = WORLD_WIDTH;
  else if(this.posX > WORLD_WIDTH) this.posX = 0;
  if(this.posY < 0) this.posY = WORLD_HEIGHT;
  else if(this.posY > WORLD_HEIGHT) this.posY = 0; 
}

MoveableEntity.prototype.damage = function(dmg) {
  console.log("Warning: called damage on object without unique damage method.");
}

MoveableEntity.prototype.draw = function() {
  console.log("Warning: called draw on object without unique draw method.");
} 


MoveableEntity.prototype.collisionTest = function() {
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
