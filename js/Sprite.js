/*
 * An animated image.
 */
 
 
var Sprite = function(posX, posY, image,numFrames,ticksPerFrame,isLooped,isInWorld) {
  this.posX = posX;
  this.posY = posY;
  
  
  this.image = image;
  
  this.numFrames = numFrames;
  this.ticksPerFrame = ticksPerFrame;
  this.isLooped = isLooped;
  this.isInWorld = isInWorld;
  
  this.currentFrame = 0;
  this.tickCount = 0;
}

Sprite.prototype.update = function() {      
  this.tickCount++;
  
  if(this.tickCount > this.ticksPerFrame) {
    this.tickCount = 0;
    this.currentFrame++;
  } 
  if(this.currentFrame > this.numFrames) {
    if(this.isLooped) this.currentFrame = 0;
    else {
      sprites.remove(this);
    }
  }
}

Sprite.prototype.damage = function(dmg) {
  return;
} 

Sprite.prototype.draw = function() {
  console.log("Sprite draw called");
  ctx.save();
  
  if(this.isInWorld) ctx.drawImage(
    this.image,
    this.currentFrame * this.image.width / this.numFrames,
    0,
    this.image.width / this.numFrames,
    this.image.height,
    this.posX -camX-this.image.width/(2*this.numFrames),
    this.posY -camY-this.image.height,
    this.image.width / this.numFrames,
    this.image.height);
    
  else ctx.drawImage(
    this.image,
    this.currentFrame * this.image.width / this.numFrames,
    0,
    this.image.width / this.numFrames,
    this.image.height,
    this.posX ,
    this.posY ,
    this.image.width / this.numFrames,
    this.image.height);
  ctx.restore();
}
