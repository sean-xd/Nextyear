var ls = localStorage, // Localstorage alias.
  player, // Req for youtube player api.
  ytapi = "https://www.googleapis.com/youtube/v3/",
  dom = { // Caching dom elements.
    nav: el("nav")[0],
    main: el("main")[0],
    sections: {},
    create: el(".create")[0],
    createInput: el(".create-input")[0],
    playbackInput: el(".playback-input")[0],
    content: el(".content")[0],
    aside: el("aside")[0],
    drawer: el(".drawer")[0]
  },
  active = {playing: false, group: false, theatre: false, create: false, side: false}, // Essentially all application state.
  channels = lsod("channels", {}), // Get channels from ls or set to {}.
  groups = lsod("groups", {}), // Get groups from ls or set to {}.
  gk = Object.keys(groups).sort(), // Sort groups.
  inception = Magic(gk.length, () => gk.forEach(key => draw(key))); // Wait for all groups then draw each group.

function onYouTubeIframeAPIReady(){
  player = new YT.Player("player", { // New youtube player.
    playerVars: {controls: 1, showinfo: 0, iv_load_policy: 3}, // Show controls, hide annotations.
    events: {onStateChange: onPlayerStateChange, onReady: () => gk.forEach(key => load(key, inception))} // Load each group.
  });
}

function onPlayerStateChange(e){
  var videoId = player.getVideoData().video_id, lastVdom = el(".active")[0], // Video id & Old active video dom.
    ch = okr(channels, (res, key) => channels[key].videos.map(e => e.id).indexOf(videoId) > -1 ? key : res, 0), // Get channel name from video id.
    videos = channels[ch].videos.map(e => e.id), // Map list of video objects to list of video ids.
    latestIndex = videos.indexOf(channels[ch].latest), // Most recently watched video index.
    videoIndex = videos.indexOf(videoId); // Currently playing video index.
  if(e.data === -1 && active.playing) clr(lastVdom, "active"); // If stopped and was playing remove active.
  if(e.data !== 1) active.playing = false; // If not playing set playing to false;
  if(e.data === 1){ // If playing:
    if(videoIndex < latestIndex) updateRecent(ch, videoId, videoIndex); // Update most recently watched video.
    if(lastVdom && lastVdom.id === videoId) return; // If same video do nothing.
    if(lastVdom && lastVdom.id !== videoId) clr(lastVdom, "active"); // If different video remove active.
    if(!el("#" + videoId)) player.nextVideo(); // (If you delete a video it stays in the list until update so this will pass it.)
    else cla(el("#" + videoId), "active"); // Add active (new video / different video).
    active.playing = true; // Set playing to true.
  }
}

function updateRecent(cn, id, index){
  channels[cn].latest = id;
  el(`#${cn}-new`).textContent = index;
  lss("channels", channels);
}

function load(name, cb){ // Load group.
  var magic = Magic(groups[name].channels.length, () => { // Wait for each channel:
    lss("channels", channels); // Save channels.
    cb(name); // Invoke callback.
  });
  groups[name].channels.forEach(cname => { // For each channel:
    if(channels[cname] && Date.now() < channels[cname].nextUpdate) return magic(); // If you have recent data return magic.
    getChannelVideos(cname, magic); // Sets channels[cname] with data from API and calls magic.
  });
}

function getChannelVideos(cname, cb){
  if(!channels[cname]) channels[cname] = {videos: []}; // If no channel create channel.
  var magic = Magic(1, () => { // Wait for channel id:
    hp(`${ytapi}playlistItems?key=${apikey}&playlistId=UU${channels[cname].id}&part=snippet&maxResults=24`, vdata => { // Get video data from yt api.
      channels[cname].videos = channels[cname].videos // Set channel videos:
        .concat(formatVideos(cname, vdata)) // Format and concat new videos.
        .sort(sorter(e => Date.now() - e.date)); // Sort by date.
      channels[cname].nextUpdate = Date.now() + (1000 * 60 * 5); // Set ttl.
      cb(); // Invoke callback.
    });
  });
  if(channels[cname].id) return magic(); // If you have channel id, return magic.
  hp(`${ytapi}channels?key=${apikey}&forUsername=${name}&part=id`, cdata => { // Get channel id from yt api.
    channels[cname].id = cdata.items[0].id.slice(2); // Set channel id.
    magic(); // Invoke magic.
  });
}

function formatVideos(cname, data){
  var videoIds = channels[cname].videos.map(e => e.id); // Get map of video ids.
  return data.items.filter(e => videoIds.indexOf(e.snippet.resourceId.videoId) === -1).map(item => { // Filter stored videos.
    var e = item.snippet, d = new Date(e.publishedAt); // Item body & published date
    return {date: d.getTime(), title: e.title, src: e.thumbnails.medium.url, id: e.resourceId.videoId, cname: e.channelTitle, cid: e.channelId};
  });
}

function getPlaylist(name){
  var playlist = groups[name].channels.reduce((arr, cn) => { // Set playlist to reduce channels:
    return arr.concat(channels[cn].videos.filter(v => groups[name].banlist.indexOf(v.id) === -1)); // Filter banned videos and concat to list.
  }, []).sort(sorter(e => Date.now() - e.date)); // Sort by date.
  return playlist.length > 100 ? playlist.slice(0,99) : playlist; // Return up to 100 ids.
}

function draw(name){
  dom.sections[name] = t("section", {id: name})([ // Build and store section dom.
    t(".group")(name), // <div class="group">name</div>
    t("i", {classes: ["material-icons", "close"]})("close"), // <div class="material-icons close">close</div>
    t(".list")() // <div class="list"></div>
  ]);
  var vlist = el(".list", dom.sections[name])[0], // Select list container dom.
    playlist = getPlaylist(name); // Get playlist array.
  playlist.forEach(e => vlist.appendChild(videoDom(e))); // Append videos to list container dom.
  groups[name].list = playlist.map(e => e.id); // Cache the ids.
  dom.main.appendChild(dom.sections[name]); // Append section to main dom.
  dom.aside.appendChild(groupSideDom(name)); // Append group to sidebar.
}

function videoDom(data){
  return t(".video", {id: data.id})([
    t(".video-del")("x"),
    t("img", {classes: ["video-img"], src: data.src})(),
    t(".video-title")(data.title),
    t(".video-links")(data.cname)
  ]);
}

function updateDom(name){
  var vlist = el(".list", dom.sections[name])[0], ch = vlist.children; // List container dom & children of list.
  while(ch.length) vlist.removeChild(ch[0]); // Remove videos from list.
  var playlist = getPlaylist(name); // Get playlist.
  playlist.forEach(e => vlist.appendChild(videoDom(e))); // Append videos to list container dom.
  groups[name].list = playlist.map(e => e.id); // Get just the video ids.
  if(el("#" + player.videoData().video_id)) cla(el("#" + player.videoData().video_id), "active");
}

function closeGroup(name){
  ["expand", "bar"].forEach(c(clr, el("#" + name))); // Removes expand and/or bar from a group section.
}

function closeDrawer(){
  ["open", "bigger"].forEach(c(clr, dom.drawer)); // Close drawer.
  clr(dom.nav, "playing"); // Change nav.
  active.group = false; // Set active group to false.
  active.theatre = false; // Set theatre to false;
  gk.forEach(key => clr(el("#" + key), "hide")); // Show all groups.
  player.stopVideo(); // Stop video.
}

function toggleDrawer(name, dontCue){
  if(active.group) closeGroup(active.group); // If something is active close it.
  if(active.group === name) return closeDrawer(); // If group is active close drawer.
  if(!active.theatre){ // If theatre is closed:
    active.theatre = true; // Change theatre.
    cla(dom.drawer, "open"); // Toggle drawer open.
    cla(dom.nav, "playing"); // Toggle nav playing.
  }
  if(!dontCue) player.cuePlaylist(groups[name].list); // Cue playlist.
  player.setPlaybackRate(groups[name].playback); // Set playback.
  gk.forEach(key => (key === name) ? clr(el("#" + key), "hide") : cla(el("#" + key), "hide")); // Hide all groups except active.
  cla(el("#" + name), "expand"); // Expand group.
  active.group = name; // Set active group.
}

function toggleVideo(e){
  if(!active.theatre) toggleDrawer(el(".group", pa(pa(pa(e))))[0].textContent, 1); // If no theatre, open drawer.
  var id = pa(e).id, videoId = player.getVideoData() ? player.getVideoData().video_id : ""; // Clicked video id & current video id.
  if(videoId !== id) player.loadPlaylist(groups[active.group].list, groups[active.group].list.indexOf(id)); // If ids dont match load new list.
  (player.getPlayerState() === 5) ? player.playVideo() : player.stopVideo(); // If the video is inbetween play otherwise stop.
}

function banVideo(e){
  var video = pa(e), list = pa(video), group = pa(list); // Video, list, & group dom.
  if(video.id === player.getVideoData().video_id) player.nextVideo(); // If the current video is banned play the next video.
  groups[group.id].banlist.push(video.id); // Push the clicked video id to the ban list.
  list.removeChild(video); // Remove video from list dom.
  lss("groups", groups); // Save groups.
}

clk(dom.main, e => {
  if(clc(e, "group") && active.theatre){clt(dom.drawer, "bigger"); clt(pa(e), "bar");}
  if(clc(e, "group") && !active.theatre) toggleDrawer(e.textContent);
  if(clc(e, "video-img") || clc(e, "video-title")) toggleVideo(e);
  if(clc(e, "video-del")) banVideo(e);
  if(clc(e, "close")) toggleDrawer(pa(e).id);
});

clk(".next", () => player.nextVideo());
clk(".prev", () => player.previousVideo());
