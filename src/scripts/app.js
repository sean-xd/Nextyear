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
  groups = lsod("groups", {});

var keys = Object.keys(groups),
  inception = Magic(keys.length, () => {
    keys.sort().forEach(key => draw(key));
    inception = false;
  });

if(Object.keys(groups).length) Object.keys(groups).forEach(key => load(key));

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
