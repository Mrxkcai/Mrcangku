var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rev = require('gulp-rev');
var gutil = require('gulp-util');   //  用于输出
var clean = require('gulp-clean');  //  -用于删除文件
var babel = require('gulp-babel');  // -使用babel
var bs = require('browser-sync');   //  浏览器自动次刷新
var uglify = require('gulp-uglify');    //  压缩js



//转换html
gulp.task('html',function(){
    gulp.src('./*.html')
    .pipe(gulp.dest('./dev'));  //  写入命令
});

gulp.task('default',['js','babel']);    //  gulp执行任务

gulp.task('js',function(){
    return gulp.src('./assets/**/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe($.uglify())       //  使用uglify压缩
    // .pipe(rev())            //  文件名加MD5后缀
    .on('error',function(err){  //  添加gulp 错误信息提示
        gutil.log(gutil.colors.red('Error!'), err.toString());
    })
    .pipe(gulp.dest('./dev'))
});


gulp.task('cleanbabel',function(){
    gulp.src('./dev/**/*.js',{read:false})
    .pipe(clean());
});
/* 编译es6-es5*/
gulp.task('babel',['cleanbabel'], function(){
    gulp.src('./assets/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./dev/'))
    .on('end',function(){
        console.log('babel has been completed')
    })
})
