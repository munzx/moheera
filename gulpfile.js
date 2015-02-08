// Dependencies
var gulp = require('gulp'),
	gzip = require('gulp-gzip');
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	nodemon = require('gulp-nodemon'),
	mocha = require('gulp-mocha'),
	plumber = require('gulp-plumber'),
	cssMinify = require('gulp-minify-css'),
	notify = require('gulp-notify'),
	autoprefixer = require('gulp-autoprefixer'),
	connect = require('gulp-connect');

// Folder and files paths
var paths = {
	desFolder: 'public/dest/',
	htmlFiles: ['public/modules/*/*/*.html', 'public/modules/*/*/*.ejs'],
	jsFiles: ['public/modules/*/*.js', 'public/modules/*/*/*.js'],
	cssFiles: ['public/modules/*/*.css', 'public/modules/*/*/*.css'],
	images: ['public/modules/*/img/', 'public/modules/*/img/*./'],
	css: [],
	server: {
		index: 'server.js',
		specs: './app/tests/*'
	}
}

//compress images
gulp.task('compress', function () {
	gulp.src(paths.images)
	.pipe(gzip({ append: true }))
	.pipe(gulp.dest(paths.desFolder));
});

// Run JShint against files to make sense of errors if existed
gulp.task('inspect', function () {
	return gulp.src(paths.jsFiles)
			.pipe(plumber())
			.pipe(jshint())
			.pipe(jshint.reporter('default'));	
});

// Gulp test ..... make sure the server is on first
gulp.task('test', function () {
	gulp.src(paths.server.specs)
	.pipe(plumber())
	.pipe(mocha({reporter: 'spec'}))
	.pipe(notify({message: 'test specs completed'}));
});

// reload html files
gulp.task('htmlReload', function () {
	gulp.src(paths.htmlFiles)
	.pipe(connect.reload());
});

// Concat , rename , compact then save the minified JS files
gulp.task('minifyJS', function () {
	return gulp.src(paths.jsFiles)
			.pipe(plumber())
			.pipe(concat('app.js'))
			.pipe(uglify())
			.pipe(rename('app.min.js'))
			.pipe(gzip())
			.pipe(gulp.dest(paths.desFolder))
			.pipe(connect.reload());
});

gulp.task('minifyCSS', function () {
	return gulp.src(paths.cssFiles)
			.pipe(plumber())
			.pipe(autoprefixer('last 5 versions'))
			.pipe(concat('app.css'))
			.pipe(cssMinify())
			.pipe(rename('app.min.css'))
			.pipe(gzip())
			.pipe(gulp.dest(paths.desFolder))
			.pipe(connect.reload());
});


// Build the minified files
gulp.task('build', ['inspect', 'htmlReload', 'minifyJS', 'minifyCSS', 'compress']);

// Start nodeJS server and watch for gulp "watch" on start and end
gulp.task('serve', function() {
	nodemon({	
		script: paths.server.index,
		ext: 'js html ejs',
		ignore: ['public/*'], // Ignore any files in the public folder
		env: { 'NODE_ENV': 'development' }
	});
    connect.server({
        root: 'public',
        livereload: true
    });
});

// Watch change
gulp.task('watch', function () {
	gulp.watch(paths.htmlFiles, ['build']);
	gulp.watch(paths.jsFiles, ['build']);
	gulp.watch(paths.cssFiles, ['build']);
	gulp.watch(paths.images, ['build']);
});

// Start the default task
gulp.task('default',['serve', 'watch']);