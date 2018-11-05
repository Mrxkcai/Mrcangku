"use strict";

//	初始化；
$(function () {

    //  -fastclick 用法
    FastClick.attach(document.body);

    app.loading();
    if (api.isDebug) {
        //-调用页面逻辑方法
        ProgressMess();
    } else {
        $.ajax({
            url: api.NWBDApiGetWxTicket + "?r=" + Math.random(),
            type: "POST",
            async: false,
            data: {
                wxUrl: window.location.href,
                openid: app.getItem("open_id")
            },
            success: function success(result) {
                console.log(result);
                app.closeLoading();
                if (result.status === "success" && result.code === 0) {
                    wx.config({
                        debug: api.isDebug,
                        appId: result.data.AppID,
                        timestamp: result.data.timestamp,
                        nonceStr: result.data.noncestr,
                        signature: result.data.signature,
                        jsApiList: ['openLocation', 'hideAllNonBaseMenuItem', 'hideOptionMenu', //	隐藏分享菜单
                        'checkJsApi', //	
                        'onMenuShareTimeline', //	分享到朋友圈
                        'onMenuShareAppMessage' //	分享给朋友
                        ]
                    });
                    wx.ready(function () {
                        //-调用页面逻辑方法
                        ProgressMess();

                        //新增分享
                        wx.checkJsApi({
                            jsApiList: ['chooseImage'], //	需要检测的JS接口列表
                            success: function success(res) {
                                console.log(res);
                            }
                        });
                        var id = app.getItem('userInfo').id;
                        var shareUrl = api.shareAdd + id;
                        var obj = {
                            //	朋友圈
                            title: api.shareText, //	标题
                            desc: api.shareText2, //	描述
                            link: shareUrl, //	分享链接
                            imgUrl: api.imgUrl, //	分享图标
                            fail: function fail(res) {
                                console.log(JSON.stringify(res));
                            },
                            success: function success() {},
                            cancel: function cancel() {}
                        };

                        if (!app.getItem('userInfo').id) {
                            wx.hideAllNonBaseMenuItem(); //	隐藏所有非基础按钮
                        } else {
                            wx.onMenuShareTimeline(obj); //	分享到朋友圈
                            wx.onMenuShareAppMessage(obj); //	分享给朋友
                        }
                    });
                    wx.error(function () {
                        alert("公众号页面授权失败");
                        app.f_close();
                    });
                } else {
                    alert("获取授权失败：" + result.message);
                    app.f_close();
                }
            },
            error: function error() {
                alert("网络异常，请检查网络");
                app.f_close();
            }
        });
    }

    //  -页面加载方法
    var ProgressMess = function ProgressMess() {
        // -页面逻辑加载
        var vm = new Vue({
            el: "#app",
            data: {
                src: '', //-维修厂logo
                lineArr: [{
                    add: '待交接',
                    isActive:false,
                    time: ''
                }, {
                    add: '维修中',
                    isActive:false,
                    time: ''
                }, {
                    add: '待检验',
                    isActive:false,
                    time: ''
                }, {
                    add: '待结算',
                    isActive:false,
                    time: ''
                }, {
                    add: '待付款',
                    isActive:false,
                    time: ''
                }, {
                    add: '待取车',
                    isActive:false,
                    time: ''
                }, {
                    add: '维修完成',
                    isActive:false,
                    time: ''
                }],
                show1: true, //-维修进度
                show2: false, //-车辆维修记录
                wxStatus: '', //-维修状态
                company_id: '',
                isShow:false,    //-是否有维修状态
                Name:'',            //- 维修厂名字
                tel:'',      //-    维修厂电话

                data2:{}    //-维修单信息
            },
            methods: {
                init: function init() {
                    var that = this;
                    //-初始化页面高度
                    $("body").css({ 'min-height': $(window).height() + 'px' });
                    //-计算左侧圆点的距离
                    for (var n = 0; n < that.lineArr.length; n++) {
                        $('.lineS').css({ 'height': 0.96 * n + "rem" });
                        $('.lineS span').eq(n).css({ 'top': 0.955 * n + "rem" });
                    };
                    //-或取维修厂id
                    that.company_id = getUrlParam('company_id');
                    // console.log(that.company_id)
                    //-更具维修厂id查询维修厂信息
                    that.getCompanyInfo(that.company_id);

                    
                    if (app.getItem('orderNo')) {
                        $.ajax({
                            url: api.NWBDApiSitengS,
                            type: 'post',
                            data: {
                                orderNo: app.getItem('orderNo')
                            },
                            dataType: 'json',
                            success: function success(res) {
                                console.log(res);
                                if (res.data.stenOrderStatus == -1) {
                                    that.wxStatus = '暂无维修状态';
                                    //-暂无状态
                                    that.isShow = false
                                } else if (res.data.stenOrderStatus == 0) {
                                    that.wxStatus = '待交接';
                                    that.isShow = true
                                    that.lineArr[0].time = res.data.modifyDate;
                                    that.lineArr[1].time = '';
                                    that.lineArr[2].time = '';
                                    that.lineArr[3].time = '';
                                    that.lineArr[4].time = '';
                                    that.lineArr[5].time = '';
                                    that.lineArr[6].time = '';

                                    that.lineArr[0].isActive = true;
                                    that.lineArr[1].isActive = false;
                                    that.lineArr[2].isActive = false;
                                    that.lineArr[3].isActive = false;
                                    that.lineArr[4].isActive = false;
                                    that.lineArr[5].isActive = false;
                                    that.lineArr[6].isActive = false;
                                } else if (res.data.stenOrderStatus == 1) {
                                    that.wxStatus = '维修中';
                                    that.isShow = true
                                    that.lineArr[0].time = '';
                                    that.lineArr[1].time = res.data.modifyDate;
                                    that.lineArr[2].time = '';
                                    that.lineArr[3].time = '';
                                    that.lineArr[4].time = '';
                                    that.lineArr[5].time = '';
                                    that.lineArr[6].time = '';

                                    that.lineArr[0].isActive = true;
                                    that.lineArr[1].isActive = true;
                                    that.lineArr[2].isActive = false;
                                    that.lineArr[3].isActive = false;
                                    that.lineArr[4].isActive = false;
                                    that.lineArr[5].isActive = false;
                                    that.lineArr[6].isActive = false;
                                } else if (res.data.stenOrderStatus == 2) {
                                    that.wxStatus = '待检验';
                                    that.isShow = true
                                    that.lineArr[0].time = '';
                                    that.lineArr[1].time = '';
                                    that.lineArr[2].time = res.data.modifyDate;
                                    that.lineArr[3].time = '';
                                    that.lineArr[4].time = '';
                                    that.lineArr[5].time = '';
                                    that.lineArr[6].time = '';

                                    that.lineArr[0].isActive = true;
                                    that.lineArr[1].isActive = true;
                                    that.lineArr[2].isActive = true;
                                    that.lineArr[3].isActive = false;
                                    that.lineArr[4].isActive = false;
                                    that.lineArr[5].isActive = false;
                                    that.lineArr[6].isActive = false;
                                } else if (res.data.stenOrderStatus == 3) {
                                    that.wxStatus = '待结算';
                                    that.isShow = true
                                    that.lineArr[0].time = '';
                                    that.lineArr[1].time = '';
                                    that.lineArr[2].time = '';
                                    that.lineArr[3].time = res.data.modifyDate;
                                    that.lineArr[4].time = '';
                                    that.lineArr[5].time = '';
                                    that.lineArr[6].time = '';

                                    that.lineArr[0].isActive = true;
                                    that.lineArr[1].isActive = true;
                                    that.lineArr[2].isActive = true;
                                    that.lineArr[3].isActive = true;
                                    that.lineArr[4].isActive = false;
                                    that.lineArr[5].isActive = false;
                                    that.lineArr[6].isActive = false;
                                } else if (res.data.stenOrderStatus == 4) {
                                    that.wxStatus = '待付款';
                                    that.isShow = true
                                    that.lineArr[0].time = '';
                                    that.lineArr[1].time = '';
                                    that.lineArr[2].time = '';
                                    that.lineArr[3].time = '';
                                    that.lineArr[4].time = res.data.modifyDate;
                                    that.lineArr[5].time = '';
                                    that.lineArr[6].time = '';

                                    that.lineArr[0].isActive = true;
                                    that.lineArr[1].isActive = true;
                                    that.lineArr[2].isActive = true;
                                    that.lineArr[3].isActive = true;
                                    that.lineArr[4].isActive = true;
                                    that.lineArr[5].isActive = false;
                                    that.lineArr[6].isActive = false;
                                } else if (res.data.stenOrderStatus == 5) {
                                    that.wxStatus = '待取车';
                                    that.isShow = true
                                    that.lineArr[0].time = '';
                                    that.lineArr[1].time = '';
                                    that.lineArr[2].time = '';
                                    that.lineArr[3].time = '';
                                    that.lineArr[4].time = '';
                                    that.lineArr[5].time = res.data.modifyDate;
                                    that.lineArr[6].time = '';

                                    that.lineArr[0].isActive = true;
                                    that.lineArr[1].isActive = true;
                                    that.lineArr[2].isActive = true;
                                    that.lineArr[3].isActive = true;
                                    that.lineArr[4].isActive = true;
                                    that.lineArr[5].isActive = true;
                                    that.lineArr[6].isActive = false;
                                } else if (res.data.stenOrderStatus == 6) {
                                    that.wxStatus = '已完成';
                                    that.isShow = true
                                    that.lineArr[0].time = '';
                                    that.lineArr[1].time = '';
                                    that.lineArr[2].time = '';
                                    that.lineArr[3].time = '';
                                    that.lineArr[4].time = '';
                                    that.lineArr[5].time = '';
                                    that.lineArr[6].time = res.data.modifyDate;

                                    that.lineArr[0].isActive = true;
                                    that.lineArr[1].isActive = true;
                                    that.lineArr[2].isActive = true;
                                    that.lineArr[3].isActive = true;
                                    that.lineArr[4].isActive = true;
                                    that.lineArr[5].isActive = true;
                                    that.lineArr[6].isActive = false;
                                    //-最后一个已完成
                                    $('.lineS span:last-child').addClass('goneAc');

                                };
                            },
                            error: function error() {
                                app.alert('网络故障，请稍后重试');
                            }
                        });


                        //-获取维修单信息
                        that.getWeixiudan(app.getItem('orderNo'));
                    } else {
                        window.history.go(-1); //-返回+刷新
                    };
                },

                //-tab切换
                navT: function navT(n) {
                    var that = this;
                    if (n == 0) {
                        that.show1 = true;
                        that.show2 = false;
                        $('header>div:nth-child(1)>span').addClass('borderL');
                        $('header>div:nth-child(2)>span').removeClass('borderL');
                    } else if (n == 1) {
                        that.show1 = false;
                        that.show2 = true;
                        $('header>div:nth-child(1)>span').removeClass('borderL');
                        $('header>div:nth-child(2)>span').addClass('borderL');
                    };
                },

                //-可拨打电话
                telphone: function telphone(tellphone) {
                    window.location.href = 'tel:' + tellphone;
                },
                getCompanyInfo: function getCompanyInfo(companyId) {
                    var this_ = this;
                    $.ajax({
                        url: api.NWBDApiGetMerchantDetailInfo + "?merchant_id=" + companyId + "&openid=" + app.getItem("open_id") + "&userId=" + app.getItem("userInfo").id + "&r=" + Math.random(),
                        type: "GET",
                        dataType: 'json',
                        success: function success(res) {
                            console.log(res);
                            if (res.code == 0) {
                                if(res.data[0].image.length != 0){
                                    this_.src = res.data[0].image[0].image_url
                                }else{
                                    this_.src = ''
                                };

                                this_.Name = res.data[0].name;
                                this_.tel = res.data[0].service_hotline;
                            }else{
                                app.alert(res.message);
                            };
                        },
                        error: function error(res) {
                            app.alert(res.message);
                        }
                    });
                },
                getWeixiudan:function(orderId){
                    var that = this;
                    $.ajax({
                        url:api.NWBDApiSitengGetOrderInfo,
                        type:'post',
                        data:{
                            orderNo:orderId
                        },
                        success:function(res){
                            console.log(res)
                            if(res.code == 0){
                                that.data2 = res.data;
                            }else{  
                                // app.alert(res.message)
                            }
                        },
                        error:function(res){
                            app.alert(res.message)
                        }
                    });
                }
            },
            mounted: function mounted() {
                var that = this;
                that.init();
            }
        });
    };
});