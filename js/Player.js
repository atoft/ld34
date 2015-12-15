/*
 * The player's space-ship. A child type of MoveableEntity.
 */
 
function Player(posX, posY, maxSpeed) {
  //TODO: define player constants
  MoveableEntity.call(this,posX, posY, 40, 40, 0);
  this.maxSpeed = maxSpeed;
  this.acceleration = 0.1;
  this.enginesOn = false;
  this.health = PLAYER_MAXHEALTH;
  
  //Start invulnerable
  this.invulnerabilityTimer = PLAYER_INVULNERABLE_TIMEOUT;
  this.weaponTimer = 0;
  
  this.mouseAngle =0;
  this.usingMouse = false;
}

Player.prototype = Object.create(MoveableEntity.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if(this.health<=0) {
    entities.remove(this);
    audioExplode.currentTime = 0;
    if(!mute) audioExplode.play();
    sprites.add(new Sprite(this.posX, this.posY, 4, imgExplode, 6, 4, false, true,
                function(){gameOver = true;}));

  }

  /******Controls******/
  if(leftPressed) {
    this.usingMouse = false;
    this.angle -= PLAYER_ROTSPEED;
  }
  if(rightPressed) {
    this.usingMouse = false;
    this.angle += PLAYER_ROTSPEED;
  }
  if(mouseMoved) {
    this.usingMouse = true;
    this.mouseAngle = Math.atan( (mouseX - canvas.width/2) / -(mouseY - canvas.height/2) );
    if(mouseY > canvas.height/2) this.mouseAngle += Math.PI;
    if(this.mouseAngle < 0) this.mouseAngle += Math.PI*2;

  }
  if(this.usingMouse) {
  if(this.mouseAngle - this.angle > PLAYER_ROTSPEED ||
     this.mouseAngle - this.angle < - PLAYER_ROTSPEED) {
  if( this.mouseAngle > Math.PI*1.5 && this.angle <Math.PI*0.5 ) this.angle -= PLAYER_ROTSPEED;
  else if( this.angle > Math.PI*1.5 && this.mouseAngle <Math.PI*0.5 ) this.angle += PLAYER_ROTSPEED;
  else if(this.mouseAngle < this.angle) this.angle -= PLAYER_ROTSPEED;
  else if(this.mouseAngle > this.angle) this.angle += PLAYER_ROTSPEED;
  }
  }
  if(upPressed || lmbPressed) {
    if(this.speed < this.maxSpeed) this.speed +=this.acceleration;
    this.enginesOn = true;
  }
  else {
    this.speed -= this.acceleration/4;
    this.enginesOn = false;
  }
  if(this.speed <0) this.speed = 0;
  
  if(this.angle > 2*Math.PI) this.angle -= 2*Math.PI;
  else if (this.angle < 0) this.angle += 2*Math.PI;
  /******End of controls******/
  
  
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
    
    //TODO: This behaviour should be in the Pickup object
    if(this.collide && element instanceof Pickup) {
      if(element.pickupType == 0 && this.health < PLAYER_MAXHEALTH) {
        this.health++;
        if(!mute) audioHealth.play();
      }
      else if(element.pickupType == 1) {
        numJunk++;
        if(!mute) audioJunk.play();
      }
      entities.remove(element);
      this.collide = false;
    }
    if(this.collide && element instanceof AIShip) {
      //quick fix to prevent losing too much health fighting AI
      this.collide = false;
      continue;
    }
    if(this.collide) break;
  }
  if(this.collide) {
    this.damage(1);
    
  }
  if(this.invulnerabilityTimer>0) {
    this.invulnerabilityTimer -= 1/dt;
  }
  if(this.weaponTimer > 0) {
    this.weaponTimer -= 1/dt;
  }
  
  if((spacePressed ||rmbPressed) && this.weaponTimer<=0 ) {
    entities.add(new Laser(this.posX-this.width/2,
                           this.posY-this.height/2, 
                           this.angle,
                           true));
    this.weaponTimer = WEAPON_TIMEOUT;
  }
  
  //Call the parent function to update position
  MoveableEntity.prototype.update.call(this);  
}

Player.prototype.damage = function(dmg) {
  //Don't call parent because it presently has no implementation
  //TODO: Possibly move this to parent
  if(this.invulnerabilityTimer <=0 ) {
    this.health-=dmg;
    sprites.add(new Sprite(this.posX, this.posY, 1, imgExplode, 6, 4, false, true));
    audioExplode.currentTime = 0;
    if(!mute) audioExplode.play();
    this.invulnerabilityTimer = PLAYER_INVULNERABLE_TIMEOUT;
  }
  
}

Player.prototype.draw = function() {
  ctx.save();
  ctx.translate((this.posX-this.width/2 -camX), 
                (this.posY-this.height/2 -camY));
  ctx.rotate(this.angle);

  //ctx.beginPath();
  //ctx.rect(-this.width/2, -this.height/2, 
  //          this.width, this.height);
  //ctx.fillStyle = "blue";
  //ctx.fill();
  //ctx.closePath();
  if(this.enginesOn) sprite = imgShipFly;
  else sprite = imgShip;
  ctx.drawImage(sprite,-this.width/2,-this.height/2);
  ctx.restore();
}
