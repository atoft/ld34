/*
 * The main game logic, data and loop.
 */
 
//The origin of the world is the top-left corner of the "map"
var WORLD_WIDTH  = 10000;
var WORLD_HEIGHT = 10000;
    
var SPAWN_POSX = WORLD_WIDTH/2;
var SPAWN_POSY = WORLD_HEIGHT/2;
var SPAWN_SAFE_RADIUS = 200;
    
var NUM_ASTEROIDS = 160;
var ASTEROID_HEALTH = 3;
var ASTEROID_INVULNERABLE_TIMEOUT = 2.5;
var ASTEROID_CONTAINS_HEALTH_PROBABILITY = 0.2;
var LASER_LIFETIME = 2.5;
var LASER_LENGTH = 100;
var LASER_SPEED = 1;
var WEAPON_TIMEOUT = 1;
    
var PLAYER_MAXHEALTH = 5;
var PLAYER_INVULNERABLE_TIMEOUT = 5;
var PLAYER_ROTSPEED = 5 *2*Math.PI/360;


var NUM_AI = 5;
var AI_MAXSPEED = 0.25;
var AI_ACCELERATION = 0.1;
var AI_ROTSPEED = 5 *2*Math.PI/360;
var AI_MAXHEALTH = 3;
var AI_INVULNERABLE_TIMEOUT = 5;
var AI_WEAPON_TIMEOUT = 2;
var AI_RANGE = 1000;
var AI_TARGET_SAFEDIST = 250;
var AI_TARGET_AVOIDDIST = 200;

var PICKUP_SIZE = 40;
var NUM_JUNK = 15;
var NUM_HEALTH = 15;
var JUNK_NEEDED = 5;
    
var PARALLAX_SCALE = 8;
var PARALLAX_SCALE2 = 4;

//Camera
var camX = 0;
var camY = 0;
    
var entities;
var player;
var sprites;

var gameOver;
var victory;
var numJunk;
var numAstDestroyed;
var numAI = NUM_AI;

var cutscene = true;


    
var Engine = function() {
  //Initialise game objects
  numJunk = 0;
  numAstDestroyed = 0;
  numAI = NUM_AI;
  entities = new buckets.LinkedList();
  sprites = new buckets.LinkedList();
  player = new Player(SPAWN_POSX, SPAWN_POSY, 0.5);
  entities.add( player );
  
  //Randomly generate all the objects in the level
  for(i=0;i< NUM_ASTEROIDS + NUM_JUNK + NUM_HEALTH + NUM_AI;i++) {
    rangeCheck = false;
    while(!rangeCheck) {
      x = Math.random() * WORLD_WIDTH;
      y = Math.random() * WORLD_HEIGHT;
      if( x< SPAWN_POSX-SPAWN_SAFE_RADIUS || x> SPAWN_POSX+SPAWN_SAFE_RADIUS
          || y< SPAWN_POSY-SPAWN_SAFE_RADIUS || y> SPAWN_POSY+SPAWN_SAFE_RADIUS ) {
        rangeCheck = true;    
      }
    }
    if(i < NUM_ASTEROIDS) 
    entities.add( new Asteroid(x, 
                               y, 
                               40 + Math.random()*40, 	          //width
                               40 + Math.random()*40,	          //height
                               0.05+Math.random()*0.2,	          //move speed
                               Math.random()*Math.PI*2,           //start angle
                               Math.random()*0.1*Math.PI/360,     //rot speed
                               1+Math.round(Math.random()*3) )     //is any type except debris
                               );    
    else if(i< NUM_ASTEROIDS + NUM_JUNK)       
    entities.add( new Pickup  (x, 
                               y, 
                               0,	          //move speed
                               0,                 //start angle
                               0.02*Math.PI/360,  //rot speed
                               1)                 //is space junk
                               ); 
    else if(i< NUM_ASTEROIDS + NUM_JUNK + NUM_HEALTH)            
    entities.add( new Pickup  (x, 
                               y, 
                               0,	          //move speed
                               0,                 //start angle
                               0.02*Math.PI/360,  //rot speed
                               0)                 //is health
                               ); 
    else entities.add( new AIShip (x, y, player) );        
  }
  
  _draw();
}


/*Screen functions*/           
function _drawDebugInfo() {
  ctx.font = "16px Pixel";
  ctx.fillStyle = "red";
  ctx.fillText("FPS: "+Math.round(1000/dt)+"     Player: ("+
               Math.round(player.posX)+", "+
               Math.round(player.posY)+")", 100, 320);
}
function _drawStats() {
    
  ctx.save();
  ctx.translate(100,20);
  hpat = ctx.createPattern(iconHealth,"repeat");
  ctx.fillStyle = hpat;
  ctx.fillRect(0,0,16*player.health,16);
  ctx.restore();
  
  if(numJunk > 5) jdisp = 5;
  else jdisp = numJunk;
  ctx.save();
  ctx.translate(540-jdisp*16,20);
  jpat = ctx.createPattern(iconJunk,"repeat");
  ctx.fillStyle = jpat;
  ctx.fillRect(0,0,16*jdisp,16);
  ctx.restore();
  
  
  ctx.font = "16px Pixel";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("Enemies Detected: "+numAI,100, 340);
}
function _drawCursor() {
  ctx.drawImage(imgCrosshair,mouseX-imgCrosshair.width/2,mouseY-imgCrosshair.height/2);
}



function _gameOver() {
  if(lmbClicked) {
    gameOver = false;
    tmppressed = false;
    tmpreleased = false;
    new Engine();
  }
  else requestAnimationFrame(_gameOver);
  ctx.beginPath();
  ctx.rect(PX_WIDTH/2-200,PX_HEIGHT/2-100,400,200);
  ctx.fillStyle = "black";
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  
  ctx.fillStyle = "yellow";
  ctx.font = "16px Pixel";
  ctx.fillText("GAME OVER!",PX_WIDTH/2-180,PX_HEIGHT/2-70);
  ctx.fillText("The Empire is",PX_WIDTH/2-180,PX_HEIGHT/2-40);
  ctx.fillText("victorious.",PX_WIDTH/2-180,PX_HEIGHT/2-10);
  ctx.fillText("Click to retry",PX_WIDTH/2-180,PX_HEIGHT/2+50);
  
}
function _victory() {
  requestAnimationFrame(_victory);
  //TODO: Do a victory animation
  ctx.beginPath();
  ctx.rect(PX_WIDTH/2-200,PX_HEIGHT/2-100,400,200);
  ctx.fillStyle = "black";
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  
  ctx.fillStyle = "yellow";
  ctx.font = "16px Pixel";
  ctx.fillText("CONGRATULATIONS",PX_WIDTH/2-180,PX_HEIGHT/2-70);
  ctx.font = "8px Pixel";
  ctx.fillText("You esacaped the Empire!",PX_WIDTH/2-180,PX_HEIGHT/2-40);
  ctx.fillText("...this time.",PX_WIDTH/2-180,PX_HEIGHT/2-25);
  ctx.fillText("Asteroids destroyed: "+numAstDestroyed,PX_WIDTH/2-180,PX_HEIGHT/2-10);
  ctx.fillText("Enemies destroyed: "+NUM_AI,PX_WIDTH/2-180,PX_HEIGHT/2-10);
}
    
/*Main game*/
function _draw() {
  lmbClicked = false;
  if(gameOver) _gameOver();
  else if(victory) _victory();
  else requestAnimationFrame(_draw);
      
  //Calculate the amount, dt, to advance the simulation by
  var now = new Date().getTime();
  dt = now - (time || now);
  time = now; 

  if(cutscene) drawCutscene();
  else if(paused) {
    ctx.fillStyle = "yellow";
    ctx.font = "16px Pixel";
    ctx.fillText("PAUSED",PX_WIDTH/2-48,PX_HEIGHT/2-4);
  }
  else {    
  //Wipe the screen
  ctx.clearRect(0,0,PX_WIDTH,PX_HEIGHT);
   

  //Update every entity
  entities.forEach(function(element) {
    element.update();
  });
  
  //Check for victory
  if(numJunk == JUNK_NEEDED && numAI == 0) victory = true;
  
  //Reposition the camera
  camX = player.posX -PX_WIDTH/2 -player.width/2;
  camY = player.posY -PX_HEIGHT/2 -player.height/2;
  //TODO: Apply camera as ctx offset here?
  
        
  //Draw the background
  //TODO: Move somewhere else
  bg = ctx.createPattern(imgStarscape,"repeat");
  ctx.fillStyle = bg;
  ctx.save();
  ctx.translate(-camX/PARALLAX_SCALE,-camY/PARALLAX_SCALE);
  ctx.fillRect(camX/PARALLAX_SCALE,camY/PARALLAX_SCALE,PX_WIDTH,PX_HEIGHT);
  ctx.restore();
  
  bg = ctx.createPattern(imgDust,"repeat");
  ctx.fillStyle = bg;
  ctx.save();
  ctx.translate(-camX/PARALLAX_SCALE2,-camY/PARALLAX_SCALE2);
  ctx.fillRect(camX/PARALLAX_SCALE2,camY/PARALLAX_SCALE2,PX_WIDTH,PX_HEIGHT);
  ctx.restore();
      
  //Draw map edge
  ctx.beginPath();
  ctx.rect(-camX,-camY,WORLD_WIDTH,WORLD_HEIGHT);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 16;
  ctx.stroke();
  ctx.closePath();
      
  //Draw every entity
  entities.forEach(function(element) {
    //TODO: Check the entity is within drawable range
    element.draw();
  });
  
  //Draw animations
  sprites.forEach(function(element) {
    element.update();
    element.draw();
  });
  
  //_drawDebugInfo();
  _drawStats();
  _drawCursor();
  mouseMoved = false; //TODO: Is this the best way to handle this?
  }
}


