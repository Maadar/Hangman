var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');

gulp.task('reload', function() {

	browserSync.reload();

});

gulp.task('serve', ['sass'], function() {

	browserSync({
		server:'main'
	});

	gulp.watch('main/*.html', ['reload']);
	gulp.watch('main/scss/**/*.scss', ['sass']);
});

gulp.task('sass', function() {

	return gulp.src('main/scss/**/*.scss')	
		   .pipe(sass().on('error', sass.logError))
		   .pipe(gulp.dest('main/scss'))
		   .pipe(browserSync.stream());      
});

gulp.task('default', ['serve'], function() {


});