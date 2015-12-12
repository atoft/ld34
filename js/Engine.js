/*
 * The main game logic, data and loop.
 */
 
//The origin of the world is the top-left corner of the "map"
var WORLD_WIDTH  = 10000;
var WORLD_HEIGHT = 10000;
    
var SPAWN_POSX = WORLD_WIDTH/2;
var SPAWN_POSY = WORLD_HEIGHT/2;
    
var NUM_ASTEROIDS = 160;
var ASTEROID_HEALTH = 3;
var ASTEROID_INVULNERABLE_TIMEOUT = 2.5;
var LASER_LIFETIME = 5;
var LASER_LENGTH = 100;
var LASER_SPEED = 1;
var WEAPON_TIMEOUT = 1;
    
var PLAYER_MAXHEALTH = 5;
var PLAYER_INVULNERABLE_TIMEOUT = 5;
    
var PARALLAX_SCALE = 4;

//Camera
var camX = 0;
var camY = 0;
    
var entities;
var player;

var gameOver;
var victory;


    
var Engine = function() {
  entities = new buckets.LinkedList();
  player = new Player(SPAWN_POSX, SPAWN_POSY, 0.5);
  entities.add( player );
  

    
  for(i=0;i<NUM_ASTEROIDS;i++) {
    console.log("Created asteroid "+i);
    entities.add( new Asteroid(Math.random() * WORLD_WIDTH, 
                               Math.random() * WORLD_HEIGHT, 
                               40 + Math.random()*40, 	          //width
                               40 + Math.random()*40,	          //height
                               0.05+Math.random()*0.2,	          //move speed
                               Math.random()*Math.PI*2,           //start angle
                               Math.random()*0.1*Math.PI/360,     //rot speed
                               false)                             //is not debris
                               );                           
  }
  _draw();
}


/*Screen functions*/           
function _drawDebugInfo() {
  ctx.font = "16px Pixel";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("FPS: "+Math.round(1000/dt)+"     Player: ("+
               Math.round(player.posX)+", "+
               Math.round(player.posY)+")", 100, 20);
}
function _drawStats() {
  ctx.font = "16px Pixel";
  ctx.fillStyle = "#ff0000";
  ctx.fillText("Health: "+player.health+"  Invincible: "+player.invulnerabilityTimer, 100, 40);
}
function _gameOver() {
  if(lmbPressed) {
    gameOver = false;
    new Engine();
  }
  else requestAnimationFrame(_gameOver);
  ctx.beginPath();
  ctx.rect(PX_WIDTH/2-200,PX_HEIGHT/2-100,400,200);
  ctx.fillStyle = "black";
  ctx.strokeStyle = "yellow";
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
    
/*Main game*/
function _draw() {
  if(gameOver) _gameOver();
  //else if(victory) _victory();
  else requestAnimationFrame(_draw);
      
  //Calculate the amount, dt, to advance the simulation by
  var now = new Date().getTime();
  dt = now - (time || now);
  time = now; 

      
  //Wipe the screen
  ctx.clearRect(0,0,PX_WIDTH,PX_HEIGHT);
      
  //Update every entity
  entities.forEach(function(element) {
    element.update();
  });
  
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
      
  _drawDebugInfo();
  _drawStats();
      
  //Draw every entity
  entities.forEach(function(element) {
    element.draw();
  });

}


