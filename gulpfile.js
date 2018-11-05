/**
 * Created by xiaocai on 18/10/30.
 */
var gulp = require("gulp");
var $ = require('gulp-load-plugins')();
var bs  = require("browser-sync");
var webpack = require("webpack");
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');                //- 压缩js代码
var minifyCss = require('gulp-minify-css');         //- 压缩CSS文件；
var rev = require('gulp-rev');                      //- 对css、js文件名加MD5后缀
var clean = require('gulp-clean');                  //- 用于删除文件
var babel = require('gulp-babel');
var revCollector = require('gulp-rev-collector');   //- 路径替换


gulp.task('default',function(){
    console.log(233)
});



