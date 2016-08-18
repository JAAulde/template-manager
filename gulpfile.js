/*jslint node: true */
(function () {
    'use strict';

    var gulp = require('gulp'),
        del = require('del'),
        plugins = require('gulp-load-plugins')();

    gulp.task('clean', function () {
        return del(['dist/']);
    });

    gulp.task('lint', function () {
        return gulp.src('src/**/*.js')
            .pipe(plugins.jslint())
            .pipe(plugins.jslint.reporter('default'));
    });

    gulp.task('build', ['clean', 'lint'], function () {
        return gulp.src('src/**/*.js')
            .pipe(plugins.injectVersion({
                prepend: ''
            }))
            .pipe(gulp.dest('dist/'))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.rename({
                basename: "template-manager.min",
                extname: ".js"
            }))
            .pipe(plugins.uglify({
                preserveComments: function (node, comment) {
                    return (/@file/m).test(comment.value);
                }
            }))
            .pipe(plugins.sourcemaps.write('maps'))
            .pipe(gulp.dest('dist/'))
    });

    gulp.task('watch', function () {
        gulp.watch('src/**/*.js', ['build']);
    });

    gulp.task('default', ['build', 'watch']);
}());