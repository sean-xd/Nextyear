var ls = localStorage,
  kyp = Kyp(),
  player,
  dom = {
    nav: el("nav")[0],
    main: el("main")[0],
    sections: {},
    lists: {},
    create: el(".create")[0],
    createInput: el(".create-input")[0],
    playbackInput: el(".playback-input")[0],
    content: el(".content")[0],
    aside: el("aside")[0],
    drawer: el(".drawer")[0]
  },
  active = {
    video: false,
    group: false,
    theatre: false,
    create: false
  },
  list = [],
  channels = lsod("channels", {}),
  groups = lsod("groups", {}),
  keys = Object.keys(groups),
  inception = Magic(keys.length, () => {
    keys.sort().forEach(key => draw(key));
    inception = false;
  });

function load(name, update){
  var magic = Magic(groups[name].channels.length, () => {
    lss("channels", channels);
    inception ? inception() : draw(name, update);
  });
  groups[name].channels.forEach(cname => {
    if(channels[cname] && !update && Date.now() < channels[cname].nextUpdate) return magic();
    getChannelVideos(cname, magic);
  });
}

function draw(name, update){
  if(!groups[name]) return;
  if(!dom.sections[name]){
    dom.sections[name] = sectionDom(name);
    dom.lists[name] = el(".list", dom.sections[name])[0];
  }
  var section = dom.sections[name],
    vlist = dom.lists[name],
    children = vlist.children;
  if(update){
    while(children.length > 3) vlist.removeChild(children[children.length - 1]);
  }
  var playlist = groups[name].channels.reduce((arr, cn) => {
    return arr.concat(channels[cn].videos).filter(v => groups[name].banlist.indexOf(v.id) === -1);
  }, []);
  playlist.sort(sorter(e => Date.now() - e.date));
  playlist.forEach(e => vlist.appendChild(videoDom(e)))
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
  }
  clt(el("#" + active.group), "expand");
  if(!active.theatre){
    active.group = false;
    active.video = false;
  }
  active.group ? player.cuePlaylist(list[active.group]) : player.cueVideoById("mwUo_zZ6URc");
  if(active.group) player.setPlaybackRate(groups[active.group].playback);
  Object.keys(groups).forEach(key => {
    if(!active.group) return clr(el("#" + key), "hide");
    if(key !== active.group) cla(el("#" + key), "hide");
    if(key === active.group) clr(el("#" + key), "hide");
  });
}
