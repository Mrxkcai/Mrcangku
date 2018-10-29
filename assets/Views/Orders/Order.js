"use strict";

var order = function order() {
    "use strict";

    var body = $('body');

    $(".current_order").css("height", $(window).height() - $("header").outerHeight(true) + "px");
    $(".completed_order").css("height", $(window).height() - $("header").outerHeight(true) + "px");
    $(".cancelled_order").css("height", $(window).height() - $("header").outerHeight(true) + "px");

    var pageSize = 10;

    var current_order_pageNum = 1;
    var current_order_jroll;
    var current_order_jroll_y = 0;
    current_order_jroll = new JRoll($(".current_order")[0]);
    current_order_jroll.pulldown({
        refresh: function refresh(complete) {
            current_order_pageNum = 1;
            current_order_jroll_y = 0;
            complete();
            getPageData("current_order", "update");
        }
    });
    current_order_jroll.scrollTo(0, current_order_jroll_y);
    current_order_jroll.on('touchEnd', function () {
        if (current_order_jroll.maxScrollY >= current_order_jroll.y) {
            current_order_jroll_y = current_order_jroll.maxScrollY;
            getPageData("current_order", "add");
        }
    });

    var completed_order_pageNum = 1;
    var completed_order_jroll;
    var completed_order_jroll_y = 0;
    completed_order_jroll = new JRoll($(".completed_order")[0]);
    completed_order_jroll.pulldown({
        refresh: function refresh(complete) {
            completed_order_pageNum = 1;
            completed_order_jroll_y = 0;
            complete();
            getPageData("completed_order", "update");
        }
    });
    completed_order_jroll.scrollTo(0, completed_order_jroll_y);
    completed_order_jroll.on('touchEnd', function () {
        if (current_order_jroll.maxScrollY >= completed_order_jroll.y) {
            completed_order_jroll_y = completed_order_jroll.maxScrollY;
            getPageData("completed_order", "add");
        }
    });

    var cancelled_order_pageNum = 1;
    var cancelled_order_jroll;
    var cancelled_order_jroll_y = 0;
    cancelled_order_jroll = new JRoll($(".cancelled_order")[0]);
    cancelled_order_jroll.pulldown({
        refresh: function refresh(complete) {
            cancelled_order_pageNum = 1;
            cancelled_order_jroll_y = 0;
            complete();
            getPageData("cancelled_order", "update");
        }
    });
    cancelled_order_jroll.scrollTo(0, cancelled_order_jroll_y);
    cancelled_order_jroll.on('touchEnd', function () {
        if (cancelled_order_jroll.maxScrollY >= cancelled_order_jroll.y) {
            cancelled_order_jroll_y = cancelled_order_jroll.maxScrollY;
            getPageData("cancelled_order", "add");
        }
    });

    var getStatusStr = function getStatusStr(status) {
        switch (status) {
            case 1:
                return "维修中";
            case 2:
                return "已完成";
            case 3:
                return "已取消";
            case 4:
                return "待支付";
            case 5:
                return "待付款";
        }
    };
    var createData = function createData(data, dataLength, type) {
        console.log(data);
        var str = "";
        for (var i = 0; i < dataLength; i++) {
            str += "\n            <li>\n                <h3>\n                    <span class=\"order_li_h3_left\">\u7EF4\u4FEE\u5355</span>\n                    <span class=\"order_li_h3_center\">" + new Date(data[i].create_time).toLocaleString() + "</span>\n                    <span class=\"order_li_h3_right\">\u8BA2\u5355\u72B6\u6001 : " + getStatusStr(data[i].status) + "</span>\n                </h3>\n                <div class=\"head_bottom\"></div>\n                <div class=\"middle_content\">\n                <p class=\"order_li_brands\">" + data[i].brand_name + "</p>\n                    <span class=\"order_li_carNo\">" + data[i].car_number + "</span>\n                    <span class=\"order_li_maintenanceType ellipsis\">\u7EF4\u4FEE\u7C7B\u578B : " + data[i].repair_content + "</span>\n                    <span class=\"order_li_repairer ellipsis\">\u7EF4\u4FEE\u5382 : " + data[i].companyName + "</span>\n                </div>\n                <div class=\"bottom_btn\">\n                    <a class=\"bottom_btn_left\" href=\"tel:4000-016-369\">\u8054\u7CFB\u5BA2\u670D</a>\n                    <a class=\"bottom_btn_right bottom_btn_mid\" href=\"tel:" + data[i].service_hotline + "\">\u8054\u7CFB\u7EF4\u4FEE\u5382</a>\n                    <a class=\"bottom_btn_right\" href=\"../CarProgress/ProgressMess.html\" onclick=\"app.setItem('orderNo','" + data[i].id + "')\">\u7EF4\u4FEE\u8BE6\u60C5</a>\n                </div>";
            if (type === 1 && data[i].status === 5) {
                str += "<div class=\"order_operating\">\n                            <p>\u5E94\u4ED8\u6B3E</p>\n                            <p class=\"money\"><small>\uFFE5</small>" + data[i].price + "</p>\n                            <button id=\"btn_pay\" data-id=\"" + data[i].id + "\" data-price=\"" + data[i].price + "\">\u5728\u7EBF\u652F\u4ED8</button>\n                        </div>";
            }
            if (type === 2 && status === 2 && !data[i].comment_id) {
                str += "<div class=\"order_operating\">\n                            <p>\u5B9E\u4ED8\u6B3E</p>\n                            <p class=\"money\"><small>\uFFE5</small>" + data[i].price + "</p>\n                            <button id=\"btn_evaluation\" data-id=\"" + data[i].id + "\">\u53BB\u8BC4\u4EF7</button>\n                        </div>";
            }
            if (!data[i].price && data[i].expect_price) {
                str += "<div class=\"order_operating\">\n                            <p class=\"ellipsis\">\u9884\u4F30\u7EF4\u4FEE\u4EF7\u683C</p>\n                            <p class=\"money\"><small>\uFFE5</small>" + data[i].expect_price + "</p>\n                        </div>";
            }
            str += "</li>";
        }
        return str;
    };
    //加载订单列表
    var getPageData = function getPageData(ordertype, datatype) {
        app.verificationUserInfo();
        var type = 1;
        var pageNum = 1;
        if (ordertype === "current_order") {
            pageNum = current_order_pageNum;
            type = 1;
        } else if (ordertype === "completed_order") {
            pageNum = completed_order_pageNum;
            type = 2;
        } else if (ordertype === "cancelled_order") {
            pageNum = cancelled_order_pageNum;
            type = 3;
        }
        if (pageNum === -1) {
            return;
        }
        app.loading();
        $.ajax({
            url: api.NWBDApiGetOrderList + "?r=" + Math.random(),
            type: "POST",
            dataType: 'json',
            data: {
                userId: app.getItem("userInfo").id,
                type: type,
                pageNum: pageNum,
                pageSize: pageSize,
                openid: app.getItem("open_id")
            },
            success: function success(result) {
                // console.log(JSON.stringify(result));
                if (result.status === "success" && result.code === 0) {
                    var data = result.data;
                    var dataLength = result.data.length;
                    if (result.data.length > 0) {
                        var str = createData(data, dataLength);
                        if (datatype === "add") {
                            $('.' + ordertype).children("ul").append(str);
                        } else if (datatype === "update") {
                            $('.' + ordertype).children("ul").html(str);
                        }
                        if (result.data.length >= pageSize) {
                            if (ordertype === "current_order") {
                                current_order_pageNum++;
                            } else if (ordertype === "completed_order") {
                                completed_order_pageNum++;
                            } else if (ordertype === "cancelled_order") {
                                cancelled_order_pageNum++;
                            }
                        } else if (result.data.length < pageSize) {
                            current_order_pageNum = -1;
                            completed_order_pageNum = -1;
                            cancelled_order_pageNum = -1;
                        }
                        current_order_jroll.refresh();
                        completed_order_jroll.refresh();
                        cancelled_order_jroll.refresh();
                    } else {
                        if (result.data.length === 0 && pageNum === 1) {
                            $('.' + ordertype).children("ul").html("<div style='position: fixed;top:15%;left: 50%;transform: translateX(-50%);'><img src='../../images/no_data.png' style='width: 2.75rem;height: 2.8rem;' /><div style='color: #555;margin-top: 0.1rem;text-align: center;'>当前没有订单哦~</div></div>");
                        }
                    }
                    app.closeLoading();
                } else {
                    app.closeLoading();
                    app.alert(result.message);
                }
            },
            error: function error() {
                app.closeLoading();
                app.alert('操作失败，请检查网络！');
            }
        });
    };

    //支付
    var detectPay = function detectPay(outTradeNo) {
        app.loading();
        $.ajax({
            url: api.NWBDApiOrderQuery + "?r=" + Math.random(),
            type: "POST",
            data: {
                outTradeNo: outTradeNo,
                openid: app.getItem("open_id")
            },
            dataType: 'json',
            success: function success(result) {
                if (result.status === "success" && result.code === 0) {
                    if (result.data === "SUCCESS") {
                        alert("付款成功");
                        window.location.href = window.location.href.indexOf("?") === -1 ? window.location.href + '?t=' + new Date().getTime() : window.location.href + '&t=' + new Date().getTime();
                    } else {
                        alert("支付失败，如已付款，请联系客服");
                        app.closeLoading();
                    }
                } else {
                    alert(result.message);
                    app.closeLoading();
                }
            },
            error: function error() {
                alert("网络不可用，如已付款，请联系客服");
                app.closeLoading();
            }
        });
    };
    body.on("click", "#btn_pay", function () {
        app.verificationUserInfo();
        app.loading();
        var self = $(this);
        $.ajax({
            url: api.NWBDApiUniformorder + "?r=" + Math.random(),
            type: "POST",
            data: {
                openid: app.getItem("open_id"),
                order_id: self.attr("data-id"),
                money: self.attr("data-price")
            },
            dataType: 'json',
            success: function success(result) {
                if (result.status === "success" && result.code === 0) {
                    wx.chooseWXPay({
                        nonceStr: result.data.nonceStr,
                        package: "prepay_id=" + result.data.prepayId,
                        signType: 'MD5',
                        paySign: result.data.sign,
                        timestamp: result.data.timeStamp,
                        success: function success(result) {
                            app.closeLoading();
                            if (result.errMsg === "chooseWXPay:ok") {
                                layer.open({
                                    content: '支付结果？',
                                    btn: ['支付成功', '支付遇到问题'],
                                    yes: function yes(index) {
                                        layer.close(index);
                                        detectPay(self.attr("data-id"));
                                    },
                                    no: function no() {
                                        detectPay(self.attr("data-id"));
                                    }
                                });
                            } else {
                                alert("支付失败，如已付款，请联系客服");
                                app.closeLoading();
                            }
                        },
                        cancel: function cancel() {
                            alert("支付已取消");
                            app.closeLoading();
                        },
                        fail: function fail() {
                            alert("支付失败，如已付款，请联系客服");
                            app.closeLoading();
                        }
                    });
                } else {
                    alert(result.message);
                    app.closeLoading();
                }
            },
            error: function error() {
                alert('操作失败，请检查网络！');
                app.closeLoading();
            }
        });
    });

    //评价
    body.on("click", "#btn_evaluation", function () {
        app.alert("coming soon");
    });

    body.on('click', 'header>ul>li', function () {
        app.verificationUserInfo();
        $(this).find("p").addClass("active").parent().siblings().find("p").removeClass("active");
        $('.' + $(this).attr("data-className")).show().siblings().hide();
        current_order_pageNum = 1;
        completed_order_pageNum = 1;
        cancelled_order_pageNum = 1;
        $('.' + $(this).attr("data-className")).children("ul").html("");
        getPageData($(this).attr("data-className"), "update");
    });

    //首次进入页面
    $("header>ul>li:first-child").click();
};