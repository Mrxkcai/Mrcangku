var api = (function() {
    // shareText: '修车上保宝车服靠谱',
    // shareText2: '爱车维修保养，我首选保宝车服',
    //	var apiAddress = "http://share.baobaochefu.net/car";         //  正式地址
    var apiAddress1 = "https://wxcs.nuoweibd.com/statics/wxcs.nuoweibd.com/h5"; //  正式需注释；
    var apiAddress = "https://wxcsht.nuoweibd.com:8443"; //  正式需注释；
    var apiAddress2 = 'https://wxcs.nuoweibd.com'

    var api = {
        isDebug: false,
        debugProjectName: "wxcs.nuoweibd.com", //	正式地址:wx.nuoweibd.com
        callbackUrl: "https://wxcs.nuoweibd.com/statics/wxcs.nuoweibd.com/h5",
        appid: "wxe6766bc37f2769b2", //  正式appid   wxd464d2d248a7f6ed
        selfHttp: "https://", //  自定义配置； 正式为：http
        getLocalhostPaht: function() {
            var curWwwPath = window.document.location.href; //	完整的路径
            var pathName = window.document.location.pathname; //	域名下面的某一页面
            var pos = curWwwPath.indexOf(pathName); //	域名下面的某一页面下标的起始位置
            var apiAddr = "https://wxcs.nuoweibd.com/statics/wxcs.nuoweibd.com/h5";

            return apiAddr;
        },
        Merchant_default_Icon: "/images/default_151_151.png",
        Merchant_default_Banner: "/images/default_1125_633.png",
        NWBDApiImproveCustomer: apiAddress + "/customer/improveCustomer",
        NWBDApiCarIsExist: apiAddress + "/customer/carIsExist",
        NWBDApiOrderQuery: apiAddress + "/WeiXinPay/orderQuery",
        NWBDApiGetWxOpenId: apiAddress + "/user/getWxOpenId",
        NWBDApiUniformorder: apiAddress + "/WeiXinPay/uniformorder",
        NWBDApiPayAndCommentCount: apiAddress + "/WeiXinPay/payAndCommentCount",
        NWBDApiVerifysend: apiAddress + "/customer/sms/verify/send",
        NWBDApiLogin: apiAddress + "/customer/Login",
        NWBDApiGetBrandAll: apiAddress + "/customer/car/brand/all",
        NWBDApiGetBrandSub: apiAddress + "/customer/car/brand/sub",
        NWBDApiGetInsuranceCompanyList: apiAddress + "/insurance/getInsuranceCompanyList",
        NWBDApiCarAdd: apiAddress + "/car/carAdd",
        NWBDApiGetCarListByCustomer: apiAddress + "/car/getCarListByCustomer",
        NWBDApiGetCarInfoByID: apiAddress + "/car/getCarInfoByID",
        NWBDApiSetCommonCar: apiAddress + "/car/setCommonCar",
        NWBDApiGetWxTicket: apiAddress + "/user/getWxTicket",
        NWBDApiPositionGetMerchantList: apiAddress + "/merchant/positionGetMerchantList",
        NWBDApiGetMerchantListByArea: apiAddress + "/merchant/getMerchantListByArea",
        NWBDApiGetList: apiAddress + "/repairArea/getList",
        NWBDApiSearchMerchantList: apiAddress + "/merchant/searchMerchantList",
        NWBDApiGetOrderList: apiAddress + "/WeiXinPay/getOrderList",
        NWBDApiGetMerchantDetailInfo: apiAddress + "/merchant/merchantDetailInfo",
        NWBDApiOrderAdd: apiAddress + "/WeiXinPay/orderAdd",
        NWBDApiWeiXinPay: apiAddress + "/WeiXinPay/pay",
        NWBDApiWeiXinpushOrder: apiAddress + "/weixin/order/pushOrder", //	查看是否有派单中未接受订单
        NWBDApiWeiXincancelOrder: apiAddress + "/weixin/order/cancelOrder", //	取消订单
        NWBDApiWeiXincheckOrderStatus: apiAddress + "/weixin/order/checkOrderStatus", //	查询订单当前状态
        NWBDApiWeiXincouponList: apiAddress + "/weixin/coupon/list", //  优惠券列表
        NWBDApiWeiXincouponListUse: apiAddress + "/weixin/coupon/list/use", //  可使用优惠券列表
        NWBDApiWeiXincouponListNotuse: apiAddress + "/weixin/coupon/list/notuse", //  不可使用优惠券列表
        NWBDApiWeiXincouponIndex: apiAddress + "/weixin/coupon/index", //  判断是否领取优惠券
        NWBDApiWeiXincouponGet: apiAddress + "/weixin/coupon/get", //  优惠券活动领取
        NWBDApiWeiXinUniformorder: apiAddress + "/WeiXinPay/uniformorder", //  微信预订单
        NWBDApiWeiXinShareHaif: apiAddress + '/qrCode/shareResult', //  haif分享
        NWBDApiWeiXinShareHaifs: apiAddress + '/customer/commission/list', //提现
        NWBDApiWeiXinShareModel: apiAddress + '/customer/commission/queryCommissionByType', //分享奖金

        NWBDApiHairCode: apiAddress2 + "/h5/thirdparty/haier/send/message", //  海尔短信发送接口
        NWBDApiHairReg: apiAddress2 + "/h5/thirdparty/haier/register", //  海尔注册接口

        //- 关于思腾维修厂的接口
        NWBDApiSitengS: apiAddress + "/order/status/sten/getOrderStatus", //  根据订单号查询订单在偲腾ERP的状态

        //****************************** */
        NWBDApiWeiXincreateShareCode: apiAddress + "/qrCode/createOrGetQrCode", //	获取分享二维码
        pzTime: '3600', //		计时器时间״̬
        testPhone: '/^((17[0-9])|(14[0-9])|(13[0-9])|(15[0-9])|(16[0-9])|(18[0-9])|(19[0-9]))\d{8}$/',
        shareAdd: apiAddress1 + '/Views/shareList/share.html?customerId=', //  分享页面地址(正式记得注释掉)
        imgUrl: apiAddress1 + '/images/qrhtm2.png?v=2.1', //  分享图片地址
        shareText: '保宝车服送送福利了！',
        shareText2: '关注保宝车服完成注册， 领取1000元现金红包。',
        getopenid: function() {

            //获取open_id
            var kg = false;

            if (app.getItem("code") && app.getQueryString("code") == app.getItem("code") || !app.getQueryString("code")) {

            } else {

                console.log(app.getQueryString("code"))
                $.ajax({
                    url: api.NWBDApiGetWxOpenId + "?r=" + Math.random(),
                    type: "POST",
                    data: {
                        code: app.getQueryString("code")
                    },
                    success: function success(result) {
                        console.log(result);
                        if (result.status === "success" && result.code === 0) {
                            app.setItem("open_id", result.data);
                            //  存储code
                            app.setItem("code", app.getQueryString("code"));
                            kg = true;
                        } else {
                            app.f_close();
                        }
                    },
                    error: function error(res) {
                        console.log(res)
                        // alert("网络异常，请检查网络");
                        app.removeItem('open_id');
                        app.f_close();
                        kg = false;
                    }
                });
            }

            return kg;
        }
    };

    if (api.isDebug) {
        document.write("<script src='" + apiAddress1 + "/" + api.debugProjectName + "/js/app.js?v=1.0.21' charset='utf-8'></script>");
        document.close();
    } else {
        $('#barrage_name1 img').css({
            'opacity': '0'
        });
        $('#barrage_name img').css({
            'opacity': '0'
        });
        //document.write("<script src='" + api.getLocalhostPaht() + "/js/vue-lazyload.js?v=1.0.4' charset='utf-8'></script>");       //  懒加载js
        document.write("<script src='" + apiAddress1 + "/js/app.js?v=2.0.32' charset='utf-8'></script>"); ///bbcf-common-h5/assets
        document.write("<script src='" + apiAddress1 + "/Views/Component/js/notives.js?v=2.1.0' charset='utf-8'></script>"); //  活动js
        document.write("<script src='" + apiAddress1 + "/Views/Component/js/count.js?v=2.0.8' charset='utf-8'></script>"); //  计时器js
        document.write("<script src='" + apiAddress1 + "/Views/Component/js/guide.js?v=2.0.1' charset='utf-8'></script>"); //  指南js


        //  引入活动css
        $("<link>").attr({
            rel: "stylesheet",
            type: "text/css",
            href: apiAddress1 + "/Views/Component/css/notices.css?v=2.1.5"
        }).appendTo("head");

        //  引入计时器css
        $("<link>").attr({
            rel: "stylesheet",
            type: "text/css",
            href: apiAddress1 + "/Views/Component/css/count.css?v=2.1.4"
        }).appendTo("head");
        document.close();
    }



    return api;
})();