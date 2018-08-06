var specificOrder = function () {
    "use strict";
    var body = $('body');
    $(".payment_order").css("height", $(window).height() + "px");
    $(".evaluation_order").css("height", $(window).height() + "px");
    $(".current_order").css("height", $(window).height() + "px");
    $(".voucher_block").css("height", $(window).height() + "px");       //  优惠券模块
    

    var type = app.getQueryString("type");
    if (!type) {
        alert("请从个人中心进入该页面");
        window.location.href = "../../index.html";
    }
    
    //判断页面标题
    if(type == 'payment_order'){
    	document.title = '待付款';
    }else if(type == 'current_order'){
    	document.title = '当前订单';
    }else if(type == 'evaluation_order'){
    	document.title = '待评价';
    }

    var payment_order_pageNum = 1;
    var evaluation_order_pageNum = 1;
    var current_order_pageNum = 1;
    var pageSize = 10;
    var ijroll;
    var ijroll_y = 0;
    ijroll = new JRoll($("." + type)[0]);
    ijroll.pulldown({
        refresh: function (complete) {
            payment_order_pageNum = 1;
            evaluation_order_pageNum = 1;
            current_order_pageNum = 1;
            ijroll_y = 0;
            complete();
            getPageData(type, "update");
        }
    });
    ijroll.scrollTo(0, ijroll_y);
    ijroll.on('touchEnd', function () {
        if (ijroll.maxScrollY >= ijroll.y) {
            ijroll_y = ijroll.maxScrollY;
            getPageData(type, "add");
        }
    });

    var getStatusStr = function (status) {
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
    var createData = function (data, dataLength, type) {
    	console.log(data)
    	// new Date(data[i].create_time).toLocaleString()	app.getTime(data[i].create_time,1)
        var str = "";
        for (var i = 0; i < dataLength; i++) {
            str += `
            <li>
                <h3>
                    <span class="order_li_h3_left">维修单</span>
                    <span class="order_li_h3_center">${app.getTime(data[i].create_time,3)}</span>
                    <span class="order_li_h3_right">订单状态 : ${getStatusStr(data[i].status)}</span>
                </h3>
                <div class="head_bottom"></div>
                <div class="middle_content">
                    <p class="order_li_brands">${data[i].brand_name}</p>
                    <span class="order_li_carNo">${data[i].car_number}</span>
                    <span class="order_li_maintenanceType ellipsis">维修类型 : ${data[i].repair_content}</span>
                    <span class="order_li_repairer ellipsis">维修厂 : ${data[i].companyName}</span>
                </div>
                <div class="bottom_btn">
                    <a class="bottom_btn_left" href="tel:4000-016-369">联系客服</a>
                    <a class="bottom_btn_right" href="tel:${data[i].service_hotline}">联系维修厂</a>
                </div>`;
            if ((type === 1 || type === 5) && data[i].status === 5) {
                str += `<div class="order_operating">
                            <p>应付款</p>
                            <p class="money"><small>￥</small>${data[i].price}</p>
                            <button id="btn_pay" data-id="${data[i].id}" data-price="${data[i].price}">在线支付</button>
                        </div>`;
            }
            if (type === 10 && data[i].status === 2 && !data[i].comment_id) {
                str += `<div class="order_operating">
                            <p>实付款</p>
                            <p class="money"><small>￥</small>${data[i].price}</p>
                            <button id="btn_evaluation" data-id="${data[i].id}">去评价</button>
                        </div>`;
            }
            if (!data[i].price && data[i].expect_price) {
                str += `<div class="order_operating">
                            <p class="ellipsis">预估维修价格</p>
                            <p class="money"><small>￥</small>${data[i].expect_price}</p>
                        </div>`;
            }
            str += `</li>`;
        }
        return str;
    };
    //加载订单列表
    var getPageData = function (ordertype, datatype) {
        app.verificationUserInfo();
        var type = 1;
        var pageNum = 1;
        if (ordertype === "payment_order") {
            pageNum = payment_order_pageNum;
            type = 5;
        } else if (ordertype === "evaluation_order") {
            pageNum = evaluation_order_pageNum;
            type = 10;
        } else if (ordertype === "current_order") {
            pageNum = current_order_pageNum;
            type = 1;
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
                open_id: app.getItem("userInfo").id,
                type: type,
                pageNum: pageNum,
                pageSize: pageSize,
            },
            success: function (result) {
                // console.log(JSON.stringify(result));
                if (result.status === "success" && result.code === 0) {
                    var data = result.data;
                    var dataLength = result.data.length;
                    if (result.data.length > 0) {
                        // ijroll_y = 0;
                        var str = createData(data, dataLength, type);
                        if (datatype === "add") {
                            $('.' + ordertype).children("ul").append(str);
                        } else if (datatype === "update") {
                            $('.' + ordertype).children("ul").html(str);
                        }
                        if (result.data.length >= pageSize) {
                            if (ordertype === "payment_order") {
                                payment_order_pageNum++;
                            } else if (ordertype === "evaluation_order") {
                                evaluation_order_pageNum++;
                            } else if (ordertype === "current_order") {
                                current_order_pageNum++;
                            }
                        } else if (result.data.length < pageSize) {
                            payment_order_pageNum = -1;
                            evaluation_order_pageNum = -1;
                            current_order_pageNum = -1;
                        }
                    } else {
                        if (ijroll_y === 0 && pageNum === 1) {
                            $('.' + ordertype).children("ul").html("<div style='position: fixed;top:15%;left: 50%;transform: translateX(-50%);'><img src='../../images/no_data.png' style='width: 2.75rem;height: 2.8rem;' /><div style='color: #555;margin-top: 0.1rem;text-align: center;'>当前没有订单哦~</div></div>");
                        }
                    }
                    ijroll.refresh();
                    app.closeLoading();
                } else {
                    app.closeLoading();
                    app.alert(result.message);
                }
            },
            error: function () {
                app.closeLoading();
                app.alert('操作失败，请检查网络！');
            }
        });
    };
    $("." + type).show();
    getPageData(type, "add");

    //支付
    var detectPay = function (outTradeNo) {
        app.loading();
        $.ajax({
            url: api.NWBDApiOrderQuery + "?r=" + Math.random(),
            type: "POST",
            data: {
                outTradeNo: outTradeNo
            },
            dataType: 'json',
            success: function (result) {
                if (result.status === "success" && result.code === 0) {
                    if (result.data === "SUCCESS") {
                        alert("付款成功");
                        window.location.href = window.location.href.indexOf("?") === -1 ? window.location.href + '?t=' + ((new Date()).getTime()) : window.location.href + '&t=' + ((new Date()).getTime());
                    } else {
                        alert("支付失败，如已付款，请联系客服");
                        app.closeLoading();
                    }
                } else {
                    alert(result.message);
                    app.closeLoading();
                }
            },
            error: function () {
                alert("网络不可用，如已付款，请联系客服");
                app.closeLoading();
            }
        });
    };
    body.on("click", "#btn_pay", function () {
        app.verificationUserInfo();
        if(!chooseVoucher()){
            return;
        };
        app.loading();
        var self = $(this);
        $.ajax({
            url: api.NWBDApiUniformorder + "?r=" + Math.random(),
            type: "POST",
            data: {
                open_id: app.getItem("open_id"),
                order_id: self.attr("data-id"),
                money: self.attr("data-price")
            },
            dataType: 'json',
            success: function (result) {
                console.log(result)
                if (result.status === "success" && result.code === 0) {
                    wx.chooseWXPay({
                        nonceStr: result.data.nonceStr,
                        package: "prepay_id=" + result.data.prepayId,
                        signType: 'MD5',
                        paySign: result.data.sign,
                        timestamp: result.data.timeStamp,
                        success: function (result) {
                            app.closeLoading();
                            if (result.errMsg === "chooseWXPay:ok") {
                                layer.open({
                                    content: '支付结果？',
                                    btn: ['支付成功', '支付遇到问题'],
                                    yes: function (index) {
                                        layer.close(index);
                                        detectPay(self.attr("data-id"));
                                    },
                                    no: function () {
                                        detectPay(self.attr("data-id"));
                                    }
                                });
                            } else {
                                alert("支付失败，如已付款，请联系客服");
                                app.closeLoading();
                            }
                        },
                        cancel: function () {
                            alert("支付已取消");
                            app.closeLoading();
                        },
                        fail: function () {
                            alert("支付失败，如已付款，请联系客服");
                            app.closeLoading();
                        }
                    });
                } else {
                    alert(result.message);
                    app.closeLoading();
                }
            },
            error: function () {
                alert('操作失败，请检查网络！');
                app.closeLoading();
            }
        });
    });

    //评价
    body.on("click", "#btn_evaluation", function () {
        app.alert("coming soon");
    });


    //  优惠券部分
    var chooseVoucher = function (){
        var kg = false;
        $('.voucher_block').animate({'right':'0','top':'0'},250);
        return kg;
    };
};