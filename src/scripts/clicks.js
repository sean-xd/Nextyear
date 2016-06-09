function toggleVideo(e){
  var id = pa(e).id;
  if(!active.theatre) toggleDrawer(el("h3", pa(pa(pa(e))))[0].textContent);
  if(active.video !== id){
    active.video = id;
    return player.loadPlaylist(list[active.group], list[active.group].indexOf(id));
  }
  (player.getPlayerState() === 5) ? player.playVideo() : player.stopVideo();
}

function nextVideo(){
  active.video = list[active.group][list[active.group].indexOf(active.video) + 1];
  player.nextVideo();
}

function previousVideo(){
  if(list[active.group].indexOf(active.video) < 1) return;
  active.video = list[active.group][list[active.group].indexOf(active.video) - 1];
  player.previousVideo();
}

function updown(e){
  clt(dom.drawer, "bigger");
  clt(dom.main, "nope");
  clt(el(".updown", pa(e))[0], "flip");
  clt(pa(e), "bar");
}

clk(dom.main, e => {
  if(clc(e, "updown")) updown(e);
  if(clc(e, "group")) active.theatre ? updown(e) : toggleDrawer(e.textContent);
  if(clc(e, "remove")) removeGroup(e);
  if(clc(e, "refresh")) load(pa(pa(e)).id, 1);
  if(clc(e, "add")) addChannel(e);
  if(clc(e, "delete")) removeChannel(e);
  if(clc(e, "video-img") || clc(e, "video-title")) toggleVideo(e);
  if(clc(e, "close")) toggleDrawer(pa(e).id);

  // CHANGE THIS SHIT
  // if(clc(e, "settings")){
  //   if(active.theatre) toggleDrawer();
  //   clt(el(".panel", pa(e))[0], "show");
  // }
});

clk(".next", nextVideo);
clk(".prev", previousVideo);
