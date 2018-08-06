var api = (function () {
//	var apiAddress = "47.94.192.200:18083";         //  正式地址
	var apiAddress1 = "https://wxcs.nuoweibd.com";
    var apiAddress = "https://wxcsht.nuoweibd.com:8443";
    var api = {
        isDebug: false,
        debugProjectName: "wxcs.nuoweibd.com",		//	wxcs.nuoweibd.com
        callbackUrl: "wxcs.nuoweibd.com",
        appid: "wxe6766bc37f2769b2",
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
        NWBDApiSearchMerchantList: apiAddress + "/merchant/searchMerchantList",
        NWBDApiGetOrderList: apiAddress + "/WeiXinPay/getOrderList",
        NWBDApiGetMerchantDetailInfo: apiAddress + "/merchant/merchantDetailInfo",
        NWBDApiOrderAdd: apiAddress + "/WeiXinPay/orderAdd",
        NWBDApiWeiXinPay: apiAddress + "/WeiXinPay/pay",
        NWBDApiWeiXinpushOrder: apiAddress + "/weixin/order/pushOrder",		//	查看是否有派单中未接受订单
        NWBDApiWeiXincancelOrder: apiAddress + "/weixin/order/cancelOrder",		//	取消订单
        NWBDApiWeiXincheckOrderStatus: apiAddress + "/weixin/order/checkOrderStatus",		//	查询订单当前状态
        NWBDApiWeiXincreateShareCode: apiAddress1 + "/wechat/portal/createShareCode", 	//	获取分享二维码
        pzTime:'3600',	//		计时器时间״̬
        testPhone:'/^((17[0-9])|(14[0-9])|(13[0-9])|(15[0-9])|(16[0-9])|(18[0-9])|(19[0-9]))\d{8}$/'
    };

    if (api.isDebug) {
        document.write("<script src='" + api.getLocalhostPaht() + "/" + api.debugProjectName + "/js/app.js?v=1.0.17' charset='utf-8'></script>");
        document.close();
    } else {
        document.write("<script src='" + api.getLocalhostPaht() + "/js/app.js?v=1.0.18' charset='utf-8'></script>");
        document.write("<script src='" + api.getLocalhostPaht() + "/Views/Component/js/notives.js?v=1.0.6' charset='utf-8'></script>");     //  活动js
        document.write("<script src='" + api.getLocalhostPaht() + "/Views/Component/js/count.js?v=1.0.2' charset='utf-8'></script>");       //  计时器js
        document.write("<script src='" + api.getLocalhostPaht() + "/Views/Component/js/guide.js?v=1.0.3' charset='utf-8'></script>");       //  指南js
      
        //  引入活动css
        $("<link>").attr({ rel: "stylesheet",
                type: "text/css",
                href: api.getLocalhostPaht() + "/Views/Component/css/notices.css?v=1.1.5"
        }).appendTo("head");
        
        //  引入计时器css
        $("<link>").attr({ rel: "stylesheet",
                type: "text/css",
                href: api.getLocalhostPaht() + "/Views/Component/css/count.css?v=1.1.3"
        }).appendTo("head");
        document.close();
    }
    return api;
})();