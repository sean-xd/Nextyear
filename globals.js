module.exports = {
  express: require("express"),
  sx: express(),
  bodyParser: require("body-parser"),
  fs: require("fs"),
  crypto: require("crypto"),
  request: require("request");
  users: JSON.parse(fs.readFileSync("./db/users.json")),
  channels: JSON.parse(fs.readFileSync("./db/channels.json")),
  oneWeek: 1000 * 60 * 60 * 24 * 7
};
