var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rev = require('gulp-rev');
var bs = require('browser-sync');   //  浏览器自动次刷新
var uglify = require('gulp-uglify');    //  压缩js

//  example
// gulp.task('default',function(){
//     console.log('233')
// });

//转换html
gulp.task('html',function(){
    gulp.src('./*.html')
    .pipe(gulp.dest('./dev'));  //  写入命令
});

gulp.task('default',['js']);    //  gulp执行任务

gulp.task('js',function(){
    return gulp.src('./assets/**/*.js')
    .pipe($.uglify())       //  使用uglify压缩
    // .pipe(rev())            //  文件名加MD5后缀
    .pipe(gulp.dest('./dev'))
});
