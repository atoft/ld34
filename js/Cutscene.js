var cs_scrollscale = 1;
var cs_logoscale = 2;
var cs_y = 360;

var cs_clickTimeout = 0;

function drawCutscene() {
  if(!cutscene) return;

  ctx.clearRect(0,0,PX_WIDTH,PX_HEIGHT);
  bg = ctx.createPattern(imgStarscape,"repeat");
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,PX_WIDTH,PX_HEIGHT);

  if(cs_logoscale > 0.1) {
    ctx.drawImage(imgLogo, (PX_WIDTH-imgLogo.width   * cs_logoscale)/2, 
                           (PX_HEIGHT-imgLogo.height * cs_logoscale)/2, 
                            imgLogo.width * cs_logoscale,imgLogo.height * cs_logoscale);
    cs_logoscale = cs_logoscale * 0.99;
    lmbClicked = false;
  }
  
  else if(cs_y>-240) {

    cs_y-=0.4;
    cs_scrollscale -=0.001*cs_scrollscale;
  

    ctx.drawImage(imgScroll, (PX_WIDTH-imgScroll.width * cs_scrollscale)/2, 
                           cs_y, imgScroll.width * cs_scrollscale,imgScroll.height * cs_scrollscale);
    if(lmbClicked) {
      cs_y = -360;
      lmbClicked = false;
    }
          
    
  }
  else {
    ctx.drawImage(imgMenu, 0, 0);
    cs_clickTimeout++; //This is very rubbish
    if(lmbClicked) {
      cutscene = false;
    }
  }
}
