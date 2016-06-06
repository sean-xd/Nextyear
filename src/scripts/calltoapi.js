function getChannelVideosProd(name, cb){
  hp(`http://0421.io:4258/channel/${name}`, data => {
    if(!channels[cname]) channels[cname] = {videos: data};
    else channels[cname].videos = data;
    channels[cname].nextUpdate = Date.now() + (1000 * 60 * 5);
    cb();
  });
}

function channel(name, cb){
  hp(`https://www.googleapis.com/youtube/v3/channels?key=${apikey}&forUsername=${name}&part=id`, cb);
}

function videos(id, cb){
  if(is(id, "Object")) id = id.items[0].id;
  hp(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apikey}&playlistId=UU${id.slice(2)}&part=snippet&maxResults=24`, cb);
}

function getChannelVideos(cname, cb){
  channel(cname, cdata => {
    videos(cdata, vdata => {
      if(!channels[cname]) channels[cname] = {videos: []};
      channels[cname].videos = channels[cname].videos
        .concat(formatVideos(cname, vdata))
        .sort(sorter(e => e.date));
      channels[cname].nextUpdate = Date.now() + (1000 * 60 * 5);
      cb();
    });
  });
}

function formatVideos(cname, data){
  var videoIds = channels[cname].videos.map(e => e.id);
  return data.items.filter(e => videoIds.indexOf(e.snippet.resourceId.videoId) === -1).map(item => {
    var e = item.snippet, d = new Date(e.publishedAt);
    return {
      date: d.getTime(),
      title: e.title,
      src: e.thumbnails.medium.url,
      id: e.resourceId.videoId,
      cname: e.channelTitle,
      cid: e.channelId
    };
  });
}
