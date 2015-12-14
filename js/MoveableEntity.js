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

//Call this to cause collision effects on other entities
MoveableEntity.prototype.collisionTest = function() {
  console.log("collision test");
  console.log(entities.size());
  
  for(x=0; x<entities.size();x++) {
    var element = entities.elementAtIndex(i);
    if(!(element instanceof Player)) continue;
    if(element instanceof Asteroid) angle = element.driftAngle;
    else angle = element.angle;
    //Collision of rectangle with rectangle, treat as line intersections
    elementLines = [element.posX - Math.cos(angle)*element.width/2 - Math.sin(angle)*element.height/2,
                    element.posY - Math.cos(angle)*element.height/2 + Math.sin(angle)*element.width/2,
                    element.posX - Math.cos(angle)*element.width/2 + Math.sin(angle)*element.height/2,
                    element.posY + Math.cos(angle)*element.height/2 + Math.sin(angle)*element.width/2,
                    element.posX + Math.cos(angle)*element.width/2 + Math.sin(angle)*element.height/2,
                    element.posY + Math.cos(angle)*element.height/2 - Math.sin(angle)*element.width/2,
                    element.posX + Math.cos(angle)*element.width/2 - Math.sin(angle)*element.height/2,
                    element.posY - Math.cos(angle)*element.height/2 - Math.sin(angle)*element.width/2];
    
    thisLines =    [this.posX - Math.cos(this.angle)*this.width/2 - Math.sin(this.angle)*this.height/2,
                    this.posY - Math.cos(this.angle)*this.height/2 + Math.sin(this.angle)*this.width/2,
                    this.posX - Math.cos(this.angle)*this.width/2 + Math.sin(this.angle)*this.height/2,
                    this.posY + Math.cos(this.angle)*this.height/2 + Math.sin(this.angle)*this.width/2,
                    this.posX + Math.cos(this.angle)*this.width/2 + Math.sin(this.angle)*this.height/2,
                    this.posY + Math.cos(this.angle)*this.height/2 - Math.sin(this.angle)*this.width/2,
                    this.posX + Math.cos(this.angle)*this.width/2 - Math.sin(this.angle)*this.height/2,
                    this.posY - Math.cos(this.angle)*this.height/2 - Math.sin(this.angle)*this.width/2];    
    
    console.log("outer loop");
    var detected = false;
    for(i=0;i<4;i++) {
      for(j=0;j<4;j++) {
        if( intersects(elementLines[i], elementLines[i+1], elementLines[(i+2)%4], elementLines[(i+3)%4],
                       thisLines[j], thisLines[j+1], thisLines[(j+2)%4], thisLines[(j+3)%4]) ) {
          detected = true;
          break;             
        }
      }
    }
    if(detected) {
      element.damage(1);
      this.didCollide = true;
      break;              
    }
  }

}
