/*
 * An enemy space-ship. A child type of MoveableEntity.
 */
 
function AIShip(posX, posY,target) {
  MoveableEntity.call(this,posX, posY, 40, 40, 0);
  this.maxSpeed = AI_MAXSPEED;
  this.acceleration = AI_ACCELERATION;
  this.enginesOn = false;
  this.health = AI_MAXHEALTH;
  
  this.target = target;
  
  this.invulnerabilityTimer = 0;
  this.weaponTimer = 0;
  
}

AIShip.prototype = Object.create(MoveableEntity.prototype);
AIShip.prototype.constructor = AIShip;

AIShip.prototype.update = function() {
  if(this.health<=0) {
    entities.remove(this);
    sprites.add(new Sprite(this.posX, this.posY, 4, imgExplode, 6, 4, false, true));

  }
  
  //for all asteroids, check for distance
    //store dist of closest asteroid
  //if closestAsteroid < safeDist  
    //try to avoid asteroid
  
  //get player distance and direction
  targetDist = Math.sqrt( Math.pow(this.posX - target.posX, 2) 
                          + Math.pow(this.posX - target.posX, 2) );
  targetAngle = Math.atan( (target.posX - this.posX) / -(target.posY - this.posY) );

  //if player distance > safeDist & <maxDistance
    //increase speed to max speed
  //else reduce speed
  
  //if player is in range
    //Fire weapon
  
  
  //Do collision with other objects
  //TODO: Use the same method as lasers
  for(i=0; i<entities.size();i++) {
    var element = entities.elementAtIndex(i);
    if(element == this) continue;
    
    if((this.posX + this.width/4 >= element.posX - element.width/2)
        && (this.posX - this.width/4 <= element.posX + element.width/2 )) {
      if(this.posY + this.height/2 >= element.posY - element.height/2
         && this.posY + this.height/2 <= element.posY + element.height/2) {
        if(!this.collide) {   
          this.collide = true;
          //this.posY= -this.height/2 + element.posY - element.height/2;
        }
      }
      if(this.posY - this.height/2 <= element.posY + element.height/2 
         && this.posY - this.height/2 >= element.posY - element.height/2 ) {
        if(!this.collide) {
          this.collide = true;
          //this.posY= this.height/2 + element.posY + element.height/2;
        }
      }
    }
    
    if((this.posY + this.height/4 >= element.posY - element.height/2)
        && (this.posY - this.height/4 <= element.posY + element.height/2 )) {
      if(this.posX + this.width/2 >= element.posX - element.width/2
         && this.posX + this.width/2 <= element.posX + element.width/2) {
        if(!this.collide) {
          this.collide = true;
          //this.posX= -this.width/2 + element.posX - element.width/2;
        }
      }
      if(this.posX - this.width/2 <= element.posX + element.width/2 
         && this.posX - this.width/2 >= element.posX - element.width/2 ) {
        if(!this.collide) {
          this.collide = true;
          //this.posX= this.width/2 + element.posX + element.width/2;
        }
      }
    }
    
    if(this.collide) break;
  }
  if(this.collide && this.invulnerabilityTimer<=0) {
    this.health--;

    sprites.add(new Sprite(this.posX, this.posY, 1, imgExplode, 6, 4, false, true));
    
    this.invulnerabilityTimer = AI_INVULNERABLE_TIMEOUT;
  }
  if(this.invulnerabilityTimer>0) {
    this.invulnerabilityTimer -= 1/dt;
  }
  if(this.weaponTimer > 0) {
    this.weaponTimer -= 1/dt;
  }
  
  //Call the parent function to update position
  MoveableEntity.prototype.update.call(this);  
}

Player.prototype.draw = function() {
  ctx.save();
  ctx.translate((this.posX-this.width/2 -camX), 
                (this.posY-this.height/2 -camY));
  ctx.rotate(this.angle);

  ctx.beginPath();
  ctx.rect(-this.width/2, -this.height/2, 
            this.width, this.height);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
  //if(this.enginesOn) sprite = imgShipFly;
  //else sprite = imgShip;
  //ctx.drawImage(sprite,-this.width/2,-this.height/2);
  //ctx.restore();
}
