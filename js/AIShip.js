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
  this.angle = 0;
  
  this.invulnerabilityTimer = 0;
  this.weaponTimer = 0;
  
}

AIShip.prototype = Object.create(MoveableEntity.prototype);
AIShip.prototype.constructor = AIShip;

AIShip.prototype.update = function() {
  if(this.health<=0) {
    numAI--;
    entities.remove(this);
    sprites.add(new Sprite(this.posX, this.posY, 4, imgExplode, 6, 4, false, true));

  }
  
  //for all asteroids, check for distance
    //store dist of closest asteroid
  //if closestAsteroid < safeDist  
    //try to avoid asteroid
  
  //get player distance and direction
  targetDist = Math.sqrt( Math.pow(this.posX - this.target.posX, 2) 
                          + Math.pow(this.posY - this.target.posY, 2) );
  targetAngle = Math.atan( (this.target.posX - this.posX) / -(this.target.posY - this.posY) );

  if(this.target.posY > this.posY) targetAngle -= Math.PI;
  

  //if player distance > safeDist & <maxDistance
    //increase speed to max speed
  //else reduce speed
  if(targetDist < AI_RANGE) {
    if(targetDist > AI_TARGET_SAFEDIST) {
      if(this.speed < AI_MAXSPEED) this.speed+=this.acceleration;
    }
    else if(targetDist < AI_TARGET_SAFEDIST && targetDist > AI_TARGET_AVOIDDIST) {
      //slow down as we get close
      if(this.speed-this.acceleration > 0) this.speed-=this.acceleration/2;
    }
    else {
      //try to escape
      targetAngle +=Math.PI/2;
      if(this.speed < AI_MAXSPEED) this.speed+=this.acceleration;
    }
  }
  else {
    //lost the player
    if(this.speed-this.acceleration > 0) this.speed-=this.acceleration;
  }

  //Correct target angle to within range
  if(targetAngle < 0 ) targetAngle+=Math.PI*2;
  if(targetAngle >Math.PI*2) targetAngle -= Math.PI*2;
  
  
  if(targetAngle - this.angle > AI_ROTSPEED ||
     targetAngle - this.angle < - AI_ROTSPEED) {
  if( targetAngle > Math.PI*1.75 && this.angle <Math.PI*0.25 ) this.angle -= AI_ROTSPEED;
  else if( this.angle > Math.PI*1.75 && targetAngle <Math.PI*0.25 ) this.angle += AI_ROTSPEED;
  else if(targetAngle < this.angle) this.angle -= AI_ROTSPEED;
  else if(targetAngle > this.angle) this.angle += AI_ROTSPEED;
  }
  
  //correct my angle to within range
  if(this.angle < 0 ) this.angle+=Math.PI*2;
  if(this.angle >Math.PI*2) this.angle -= Math.PI*2;
  

  if(this.invulnerabilityTimer>0) {
    this.invulnerabilityTimer -= 1/dt;
  }
  if(this.weaponTimer > 0) {
    this.weaponTimer -= 1/dt;
  }
  if(targetDist < AI_TARGET_SAFEDIST && this.weaponTimer<=0 ) {
    entities.add(new Laser(this.posX-this.width/2,
                           this.posY-this.height/2, 
                           this.angle,
                           false));
    this.weaponTimer = AI_WEAPON_TIMEOUT;
  }
  
  //Call the parent function to update position
  MoveableEntity.prototype.update.call(this);  
}

AIShip.prototype.damage = function(dmg) {
  //Don't call parent because it presently has no implementation
  //TODO: Possibly move this to parent
  if(this.invulnerabilityTimer <=0 ) {
    this.health-=dmg;
    sprites.add(new Sprite(this.posX, this.posY, 1, imgExplode, 6, 4, false, true));
    audioExplode.currentTime = 0;
    audioExplode.play();
    this.invulnerabilityTimer = AI_INVULNERABLE_TIMEOUT;
  }
  
}

AIShip.prototype.draw = function() {
  ctx.save();
  ctx.translate((this.posX-this.width/2 -camX), 
                (this.posY-this.height/2 -camY));
  ctx.rotate(this.angle);

  ctx.drawImage(imgEnemy,-this.width/2,-this.height/2);
  ctx.restore();
}
