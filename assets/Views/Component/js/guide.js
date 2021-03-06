"use strict";

Vue.component("adve-block1", {
    props: {
        arr: {
            type: Object,
            default: {}
        }
    },
    data: function data() {
        return {
            imgUrl: api.NWBDApiImgUrl + "/images/icon_czzn_orange.png?v=2.0.0"
        };
    },

    computed: {},
    methods: {
        init1: function init1() {
            var cont = $("#barrage1");
            var contW = $("#barrage1").width();
            var contH = $("#barrage1").height();
            var startX, startY, sX, sY, moveX, moveY;
            var winW = $(window).width();
            var winH = $(window).height();
            var barrage_name = $("#barrage_name1");
            var barrage_frame = $("#barrage_frame1");
            var body = $("body");
            $('.icon_none').show();

            cont.on({ //绑定事件
                touchstart: function touchstart(e) {
                    startX = e.originalEvent.targetTouches[0].clientX; //获取点击点的X坐标    
                    startY = e.originalEvent.targetTouches[0].clientY; //获取点击点的Y坐标
                    console.log("startX=" + startX + "************startY=" + startY);
                    sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
                    sY = e.originalEvent.targetTouches[0].clientY; //相对于当前窗口Y轴的偏移量
                    console.log("sX=" + sX + "***************sY=" + sY);
                    leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
                    rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
                    topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
                    bottomY = winH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置                
                },
                touchmove: function touchmove(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    moveX = e.originalEvent.targetTouches[0].clientX; //移动过程中X轴的坐标
                    moveY = e.originalEvent.targetTouches[0].clientY; //移动过程中Y轴的坐标
                    //console.log("moveX="+moveX+"************moveY="+moveY);
                    if (moveX < leftX) {
                        moveX = leftX;
                    }
                    if (moveX > rightX) {
                        moveX = rightX;
                    }
                    if (moveY < topY) {
                        moveY = topY;
                    }
                    if (moveY > bottomY) {
                        moveY = bottomY;
                    }
                    $(this).css({
                        "left": moveX + sX - startX + 10,
                        "top": moveY + sY - startY - 15,
                        "height": "1.2rem"
                    });
                },
                touchend: function touchend(e) {
                    // e.preventDefault();
                    e.stopPropagation();
                },
                click: function click() {
                    var urll = window.location.href;
                    if (urll.indexOf('index') == -1) {
                        window.location.href = "../Notices/notices.html";
                    } else {
                        window.location.href = "Views/Notices/notices.html";
                    }
                }

            });

            //  html加载完成执行
            $(document).ready(function () {
                $('.barrage_name1').show();
            });
        }
    },
    template: "\n    <div class=\"barrage1\" id=\"barrage1\">\n        <div class=\"barrage_name1\" id=\"barrage_name1\" style=\"display:none;\">\n            \n                <img :src=\"this.imgUrl\" class=\"icon_none\" style=\"display:none;opacity:1;\" />\n            \n        </div>\n    </div>\n    "
});