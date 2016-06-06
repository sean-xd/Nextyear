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
    var i = 0, x = Object.keys(config), j = 0;
    while(i < x.length){
      var key = x[i++], y = config[key];
      if(key === "classes"){while(j < y.length) parent.classList.add(y[j++])}
      else if(key === "click"){parent.addEventListener("click", y)}
      else{parent[key] = y}
    }
  }
  return function(ch, force){
    parent.html = function(){
      var temp = document.createElement("div");
      temp.appendChild(this.cloneNode(true));
      return temp.innerHTML;
    };
    if(force){parent.innerHTML = ch; return parent;}
    if(!ch && ch !== 0) return parent;
    var type = is(ch), k = 0;
    if(type === "String" || type === "Number") parent.textContent = ch;
    if(type.substr(0,4) === "HTML" || type.substr(0, 4) === "Docu") parent.appendChild(ch);
    if(type === "Array") while(k<ch.length) parent.appendChild(ch[k++]);
    return parent;
  };
}

function clk(e, cb){
  if(is(e, "String")) e = (e[0] === "#") ? el(e) : el(e)[0];
  e.addEventListener("click", function(e){cb(e.target, e, this);});
}

function pa(e){return e.parentNode;}
function clc(e, cn){return e.classList.contains(cn);}
function cla(e, cn){return e.classList.add(cn);}
function clr(e, cn){return e.classList.remove(cn);}
function clt(e, cn){return e.classList.toggle(cn);}

function jss(obj){return JSON.stringify(obj);}
function jsp(str){return JSON.parse(str);}
function lsod(key, def){return !ls[key] ? def : pod(ls[key]);}
function pod(str, def){return (str[0] === "{" || str[0] === "[") ? jsp(str) : str;}
function lss(key, obj){ls[key] = JSON.stringify(obj);}
function lsp(key){return JSON.parse(ls[key]);}

function hp(url, cb){
  var req = new XMLHttpRequest();
  req.addEventListener("load", function(){
    if(!this.responseText) return;
    cb(JSON.parse(this.responseText));
  });
  req.open("GET", url);
  req.send();
}

function c(cb, a){return b => cb(a, b);}

function Magic(num, fn, check){
  var args = [];
  return data => {
    args.push(data);
    if(args.length === num) check ? fn.apply(null, args) : fn(args);
  }
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

function Kyp(){
    var handler = {},
        codes = {
            backspace: 8, tab: 9, enter: 13, shift: 16, ctrl: 17,
            alt: 18, esc: 27, left: 37, up: 38, right: 39,
            down: 40, 0: 48, 1: 49, 2: 50, 3: 51,
            4: 52, 5: 53, 6: 54, 7: 55, 8: 56,
            9: 57, a: 65, b: 66, c: 67, d: 68,
            e: 69, f: 70, g: 71, h: 72, i: 73,
            j: 74, k: 75, l: 76, m: 77, n: 78,
            o: 79, p: 80, q: 81, r: 82, s: 83,
            t: 84, u: 85, v: 86, w: 87, x: 88,
            y: 89, z: 90, f1: 112, f2: 113, f3: 114,
            f4: 115, f5: 116, f6: 117, f7: 118, f8: 119,
            f9: 120, f10: 121, f11: 122, f12: 123
        },
        kyp = function(e, cb){
            if(is(e, "String")) handler[codes[e]] = cb;
            if(is(e, "Number")) handler[e] = cb;
            if(!cb && handler[e.keyCode]) handler[e.keyCode](e);
        };
    window.addEventListener("keydown", kyp);
    return kyp;
}
