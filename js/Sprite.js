/*
 * An animated image.
 */
 
 
var Sprite = function(posX, posY, scale, image,numFrames,ticksPerFrame,isLooped,isInWorld,callback) {
  this.posX = posX;
  this.posY = posY;
  this.scale = scale;
  
  this.image = image;
  
  this.numFrames = numFrames;
  this.ticksPerFrame = ticksPerFrame;
  this.isLooped = isLooped;
  this.isInWorld = isInWorld;
  
  this.currentFrame = 0;
  this.tickCount = 0;
  
  if(callback) this.callback = callback;
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
      if(this.callback) this.callback();
      sprites.remove(this);
    }
  }
}

Sprite.prototype.damage = function(dmg) {
  return;
} 

Sprite.prototype.draw = function() {
  ctx.save();
  if(this.isInWorld) ctx.translate((this.posX -camX-this.image.width*this.scale/(2*this.numFrames)), 
                (this.posY -camY-this.image.height*this.scale/2));
                
  ctx.drawImage(
    this.image,
    this.currentFrame * this.image.width / this.numFrames,
    0,
    this.image.width / this.numFrames,
    this.image.height,
    0,
    0,
    this.scale*this.image.width / this.numFrames,
    this.scale*this.image.height);

  ctx.restore();
}
