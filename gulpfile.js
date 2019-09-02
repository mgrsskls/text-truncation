const gulp = require("gulp");
const rename = require("gulp-rename");

gulp.task("build", () =>
  gulp
    .src("./index.js")
    .pipe(rename({ basename: "text-truncation" }))
    .pipe(gulp.dest("./docs/"))
);

gulp.task("build");
