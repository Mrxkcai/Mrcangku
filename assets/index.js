"use strict";

$(function () {
    $("#app").css("min-height", $(window).height() + "px");
    var body = $("body");
    var sil;
    var getCount = function getCount() {
        app.verificationUserInfo();
        $.ajax({
            url: api.NWBDApiPayAndCommentCount + "?r=" + Math.random(),
            type: "POST",
            data: {
                customer_id: app.getItem("userInfo").id
            },
            dataType: 'json',
            success: function success(result) {
                if (result.status === "success" && result.code === 0) {
                    if (result.data.payCount && result.data.payCount !== 0) {
                        if (result.data.payCount > 99) {
                            $(".pending_payment_count").text("99").css("visibility", "visible");
                        } else {
                            $(".pending_payment_count").text(result.data.payCount).css("visibility", "visible");
                        }
                    } else {
                        $(".pending_payment_count").text("0").css("visibility", "hidden");
                    }
                    if (result.data.currentCount && result.data.currentCount !== 0) {
                        $(".current_order_new").css("visibility", "visible");
                    } else {
                        $(".current_order_new").css("visibility", "hidden");
                    }
                    if (result.data.commentCount && result.data.commentCount !== 0) {
                        if (result.data.commentCount > 99) {
                            $(".be_evaluated_count").text("99").css("visibility", "visible");
                        } else {
                            $(".be_evaluated_count").text(result.data.commentCount).css("visibility", "visible");
                        }
                    } else {
                        $(".be_evaluated_count").text("0").css("visibility", "hidden");
                    }
                }
            }
        });
    };

    
    //获取open_id
    if (!app.getItem("open_id")) {

        if (!app.getQueryString("code")) {
            if (api.isDebug) {
                app.setItem("open_id", "oalBd0epVVUS-w1rswxpJsaj2Fqc");
                window.location.href = api.getLocalhostPaht() + "/" + api.debugProjectName + "/index.html";

                return;
            } else {
                
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + api.appid + "&redirect_uri=" + api.selfHttp + api.callbackUrl + "/index.html&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
                return;
            }
        }
        
        
        //      console.log(app.getQueryString("code"))
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
                } else {
                    alert("获取 open_id 失败");
                    app.f_close();
                }
            },
            error: function error(res) {
                console.log(res)
                // alert("网络异常，请检查网络");
                app.f_close();
            }
        });
    }

    if (app.getItem("userInfo") && app.getItem("userInfo").id && app.getItem("userInfo").mobile && app.getItem("open_id")) {
        $(".show_mobile").text(app.getItem("userInfo").mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'));
        if (app.getItem("userInfo").name) {
            $(".improve_information").css("display", "none");
            $(".show_name").text(app.getItem("userInfo").name);
        }
        $(".header_right").show();
        getCount();
        sil = setInterval(function () {
            getCount();
        }, 5000);
    } else {
        if (sil) {
            clearInterval(sil);
        }
        $(".show_mobile").text("请您登录");
        $(".show_name").text("");
        $(".header_right").hide();
    }

    body.on("click", ".improve_information,.head_portrait", function () {
        window.location.href = "Views/PersonalInformation/PersonalInformation.html";
    });

    //退出登录
    body.on("click", ".sign_out", function () {
        app.removeItem("open_id");
        app.removeItem("userInfo");
        if (api.isDebug) {
            app.setItem("open_id", "oalBd0epVVUS-w1rswxpJsaj2Fqc");
            window.location.href = api.getLocalhostPaht() + "/" + api.debugProjectName + "/index.html";
        } else {
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + api.appid + "&redirect_uri=" + api.selfHttp + api.callbackUrl + "/index.html&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
        }
    });

    //待付款
    body.on("click", ".pending_payment", function () {
        window.location.href = "Views/Orders/SpecificOrder.html?type=payment_order";
    });
    //当前订单
    body.on("click", ".current_order", function () {
        window.location.href = "Views/Orders/SpecificOrder.html?type=current_order";
    });
    //待评价
    body.on("click", ".be_evaluated", function () {
        window.location.href = "Views/Orders/SpecificOrder.html?type=evaluation_order";
    });

    //全部订单
    body.on("click", ".all_orders", function () {
        window.location.href = "Views/Orders/Order.html";
    });
     //优惠券
    body.on("click", ".car_voucher", function () {
        window.location.href = "Views/Voucher/voucher.html";
    });
    //车辆管理
    body.on("click", ".car_management", function () {
        window.location.href = "Views/CarManagement/ListCar.html";
    });
    //常见问题
    body.on("click", ".common_problem", function () {
        window.location.href = "Views/CommonProblem/CommonProblem.html";
    });

    //首页
    body.on("click", ".footer_left", function () {
        app.f_close();
    });
    //车服门店
    body.on("click", ".footer_right", function () {
        window.location.href = "Views/QuickRepair/QuickRepair.html";
    });

});
