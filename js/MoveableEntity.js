/*
 * A moving object such as a ship or a rock.
 */
 
 
 var MoveableEntity = function(posX, posY, width, height, angle) {
  this.posX = posX;
  this.posY = posY;
  
  this.width = width;
  this.height = height;
  
  this.angle = angle;
  this.speed = 0;
    
  this.collide = false;
  
}

MoveableEntity.prototype.update = function() {      
  this.collide = false;
  
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
