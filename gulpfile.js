var gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug');

gulp.task('sass', () => {
  return gulp.src('app/sass/*.sass')
  .pipe(sass())
  .pipe(gulp.dest('dist/public/css/'))
});

gulp.task('pug', () => {
  return gulp.src('app/pug/*.pug')
  .pipe(pug())
  .pipe(gulp.dest('dist/views/'))
});

gulp.task('js', (data) => {
  return gulp.src('app/js/*.js')
  .pipe(gulp.dest('dist/public/js/'))
});

gulp.task('watch', ['sass', 'pug', 'js'], () => {
  gulp.watch('app/sass/*.sass', ['sass']);
  gulp.watch('app/pug/*.pug', ['pug']);
  gulp.watch('app/js/*.js', ['js']);
});