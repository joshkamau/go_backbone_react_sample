var gulp = require("gulp");
var react = require("gulp-react");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var order = require("gulp-order");

gulp.task("compilejsx", function(){
	return gulp.src("jsx/**/*.jsx")
	.pipe(react())
	.pipe(concat("views.js"))
	.pipe(gulp.dest("js/"))
});

gulp.task("buildjs",function(){
	return gulp.src("js/**/*.js")
	.pipe(order(["utils.js", "views.js", "router.js"]))
	.pipe(concat("app-all.js"))
	.pipe(uglify())
	.pipe(gulp.dest("build/"))
});

gulp.task("watch", function(){
	return gulp.watch("./**", ["compilejsx"])
})

gulp.task("default", ["watch"])