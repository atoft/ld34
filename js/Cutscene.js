var cs_scrollscale = 1;
var cs_logoscale = 2;
var y = 360;



function drawCutscene() {
  if(cutscene) requestAnimationFrame(drawCutscene);
  ctx.clearRect(0,0,PX_WIDTH,PX_HEIGHT);
  bg = ctx.createPattern(imgStarscape,"repeat");
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,PX_WIDTH,PX_HEIGHT);

  if(cs_logoscale > 0.1) {
    ctx.drawImage(imgLogo, (PX_WIDTH-imgLogo.width   * cs_logoscale)/2, 
                           (PX_HEIGHT-imgLogo.height * cs_logoscale)/2, 
                            imgLogo.width * cs_logoscale,imgLogo.height * cs_logoscale);
    cs_logoscale = cs_logoscale * 0.99;
    if(lmbPressed) {
      cutscene = false;
    }
  }
  
  else if(y>-100) {
    y-=0.2;
    cs_scrollscale -=0.001*cs_scrollscale;
  
    
    ctx.drawImage(imgScroll, (PX_WIDTH-imgScroll.width * cs_scrollscale)/2, 
                           y, imgScroll.width * cs_scrollscale,imgScroll.height * cs_scrollscale);
                           
    
  }
  else {
    ctx.drawImage(imgMenu, 0, 0);
    if(lmbPressed) {
      cutscene = false;
    }
  }
}
