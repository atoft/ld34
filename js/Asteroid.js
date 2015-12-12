/*
 * A space rock, which drifts with a set speed and rotation.
 * A child type of MoveableEntity
 */
 
function Asteroid(posX, posY, width, height, speed, angle, driftSpeed, isDebris) {
  this.driftAngle = 0;
  this.driftSpeed = driftSpeed;
  MoveableEntity.call(this,posX, posY, width, height, angle);
  this.speed = speed;
  this.health = ASTEROID_HEALTH;
  this.invulnerabilityTimer = 0;
  this.isDebris = isDebris;
}

Asteroid.prototype = Object.create(MoveableEntity.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.update = function() {
  this.driftAngle += this.driftSpeed * dt;
  if(this.driftAngle > 2*Math.PI) this.driftAngle -= 2*Math.PI;
  else if (this.driftAngle < 0) this.driftAngle += 2*Math.PI;
  
  //TODO: Should asteroids collide with one another?
  
  if(this.health <= 0) {
    console.log("!!!!!!!asteroid destroyed");
    entities.remove(this);
    
    //Create debris from the explosion
    if(!this.isDebris) {
      for(i=0; i<3; i++) {
        entities.add( new Asteroid(this.posX, 
                                 this.posY, 
                                 this.width/3, 	            //width
                                 this.height/3,		    //height
                                 0.05+this.speed,	    //move speed
                                 this.angle + i*Math.PI*2/3,  //start angle
                                 (i-1)*0.1*Math.PI/360,     //rot speed
                                 true ));                   //is debris
      }
    }
  }
  
  if(this.invulnerabilityTimer>0) { //TODO: Move this behaviour to the parent type
    this.invulnerabilityTimer -= 1/dt;
  }
  
  //Call the parent function to update position
  MoveableEntity.prototype.update.call(this);  
}

Asteroid.prototype.damage = function(dmg) {
  //Don't call parent because it presently has no implementation
  //TODO: Possibly move this to parent
  if(this.invulnerabilityTimer <=0 ) {
    console.log("asteroid damaged, health="+this.health);
    this.health-=dmg;
    this.invulnerabilityTimer = ASTEROID_INVULNERABLE_TIMEOUT;
  }
  
}

//Asteroids are drawn at their drift angle, rather than their angle of movement
Asteroid.prototype.draw = function() {
  ctx.save();
  ctx.translate((this.posX-this.width/2-camX), 
                (this.posY-this.height/2-camY));
  ctx.rotate(this.driftAngle);

  ctx.beginPath();
  ctx.rect(-this.width/2, -this.height/2, 
            this.width, this.height);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}
