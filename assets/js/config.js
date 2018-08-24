var api = (function () {
//	var apiAddress = "http://share.baobaochefu.net/car";         //  正式地址
	// var apiAddress1 = "https://wxcs.nuoweibd.com";      //  正式需注释；
    var apiAddress = "https://wxcsht.nuoweibd.com:8443";    //  正式需注释；
   
    var api = {
        isDebug: false,
        debugProjectName: "wxcs.nuoweibd.com",		//	正式地址:wx.nuoweibd.com
        callbackUrl: "wxcs.nuoweibd.com",
        appid: "wxe6766bc37f2769b2",                //  正式appid   wxe934a7df8d628f3c
        selfHttp:"https://",                        //  自定义配置； 正式为：http
        getLocalhostPaht: function () {
            var curWwwPath = window.document.location.href;		//	完整的路径
            var pathName = window.document.location.pathname;	//	域名下面的某一页面
            var pos = curWwwPath.indexOf(pathName);				//	域名下面的某一页面下标的起始位置
																//	如：	http://127.0.0.1:8020								
            return curWwwPath.substring(0, pos);
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
        NWBDApiWeiXinpushOrder: apiAddress + "/weixin/order/pushOrder",		//	查看是否有派单中未接受订单
        NWBDApiWeiXincancelOrder: apiAddress + "/weixin/order/cancelOrder",		//	取消订单
        NWBDApiWeiXincheckOrderStatus: apiAddress + "/weixin/order/checkOrderStatus",		//	查询订单当前状态
        NWBDApiWeiXincouponList: apiAddress + "/weixin/coupon/list",                    //  优惠券列表
        NWBDApiWeiXincouponListUse: apiAddress + "/weixin/coupon/list/use",             //  可使用优惠券列表
        NWBDApiWeiXincouponListNotuse: apiAddress + "/weixin/coupon/list/notuse",             //  不可使用优惠券列表
        NWBDApiWeiXinUniformorder: apiAddress + "/WeiXinPay/uniformorder",             //  微信预订单

       //****************************** */
        // NWBDApiWeiXincreateShareCode: apiAddress1 + "/wechat/portal/createShareCode", 	//	获取分享二维码
        pzTime:'3600',	//		计时器时间״̬
        testPhone:'/^((17[0-9])|(14[0-9])|(13[0-9])|(15[0-9])|(16[0-9])|(18[0-9])|(19[0-9]))\d{8}$/',
        // shareAdd:apiAddress1 + '/Views/shareList/share.html?customerId=',     //  分享页面地址(正式记得注释掉)
        // imgUrl:apiAddress1 + '/images/qrhtml.png'                               //  分享图片地址
        
    };

    if (api.isDebug) {
        document.write("<script src='" + api.getLocalhostPaht() + "/" + api.debugProjectName + "/js/app.js?v=1.0.18' charset='utf-8'></script>");
        document.close();
    } else {
        $('#barrage_name1 img').css({'opacity':'0'});
        $('#barrage_name img').css({'opacity':'0'});
        //document.write("<script src='" + api.getLocalhostPaht() + "/js/vue-lazyload.js?v=1.0.4' charset='utf-8'></script>");       //  懒加载js
        document.write("<script src='" + api.getLocalhostPaht() + "/js/app.js?v=2.0.0' charset='utf-8'></script>");       ///bbcf-common-h5/assets
        document.write("<script src='" + api.getLocalhostPaht() + "/Views/Component/js/notives.js?v=2.0.2' charset='utf-8'></script>");     //  活动js
        document.write("<script src='" + api.getLocalhostPaht() + "/Views/Component/js/count.js?v=2.0.2' charset='utf-8'></script>");       //  计时器js
        document.write("<script src='" + api.getLocalhostPaht() + "/Views/Component/js/guide.js?v=2.0.0' charset='utf-8'></script>");       //  指南js
        
        //  引入活动css
        $("<link>").attr({ rel: "stylesheet",
                type: "text/css",
                href: api.getLocalhostPaht() + "/Views/Component/css/notices.css?v=2.1.7"
        }).appendTo("head");
        
        //  引入计时器css
        $("<link>").attr({ rel: "stylesheet",
                type: "text/css",
                href: api.getLocalhostPaht() + "/Views/Component/css/count.css?v=2.1.3"
        }).appendTo("head");
        document.close();
    }
    return api;
})();