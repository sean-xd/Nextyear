var ls = localStorage,
  kyp = Kyp(),
  player,
  dom = {
    nav: el("nav")[0],
    main: el("main")[0],
    sections: {},
    create: el(".create")[0],
    createInput: el(".create-input")[0],
    playbackInput: el(".playback-input")[0],
    content: el(".content")[0],
    aside: el("aside")[0],
    drawer: el(".drawer")[0],
    bgbar: el(".bg-bar")[0]
  },
  active = {
    video: false,
    group: false,
    theatre: false,
    create: false
  },
  list = [],
  channels = lsod("channels", {}),
  groups = lsod("groups", {});

if(Object.keys(groups).length) Object.keys(groups).sort().forEach(key => load(key));

function load(name, update){
  var magic = Magic(groups[name].channels.length, () => {
    lss("channels", channels);
    draw(name, update);
  });
  groups[name].channels.forEach(cname => {
    if(channels[cname] && !update && Date.now() < channels[cname].nextUpdate) return magic();
    getChannelVideos(cname, magic);
  });
}
