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
  groups = Object.keys(groups).reduce((obj, key) => {
    if(key !== id) obj[key] = groups[key];
    return obj;
  }, {});
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
  var channelName = el(".cname", pa(e))[0].textContent,
    groupName = pa(pa(pa(pa(e)))).id;
  groups[groupName].channels = groups[groupName].channels.filter(chan => chan !== channelName);
  lss("groups", groups);
  pa(pa(e)).removeChild(pa(e));
  updateDom(groupName);
}
