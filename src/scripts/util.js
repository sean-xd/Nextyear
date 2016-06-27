// Dom
function el(id, parent){
  if(!parent) parent = document;
  if(id[0] === "#") return parent.getElementById(id.substr(1));
  if(id[0] === ".") return parent.getElementsByClassName(id.substr(1));
  return parent.getElementsByTagName(id);
}

function t(tag, config){
  if(!config) var config = {};
  if(tag){
    if(tag[0] === "."){config.classes = [tag.substr(1)]; tag = "div";}
    if(tag[0] === "#"){config.id = tag.substr(1); tag = "div";}
  }
  var parent = tag ? document.createElement(tag) : document.createDocumentFragment();
  if(config){
    var i = 0, keys = Object.keys(config);
    keys.forEach(key => {
      if(key === "classes") config[key].forEach(cl => parent.classList.add(cl));
      else if(key === "click") parent.addEventListener("click", config[key]);
      else parent[key] = config[key];
    });
  }
  return function(ch, force){
    parent.html = function(){
      var temp = document.createElement("div");
      temp.appendChild(this.cloneNode(true));
      return temp.innerHTML;
    };
    if(force){parent.innerHTML = ch; return parent;}
    if(!ch && ch !== 0) return parent;
    var type = Object.prototype.toString.call(ch).slice(8,-1);
    if(type === "String" || type === "Number") parent.textContent = ch;
    if(type.substr(0,4) === "HTML" || type.substr(0, 4) === "Docu") parent.appendChild(ch);
    if(type === "Array") ch.forEach(child => parent.appendChild(child));
    return parent;
  };
}

function clk(e, cb){
  e = (typeof e !== "string") ? e : (e[0] === "#") ? el(e) : el(e)[0];
  e.addEventListener("click", function(e){cb(e.target, e, this);});
}
function pa(e){return e.parentNode;}
function clc(e, cn){return e.classList.contains(cn);}
function cla(e, cn){return e.classList.add(cn);}
function clr(e, cn){return e.classList.remove(cn);}
function clt(e, cn){return e.classList.toggle(cn);}

// Functional
function okr(obj, fn, def){return def ? Object.keys(obj).reduce(fn, def) : Object.keys(obj).reduce(fn);}
function jss(obj){return JSON.stringify(obj);}
function jsp(str){return JSON.parse(str);}
function lsod(key, def){return !ls[key] ? def : pod(ls[key]);}
function pod(str){return (str[0] === "{" || str[0] === "[") ? jsp(str) : str;}
function lss(key, obj){ls[key] = jss(obj);}
function lsp(key){return jsp(ls[key]);}

function c(cb, a){return b => cb(a, b);}

function sorter(check, backup){
  return function(a, b){
    if(check(a) === check(b) && backup) return backup(a) - backup(b);
    return check(a) - check(b);
  }
}

// Async
function Magic(num, fn, check){
  var args = [];
  return data => {
    args.push(data);
    if(args.length === num) check ? fn.apply(null, args) : fn(args);
  }
}

function hp(url, cb){
  var req = new XMLHttpRequest();
  req.addEventListener("load", function(){
    if(!this.responseText) return;
    cb(JSON.parse(this.responseText));
  });
  req.open("GET", url);
  req.send();
}
