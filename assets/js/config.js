var api = (function () {
//	var apiAddress = "47.94.192.200:18083";
	var apiAddress1 = "wxcs.nuoweibd.com";
	var apiAddress = "wxcsht.nuoweibd.com:8443";
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
        NWBDApiImproveCustomer: "https://" + apiAddress + "/customer/improveCustomer",
        NWBDApiCarIsExist: "https://" + apiAddress + "/customer/carIsExist",
        NWBDApiOrderQuery: "https://" + apiAddress + "/WeiXinPay/orderQuery",
        NWBDApiGetWxOpenId: "https://" + apiAddress + "/user/getWxOpenId",
        NWBDApiUniformorder: "https://" + apiAddress + "/WeiXinPay/uniformorder",
        NWBDApiPayAndCommentCount: "https://" + apiAddress + "/WeiXinPay/payAndCommentCount",
        NWBDApiVerifysend: "https://" + apiAddress + "/customer/sms/verify/send",
        NWBDApiLogin: "https://" + apiAddress + "/customer/Login",
        NWBDApiGetBrandAll: "https://" + apiAddress + "/customer/car/brand/all",
        NWBDApiGetBrandSub: "https://" + apiAddress + "/customer/car/brand/sub",
        NWBDApiGetInsuranceCompanyList: "https://" + apiAddress + "/insurance/getInsuranceCompanyList",
        NWBDApiCarAdd: "https://" + apiAddress + "/car/carAdd",
        NWBDApiGetCarListByCustomer: "https://" + apiAddress + "/car/getCarListByCustomer",
        NWBDApiGetCarInfoByID: "https://" + apiAddress + "/car/getCarInfoByID",
        NWBDApiSetCommonCar: "https://" + apiAddress + "/car/setCommonCar",
        NWBDApiGetWxTicket: "https://" + apiAddress + "/user/getWxTicket",
        NWBDApiPositionGetMerchantList: "https://" + apiAddress + "/merchant/positionGetMerchantList",
        NWBDApiSearchMerchantList: "https://" + apiAddress + "/merchant/searchMerchantList",
        NWBDApiGetOrderList: "https://" + apiAddress + "/WeiXinPay/getOrderList",
        NWBDApiGetMerchantDetailInfo: "https://" + apiAddress + "/merchant/merchantDetailInfo",
        NWBDApiOrderAdd: "https://" + apiAddress + "/WeiXinPay/orderAdd",
        NWBDApiWeiXinPay: "https://" + apiAddress + "/WeiXinPay/pay",
        NWBDApiWeiXinpushOrder: "https://" + apiAddress + "/weixin/order/pushOrder",		//	查看是否有派单中未接受订单
        NWBDApiWeiXincancelOrder: "https://" + apiAddress + "/weixin/order/cancelOrder",		//	取消订单
        NWBDApiWeiXincheckOrderStatus: "https://" + apiAddress + "/weixin/order/checkOrderStatus",		//	查询订单当前状态
        NWBDApiWeiXincreateShareCode: "https://" + apiAddress1 + "/wechat/portal/createShareCode", 	//	获取分享二维码
        pzTime:'3600'	//		计时器时间״̬
    };

    if (api.isDebug) {
        document.write("<script src='" + api.getLocalhostPaht() + "/" + api.debugProjectName + "/js/app.js?v=1.0.17' charset='utf-8'></script>");
        document.close();
    } else {
        document.write("<script src='" + api.getLocalhostPaht() + "/js/app.js?v=1.0.18' charset='utf-8'></script>");
        document.close();
    }
    return api;
})();