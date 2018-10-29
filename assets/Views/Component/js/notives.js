"use strict";

Vue.component("adve-block", {
    props: {
        arr: {
            type: Object,
            default: {}
        }
    },
    data: function data() {
        return {
            imgUrl: api.NWBDApiImgUrl + "/images/icon_huodong.gif?v=2.0.0"
        };
    },

    computed: {},
    methods: {
        init: function init() {
            var cont = $("#barrage");
            var contW = $("#barrage").width();
            var contH = $("#barrage").height();
            var startX, startY, sX, sY, moveX, moveY;
            var winW = $(window).width();
            var winH = $(window).height();
            var barrage_name = $("#barrage_name");
            var barrage_frame = $("#barrage_frame");
            var body = $("body");
            var windowUrl = window.location.href;
            $('.icon_none').show();
            //	首次进来直接展示公告
            var index_;
            if (!sessionStorage.getItem("g") && localStorage.getItem("userInfo") && windowUrl.indexOf('QuickRepair') >= 0) {
                sessionStorage.setItem("g", 1);
                couponIndex();
            } else if (!sessionStorage.getItem("k") && localStorage.getItem("userInfo") && windowUrl.indexOf('index') >= 0) {
                sessionStorage.setItem("k", 1);
                //console.log(windowUrl.indexOf('index'))
                couponIndex();
                //alert(0)
            } else {
                // console.log(windowUrl.indexOf('index'))
                layer.close(index_);
            }

            cont.on({ //绑定事件
                touchstart: function touchstart(e) {
                    startX = e.originalEvent.targetTouches[0].clientX; //获取点击点的X坐标    
                    startY = e.originalEvent.targetTouches[0].clientY; //获取点击点的Y坐标
                    //console.log("startX="+startX+"************startY="+startY);
                    sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
                    sY = e.originalEvent.targetTouches[0].clientY; //相对于当前窗口Y轴的偏移量
                    //console.log("sX="+sX+"***************sY="+sY);
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
                        "top": moveY + sY - startY,
                        "height": ".96rem"
                    });
                },
                touchend: function touchend(e) {
                    // e.preventDefault();
                    e.stopPropagation();
                },
                click: function click() {
                    layer.open({
                        title: '',
                        style: 'padding: 0!important;background: none!important;box-shadow:none;',
                        content: "<div class='img_box'>\n                                    <img src='../../images/img_gonggao.png?v=2.0.1'/>\n                                    <div class=\"line_shu\"></div>\n                                    <img src='../../images/icon_close.png' class=\"close_img\" />\n                                </div>\n                                "
                    });

                    $('.layui-m-layercont').addClass('new');
                    //  关闭叉号
                    $('.close_img').on('click', function () {
                        $('.layui-m-layer').hide();
                        $('.layui-m-layercont').removeClass('new');
                        //  出发蒙版的点击事件
                        $('.layui-m-layershade').trigger('click');
                    });
                }

            });

            //  html加载完成执行
            $(document).ready(function () {
                $('.barrage_name').show();
            });
        }
    },
    template: "\n    <div class=\"barrage\" id=\"barrage\">\n        <div class=\"barrage_name\" id=\"barrage_name\" style=\"display:none;\">\n            \n                <img :src=\"this.imgUrl\" class=\"icon_none\" style=\"display:none;opacity:1;\" />\n            \n        </div>\n    </div>\n    "
});

//-是否有优惠券
function couponIndex() {
    var type = 1;
    // alert(app.getItem("userInfo").id)
    $.ajax({
        type: 'GET',
        url: api.NWBDApiWeiXincouponIndex + '?v=' + Math.random(),
        data: {
            userId: app.getItem("userInfo").id,
            openid: app.getItem("open_id")
        },
        async: true,
        success: function success(res) {
            console.log(res);
            if (res.code == 0 && res.status === "success") {
                // if(!res.data)return false;
                if (!res.data || !res.data.totalAmount) {
                    $.ajax({
                        type: 'GET',
                        url: api.NWBDApiWeiXincouponList + '?v=' + Math.random(),
                        data: {
                            userId: app.getItem("userInfo").id,
                            type: type,
                            pageNum: 1,
                            pageSize: 10,
                            openid: app.getItem("open_id")
                        },
                        async: true,
                        success: function success(res) {
                            if (res.code == 0 && res.status == "success") {
                                if (res.data.length > 0) {
                                    index_ = layer.open({
                                        title: '',
                                        style: 'padding: 0!important;background: none!important;box-shadow:none;',
                                        content: "<div class='img_box' style=\"display:none;opacity:1;\">\n                                                    <img id=\"imgt1\" src='../../images/tanchuang.png' style=\"min-width:2rem;min-height:3rem;width: 93%;margin-top: -1rem\"/>\n                                                    <div class=\"line_shu\"></div>\n                                                    <img id=\"imgt2\" src='../../images/icon_close.png' class=\"close_img\" />\n                                                </div>\n                                                "
                                    });
                                    $('#imgt1').attr('src', api.NWBDApiImgUrl + "/images/tanchuang.png");
                                    $('#imgt2').attr('src', api.NWBDApiImgUrl + "/images/icon_close.png");
                                    $('.layui-m-layercont').addClass('new');
                                    $('.img_box').show();

                                    //  关闭叉号
                                    $('.close_img').on('click', function () {
                                        $('.layui-m-layer').hide();
                                        // couponIndex();
                                        $('.layui-m-layercont').removeClass('new');
                                        //  出发蒙版的点击事件
                                        $('.layui-m-layershade').trigger('click');
                                    });
                                }
                            } else {}
                        }
                    });
                } else {
                    red_bag(res.data);
                }
                // if(!res.data.totalAmount)return false;
            } else {
                app.closeLoading();
                app.alert(res.message);
            };
        },
        error: function error(res) {
            app.closeLoading();
            app.alert(res.message);
        }
    });
}

//  新增优惠券方法
var red_bag = function red_bag(res) {
    //console.log(res)
    var priceAll = 0;
    // alert(JSON.stringify(res))
    // alert(res.totalAmount)
    priceAll += Number(res.totalAmount);
    var kg = false;

    var index = layer.open({
        content: "<div class=\"d-voucher\">\n                    <p class=\"get-voucher\" style=\"opacity:0;\"><span>\xA5</span>" + priceAll + "</p>\n                    <p style=\"font-size:1rem;color:rgba(249,250,169,1);padding-top:.1rem;\">" + priceAll + " <span style=\"font-size:.7rem;color:rgba(255,218,116,1);\">\u5143</span></p>\n                    <p>\u6709\u6548\u671F\uFF1A<br /> " + res.beginDate + "-" + res.endDate + "</p>\n                    <p>* \u4EE3\u91D1\u5238\u5DF2\u5E2E\u60A8\u4FDD\u5B58\u81F3\u201C\u4E2A\u4EBA\u4E2D\u5FC3-\u4F18\u60E0\u5238\u201D\u5217\u8868\u4E2D\uFF0C\u53EF\u524D\u5F80\u67E5\u770B\u3002</p>\n                    <p><img id=\"imgt3\" src=\"../../../images/img_zhu.png\"/> \u90E8\u52064S\u5E97\u53CA\u4FEE\u7406\u5382\u4E0D\u652F\u6301\u7EBF\u4E0A\u652F\u4ED8\uFF0C\u8BF7 \u60A8\u52A0\u5FAE\u4FE1\u53F7\u201Cbbcfkf01\u201D\u9886\u53D6\u73B0\u91D1\u7EA2\u5305\u3002</p>\n\n                    <button class=\"btn-get\"></button>\n                    <div class=\"btn_see\">\u67E5\u770B\u8BE6\u60C5 >></div>\n                </div>\n                ",
        style: "padding:none!important;background:none;box-shadow:none;width:6.94rem",
        shadeClose: false
    });

    $('#imgt3').attr('src', api.NWBDApiImgUrl + "/images/img_zhu.png");
    $('.layui-m-layercont').addClass('new');
    $('.layui-m-layercont').addClass('layui-m-layercont_self'); //  调整layer样式；

    //  查看详情按钮；
    $('.btn_see').on('click', function () {
        app.closeLoading();
        if (window.location.href.indexOf('index') == -1) {
            window.location.href = '../../Views/Voucher/voucher.html';
        } else {
            window.location.href = 'Views/Voucher/voucher.html';
        };
    });

    $('.btn-get').on('click', function () {

        $.ajax({
            type: 'GET',
            url: api.NWBDApiWeiXincouponGet + '?v=' + Math.random(),
            data: {
                userId: app.getItem("userInfo").id,
                openid: app.getItem("open_id")
            },
            async: true,
            success: function success(res) {
                console.log(res);
                if (res.code == 0 && res.status === "success") {
                    layer.close(index);
                    if (window.location.href.indexOf('index') == -1) {
                        window.location.href = '../../Views/Voucher/voucher.html';
                    } else {
                        window.location.href = 'Views/Voucher/voucher.html';
                    };
                } else {
                    app.closeLoading();
                    app.alert(res.message);
                }
                setTimeout(function () {
                    $('.layui-m-layercont').removeClass('new');
                    $('.layui-m-layercont').removeClass('layui-m-layercont_self');
                }, 200);
            },
            error: function error(res) {
                app.closeLoading();
                app.alert(res.message);
            }
        });
    });

    return kg; //     测试阻止--------------------
};