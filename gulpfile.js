/*jslint node: true */
(function () {
    'use strict';

    var gulp = require('gulp'),
        del = require('del'),
        plugins = require('gulp-load-plugins')(),
        src = 'src/template-manager.js',
        output_dir = 'dist/';

    gulp.task('clean', function () {
        return del([output_dir]);
    });

    gulp.task('lint', function () {
        return gulp.src(src)
            .pipe(plugins.jslint())
            .pipe(plugins.jslint.reporter('default'));
    });

    gulp.task('dist:full', function () {
        return gulp.src(src)
            .pipe(plugins.injectVersion({
                prepend: ''
            }))
            .pipe(gulp.dest(output_dir))
    });

    gulp.task('dist:min', ['lint'], function () {
        return gulp.src(src)
            .pipe(plugins.rename({
                basename: "template-manager.min",
                extname: ".js"
            }))
            .pipe(plugins.injectVersion({
                prepend: ''
            }))
            .pipe(plugins.uglify({
                preserveComments: function (node, comment) {
                    return (/@file/m).test(comment.value);
                }
            }))
            .pipe(gulp.dest(output_dir))
    });

    gulp.task('js', ['dist:full', 'dist:min']);

    gulp.task('watch', function () {
        gulp.watch(src, ['js']);
    });

    gulp.task('build', ['clean', 'js']);
    gulp.task('default', ['build', 'watch']);
}());