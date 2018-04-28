
var gulp = require('gulp');


const babel = require('gulp-babel');


gulp.task('default', () => {
    return gulp.src('wapH5_src/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('wapH5_dist'));
});