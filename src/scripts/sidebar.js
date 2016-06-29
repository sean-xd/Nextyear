function groupSideDom(name){
  return t(".group-side")([
    t("i", {classes: ["gs-settings", "material-icons"]})("settings"),
    t(".gs-title")(name)
  ].concat(groups[name].channels.map(channelSideDom)));
}

function channelSideDom(name){
  var index = channels[name].videos.map(e => e.id).indexOf(channels[name].latest);
  return t(".channel-side")([
    t(".cs-title")(name),
    t("div", {id: name + "-new", classes: ["cs-new"], click: e => {
      var gname = el(".gs-title", pa(e))[0].textContent;
      if(active.side === gname) removeChannel(e);
    }})(index)
  ]);
}

clk(".hamburger", openSidebar);

function openSidebar(){
  clt(dom.content, "small");
  clt(dom.aside, "big");
  clt(dom.drawer, "small");
}

clk(dom.aside, e => {
  if(clc(e, "gs-title")) toggleDrawer(e.textContent);
  if(clc(e, "gs-settings")) gsSettings(e);
});

function gsSettings(e){
  var name = el(".gs-title", pa(e))[0].textContent;
  active.side = active.side ? false : name;
  clt(pa(e), "gs-open");
}

function addGroup(){
  var name = dom.createInput.value,
    pb = dom.playbackInput.value;
  if(!name) return;
  groups[name] = {channels: [], playback: pb || 1, banlist: []};
  dom.sections[name] = sectionDom(name);
  var order = Object.keys(groups).sort(sorter(e => e)),
    index = order.indexOf(name) + 1;
  if(index === order.length) dom.main.appendChild(dom.sections[name]);
  else dom.main.insertBefore(dom.sections[name], el("#" + order[index]));
}

function removeGroup(e){
  var id = pa(pa(e)).id;
  dom.main.removeChild(dom.sections[id]);
  groups = okr(groups, (obj, key) => (key !== id) ? (obj[key] = groups[key], obj) : obj, {});
  lss("groups", groups);
}

function addChannel(e){
  var channelName = el("input", pa(e))[0].value,
    groupName = pa(pa(pa(e))).id;
  el("input", pa(e))[0].value = "";
  groups[groupName].channels.push(channelName);
  lss("groups", groups);
  el(".right", pa(pa(e)))[0].appendChild(channelDom(channelName));
  updateDom(groupName);
}

function removeChannel(e){
  console.log("uhh");
  var channelName = el(".cs-title", pa(e))[0].textContent,
    groupName = el(".gs-title", pa(pa(e)))[0].textContent;
  console.log(channelName);
  console.log(groupName);
  return;
  groups[groupName].channels = groups[groupName].channels.filter(chan => chan !== channelName);
  lss("groups", groups);
  pa(pa(e)).removeChild(pa(e));
  updateDom(groupName);
}
