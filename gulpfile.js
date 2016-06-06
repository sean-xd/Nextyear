var gulp = require("gulp"),
  concat = require("gulp-concat"),
  src = {html: "src/index.html", css: "src/styles/*.css", js: ["src/scripts/*.js"]},
  dest = {html: "html/", css: "html/", js: "html"};

function tk(name, steps){
  gulp.task(name, function(){
    var result = gulp.src(src[name]), i = 0;
    if(steps) while(i < steps.length) result = result.pipe(steps[i][0](steps[i++][1]));
    return result.pipe(gulp.dest(dest[name]));
  });
}

tk("html");
tk("css", [[concat, "main.css"]]);
tk("js", [[concat, "app.js"]]);

gulp.task("default", ["html", "js", "css"]);
gulp.task("watch", ["default"], function(){
  gulp.watch(src.html, ["html"]);
  gulp.watch(src.js, ["js"]);
  gulp.watch(src.css, ["css"]);
});
