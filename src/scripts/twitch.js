// function getChannelVideosProd(name, cb){
//   hp(`http://0421.io:4258/channel/${name}`, data => {
//     if(!channels[cname]) channels[cname] = {videos: data};
//     else channels[cname].videos = data;
//     channels[cname].nextUpdate = Date.now() + (1000 * 60 * 5);
//     cb();
//   });
// }
//
// Twitch
// function getLiveStream(name, cb){
//   if(!streams[name]) streams[name] = {
//     viewers: 0,
//     img: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${name}-196x110.jpg`,
//     nextUpdate: Date.now() - 1
//   };
//   if(streams[name].nextUpdate > Date.now()) return cb();
//   hp(`https://api.twitch.tv/kraken/streams?channel=${name}`, data => {
//     if(data["_total"]) streams[name].viewers = data.streams[0].viewers;
//     streams[name].nextUpdate = Date.now() + (1000 * 60 * 5);
//     cb();
//   });
// }
//
// function twitchIframe(){
//   <iframe
//     src="http://player.twitch.tv/?channel={CHANNEL}"
//     height="720"
//     width="1280"
//     frameborder="0"
//     scrolling="no"
//     allowfullscreen="true">
//   </iframe>
// }
