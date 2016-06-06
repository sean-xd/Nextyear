function groupSideDom(name){
  return t(".group-side")([
    t("i", {classes: ["gs-settings", "material-icons"]})("settings"),
    t(".gs-title")(name)
  ].concat(groups[name].channels.map(channelSideDom)));
}

function channelSideDom(name){
  return t(".channel-side")([
    t(".cs-title")(name),
    t(".cs-new")("0")
  ]);
}

function sectionDom(name){
  return t("section", {id: name})([
    t("h3", {classes: ["group"]})(name),
    t("i", {classes: ["settings", "material-icons"]})("settings"),
    t(".panel")([
      t(".remove")("delete"),
      t(".refresh")("refresh"),
      t(".left")([
        t("h2")("Group Editor"),
        t("input", {placeholder: "Enter Channel Name"})(),
        t(".add")("Add Channel")
      ]),
      t(".right")(groups[name].channels.map(channelDom))
    ])
  ])
}

function videoDom(data){
  return t(".video", {id: data.id})([
    t(".video-del", {click: e => {
      var groupName = pa(pa(e.target)).id,
        id = pa(e.target).id;
      if(id === active.video) nextVideo();
      groups[groupName].banlist.push(id);
      lss("groups", groups);
      load(groupName, 1);
    }})("x"),
    t("img", {classes: ["video-img"], src: data.src})(),
    t(".video-title")(data.title),
    t("a", {classes: ["video-links"], href: "http://www.youtube.com/channel/" + data.cid})(data.cname)
  ]);
}

function channelDom(cname){
  return t(".channel")([
    t(".cname")(cname),
    t("i", {classes: ["delete", "material-icons"]})("delete_forever")
  ])
}
