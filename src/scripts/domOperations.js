function openSidebar(){
  clt(dom.content, "small");
  clt(dom.aside, "big");
  clt(dom.drawer, "small");
}

function draw(name, update){
  if(!groups[name]) return;
  if(!dom.sections[name]) dom.sections[name] = sectionDom(name);
  var section = dom.sections[name],
    children = section.children;
  if(update){
    while(children.length > 3) section.removeChild(children[children.length - 1]);
  }
  var playlist = groups[name].channels.reduce((arr, cn) => {
    return arr.concat(channels[cn].videos).filter(v => groups[name].banlist.indexOf(v.id) === -1);
  }, []);
  playlist.sort(sorter(e => Date.now() - e.date));
  playlist.forEach(e => section.appendChild(videoDom(e)))
  list[name] = playlist.map(e => e.id);
  if(list[name].length > 100) list[name] = list[name].slice(0,99);
  if(!update){
    dom.main.appendChild(section);
    dom.aside.appendChild(groupSideDom(name));
  }
  else if(active.video) cla(el("#" + active.video), "active");
}

function toggleDrawer(name){
  var close = false;
  if(!player) activatePlayer();
  if(is(name, "String")){
    if(active.group === name) close = true;
    else {
      if(active.group) clr(el("#" + active.group), "expand");
      active.group = name;
    }
  }
  if(close || !active.theatre){
    active.theatre = !active.theatre;
    clt(dom.drawer, "open");
    clt(dom.content, "bottom");
    clt(dom.nav, "playing");
    clt(dom.main, "space");
    clt(dom.bgbar, "on");
  }
  clt(el("#" + active.group), "expand");
  if(!active.theatre){
    active.group = false;
    active.video = false;
  }
  else dom.content.scrollTop = 220;
  active.group ? player.cuePlaylist(list[active.group]) : player.cueVideoById("mwUo_zZ6URc");
  if(active.group) player.setPlaybackRate(groups[active.group].playback);
  Object.keys(groups).forEach(key => {
    if(!active.group) return clr(el("#" + key), "hide");
    if(key !== active.group) cla(el("#" + key), "hide");
    if(key === active.group) clr(el("#" + key), "hide");
  });
}
