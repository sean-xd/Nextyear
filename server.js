var globals = require("./globals.js");
Object.keys(globals).forEach(key => this[key] = globals[key]);

sx.use(bodyParser.json());

sx.post("/users/new", (req, res) => {
  console.log(req.body);
  res.send(users.find(e => e.name === req.body.name) ? publicData(createUser(req.body)) : {text: "user exists"});
});

sx.post("/users", (req, res) => {
  console.log(req.body);
  var b = req.body, user = users.find(e => e.uid === b.uid),
    checkPass = (b.pass && hsh(b.pass) === user.hash),
    checkToken = (b.token === user.token && b.ttl === user.ttl && b.ttl > Date.now());
  if(!user) res.send({text: "no user"});
  if(checkPass){
    user.token = hsh(b.uid);
    user.ttl = Date.now() + oneWeek;
    fs.writeFile("./db/users.json", JSON.stringify(users));
  }
  if(checkPass || checkToken) res.send(publicData(user));
  res.send({text: "auth failed"});
});

// sx.get("/channel/:name", (req, res) => {});
sx.get("/channel/:id", (req, res) => {
  if(channels[req.params.id] && channels[req.params.id].ttl > Date.now()) res.send(channels[req.params.id]);
  else {
    getChannel(req.params);
  }
});

function getChannel(data){
  var id = data.id || data.name;
}

function createUser(b){
  var uid = hsh(b.name), user = {
    id: users.length, name: b.name, hash: hsh(b.pass), uid: uid, token: hsh(uid), ttl: Date.now() + oneWeek
  };
  users.push(user);
  fs.writeFile("./db/users.json", JSON.stringify(users));
  res.send(publicData(user));
}
function getUser(type, info){return users.filter(e => e[type] === info)[0];}
function hsh(text){return crypto.createHash("md5").update(text + Date.now().toString()).digest("hex");}
function publicData(user){return {uid: user.uid, groups: user.groups || [], token: user.token, ttl: user.ttl};}

function channel(name, cb){
  request(`https://www.googleapis.com/youtube/v3/channels?key=${apikey}&forUsername=${name}&part=id`, (err, res, body) => {
    if(is(body, "String")) body = JSON.parse(body);
    cb(body);
  });
}

function videos(id, cb){
  if(is(id, "Object")) id = id.items[0].id;
  request(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apikey}&playlistId=UU${id.slice(2)}&part=snippet&maxResults=50`, (err, res, body) => {
    if(is(body, "String")) body = JSON.parse(body);
    cb(body);
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

function is(thing, type){
  if(!thing && thing !== 0) return false;
  thing = Object.prototype.toString.call(thing).slice(8,-1);
  return type ? (thing === type) : thing;
}

function sorter(check, backup){
  return function(a, b){
    if(check(a) === check(b) && backup) return backup(a) - backup(b);
    return check(a) - check(b);
  }
}

function getChannelVideos(cname, cb){
  channel(cname, cdata => {
    videos(cdata, vdata => {
      if(!channels[cname]) channels[cname] = {banlist: [], videos: []};
      channels[cname].videos = channels[cname].videos
        .concat(formatVideos(cname, vdata))
        .sort(sorter(e => e.date));
      channels[cname].nextUpdate = Date.now() + (1000 * 60 * 5);
      cb();
    });
  });
}

sx.listen(4258);
