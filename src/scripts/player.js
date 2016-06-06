function activatePlayer(){
  player = new YT.Player("player", {
    playerVars: {controls: 1, showinfo: 0, iv_load_policy: 3},
    events: {
      onStateChange: onPlayerStateChange,
      onReady: () => {player.cuePlaylist(list[active.group]);}
    },
    videoId: el(".video")[0] ? el(".video")[0].id : list[active.group] ? list[active.group][0] : "MhYqKg3oSQ8"
  });
}

function onYouTubeIframeAPIReady(){activatePlayer();}

function onPlayerStateChange(e){
  if(e.data === 0){
    active.video = list[active.group][list[active.group].indexOf(active.video) + 1];
  }
  if(el(".active")[0] && (e.data === -1 || e.data === 1)){
    clr(el(".active")[0], "active");
  }
  if(el("#" + active.video) && e.data === 1){ // If playing activate video dom.
    cla(el("#" + active.video), "active");
  }
}
