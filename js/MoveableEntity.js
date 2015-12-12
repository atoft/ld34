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
  
  //TODO: Collision tests
  
  //Update position
  xSpeed = this.speed * Math.sin(this.angle);
  ySpeed = -this.speed * Math.cos(this.angle);
  
  this.posX += xSpeed * dt;
  this.posY += ySpeed * dt;
    
}
