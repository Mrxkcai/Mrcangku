var specificOrder = function () {
    "use strict";
    var body = $('body');
    $(".payment_order").css("height", $(window).height() + "px");
    $(".evaluation_order").css("height", $(window).height() + "px");
    $(".current_order").css("height", $(window).height() + "px");
    $(".voucher_block").css("height", $(window).height() + "px");       //  优惠券模块

    $('.voucher_block').on('touchmove',function(e){
        e.preventDefault();
        e.stopPropagation();
    });
    $('.self_btn').on('touchmove',function(e){
        e.preventDefault();
        e.stopPropagation();
    });
    


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
    var order_id;       //  存储订单id；
    var wxcar;          //  维修车辆;
    var wxn;            //  车牌号；
    var wxcontent;      //  维修内容；
    var wxm;            //  维修厂；
    var order_price;    //  订单价格；  
    var coucher_id = '';     //  优惠券id;
    var dataList = [];       //  本地data；
    var indexData;


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
        if (ijroll.maxScrollY >= ijroll.y + 5) {
            ijroll_y = ijroll.maxScrollY;
            console.log(ijroll.maxScrollY)
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
                    <span class="order_li_maintenanceType ellipsis">维修类型 : <span class="order_li_maintenanceType2">${data[i].repair_content}</span></span>
                    <span class="order_li_repairer ellipsis">维修厂 : <span class="order_li_repairer2">${data[i].companyName}</span></span>
                </div>
                <div class="bottom_btn">
                    <a class="bottom_btn_left" href="tel:4000-016-369">联系客服</a>
                    <a class="bottom_btn_right " href="tel:${data[i].service_hotline}">联系维修厂</a>
                    <a class="bottom_btn_middle" href="../CarProgress/ProgressMess.html?company_id=${data[i].company_id}"  onclick="app.setItem('orderNo','${data[i].id}')">维修详情</a>
                </div>`;

                 // type==5时加载待付款列表 S   

            if ((type === 1 || type === 5) && data[i].status === 5) {
                if(data[i].coupon_amount){
                    if(data[i].wx_pre_order == '' || data[i].wx_pre_order == null){
                        str += `<div class="order_operating">
                            <p>应付款</p>
                            <p class="money"><small>￥</small>${data[i].price - data[i].coupon_amount}</p>
                            <button id="btn_pay" data-id="${data[i].id}" data-price="${data[i].price - data[i].coupon_amount}">在线支付</button>
                        </div>`;
                    }else{
                        str += `<div class="order_operating">
                            <p>应付款</p>
                            <p class="money"><small>￥</small>${data[i].price - data[i].coupon_amount}</p>
                            <button id="btn_pay" data-id="${data[i].id}" data-price="${data[i].price - data[i].coupon_amount}" style="background:linear-gradient(90deg,#fe8828,#ffaa35);">去支付</button>
                        </div>`;
                    }
                    
                }else{
                    if(data[i].wx_pre_order == '' || data[i].wx_pre_order == null){
                        str += `<div class="order_operating">
                            <p>应付款</p>
                            <p class="money"><small>￥</small>${data[i].price}</p>
                            <button id="btn_pay" data-id="${data[i].id}" data-price="${data[i].price}">在线支付</button>
                        </div>`;
                    }else{
                        str += `<div class="order_operating">
                            <p>应付款</p>
                            <p class="money"><small>￥</small>${data[i].price}</p>
                            <button id="btn_pay" data-id="${data[i].id}" data-price="${data[i].price}" style="background:linear-gradient(90deg,#fe8828,#ffaa35);">去支付</button>
                        </div>`;
                    }
                    
                }
                
            };

            // type==5时加载待付款列表 E

            if (type === 10 && data[i].status === 2 && !data[i].comment_id) {
                if(data[i].coupon_amount){
                    str += `<div class="order_operating">
                            <p>实付款</p>
                            <p class="money"><small>￥</small>${data[i].price - data[i].coupon_amount}</p>
                            <button id="btn_evaluation" data-id="${data[i].id}" onclick="window.location.href = '../assess/assess.html?company_id='+'${data[i].company_id}'+'&orderId='+'${data[i].id}'+'&customerId='+'${data[i].customer_id}'" >去评价</button>
                        </div>`;
                }else{
                    str += `<div class="order_operating">
                            <p>实付款</p>
                            <p class="money"><small>￥</small>${data[i].price}</p>
                            <button id="btn_evaluation" data-id="${data[i].id}" onclick="window.location.href = '../assess/assess.html?company_id='+'${data[i].company_id}'+'&orderId='+'${data[i].id}'+'&customerId='+'${data[i].customer_id}'" >去评价</button>
                        </div>`;
                }
                
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
                userId: app.getItem("userInfo").id,
                type: type,
                pageNum: pageNum,
                pageSize: pageSize,
                openid: app.getItem("open_id")
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
                            for(var i = 0;i < data.length; i ++){
                                dataList.push(data[i]);
                            };
                        } else if (datatype === "update") {
                            dataList = data;
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
                outTradeNo: outTradeNo,
                openid: app.getItem("open_id")
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

    //  支付信息方法；
    


    body.on("click", "#btn_pay", function () {
        var self = $(this);
        var index = $(this).parents('li').index();
        indexData = index;
        
        order_id = self.attr("data-id");        //  订单id
        order_price = self.attr("data-price");  //  订单价格
        wxcar = $(this).parents('li').find('.order_li_brands').text();  //  车型；
        wxn = $(this).parents('li').find('.order_li_carNo').text();      //  车号码；
        wxcontent = $(this).parents('li').find('.order_li_maintenanceType2').text(); //维修内容；
        wxm = $(this).parents('li').find('.order_li_repairer2').text();   //   维修厂；
        
        
        app.verificationUserInfo();

        // alert(dataList[index].wx_pay_status +"----"+ order_id)
        console.log(dataList)
        console.log(index)
        if(dataList[index].wx_pre_order == '' || dataList[index].wx_pre_order == null){
            //  弹出优惠券;
            if(!chooseVoucher(index)){
                return;
            };
        }else{
            $('.self_pay_btn').trigger('click');
            return;
        }

        
    });

    //评价
    body.on("click", "#btn_evaluation", function () {
        // app.alert("coming soon");
    });





    

    //  优惠券部分*************************;

    var chooseVoucher = function (index){
        // var kg = false;
        $('.voucher_block').show();
        $('.voucher_block').animate({'right':'0','top':'0'},250);

        var str = '';
            str +=`
            <div>
                <span>订单编号：</span>
                <span>${order_id}</span>
            </div>
            <div class="three_block">
                <div>
                    <span>维修车辆：</span>
                    <span>${wxcar} ${wxn}</span>
                </div>
                <div>
                    <span>维修内容：</span>
                    <span>${wxcontent}</span>
                </div>
                <div>
                    <span>维修厂：</span>
                    <span>${wxm}</span>
                </div>
            </div>
            `
        $('.order_details').html(str);
        if(dataList[index].coupon_amount){
            $('.order_price_self').html(Number(order_price) + Number(dataList[index].coupon_amount));  //  输入价格；
            $('.price_num').html(Number(order_price));
            $('.selectVoucher span').text(Number(dataList[index].coupon_amount));
        }else{
            //  加载优惠券
            get_voucher_list('update');
            $('.order_price_self').html(Number(order_price));  //  输入价格；
            //console.log(order_price)
            var truePrice = Number(order_price) - Number($('.selectVoucher span').text());
            //console.log(truePrice)
            $('.price_num').html(truePrice);
            
        }

        $('.back_span').show();
        
    };

    //  优惠券返回
    $('.back_span').on('click',function (){
        $('.back_span').hide();
        $('.voucher_block').hide();
        $('.voucher_block').animate({'right':'-100%','top':'0'},250);

        ijroll2.scrollTo(0,0,0);
        $('.select_span').removeClass('icon_active');
        $('.items .select_span').removeClass('icon_active');
        
        //  清空值；
        voucher_pageNum = 1;  //分页
        order_id = '';        //  订单id
        order_price = '';  //  订单价格
        wxcar = '';  //  车型；
        wxn = '';      //  车号码；
        wxcontent = ''; //维修内容；
        wxm = '';   //   维修厂；
        coucher_id = '';    //  优惠券
        $('.price_num').text('');   //  支付金额;
        $('.selectVoucher span').text(0)    //  优惠金额;
    });

    //  点击选择优惠券；
    $('.selectVoucher').on('click',function(){
        if(dataList[indexData].coupon_amount){
            return;
        }
        //  支付按钮消失；
        $('.btn_two').hide();

        var shadeDiv = $('.chooseShade');
            shadeDiv.css({
                'width':'100%',
                'height':$(window).height() + "px",
                'position':'absolute',
                'left':'0',
                'top':'0',
                'background':'rgba(0,0,0,.4)',
                'z-index':'3'
            });
            shadeDiv.fadeIn();
            $('.voucher_list').show();
            $('.voucher_list').animate({'bottom':'0'},300);
            $('.prevent_div').css({
                'width':'100%',
                'height':shadeDiv.height() - $('.voucher_list').height(),
                'bottom':'6.4rem'
            });
            //  禁止滑动背景;
            $('.prevent_div').on('touchmove',function(e){
                e.preventDefault();
                e.stopPropagation();
            });

            //  点击关闭按钮;
            $('.self_btn').on('click',function(){
                $('.voucher_list').animate({'bottom':'-6.4rem'},300);
                shadeDiv.fadeOut();
                $('.btn_two').show();
            });
            

            
            
    });

    //  第二个滑动加载；
    var pageSize2 = 4;
    var voucher_pageNum = 1;
    var ijroll2;
    var ijroll_y2 = 0;
    $(".test_div").height('4rem');
    ijroll2 = new JRoll($(".test_div")[0]);
    
    ijroll2.scrollTo(0, ijroll_y2);
    ijroll2.on('touchEnd', function () {
        if (ijroll2.maxScrollY >= ijroll2.y + 5) {
            ijroll_y2 = ijroll2.maxScrollY;
            
            
            //  调用加载数据方法
            get_voucher_list('add');
        }
    });


    //  加载数据方法;

    
    var get_voucher_list = function (type){
        
        var pageNum2 = 1;
        if(voucher_pageNum == 1){
            $('.items').html('');
        }

        pageNum2 = voucher_pageNum;
        app.verificationUserInfo();

        if(voucher_pageNum == -1){
            return;
        };
        
        var str = "";
        $.ajax({
            url: api.NWBDApiWeiXincouponListUse + "?r=" + Math.random(),
            type: "get",
            dataType: 'json',
            data: {
                userId: app.getItem("userInfo").id,
                orderId: order_id,
                pageNum: pageNum2,
                pageSize: pageSize2,
                openid: app.getItem("open_id")
            },
            success:function(res){
                console.log(res)
                if(res.code == 0 && res.status == 'success'){
                    
                    if(res.data.length > 0){
                        for(var i = 0; i < res.data.length;i ++){
                            str += `
                            <li data-vid="${res.data[i].id}">
                                <span>${res.data[i].typeName}</span>
                                <span>省 <span class="sheng">${res.data[i].price}</span></span>
                                <span class="data_range"> ( ${res.data[i].name} )</span>
                                <span class="select_span"></span>
                            </li>
                            `
                        };
                        $('.data_none').remove();
                        if(type == 'update'){
                            $('.items').html(str);

                            //  首次进来默认选中优惠券；
                            $('.items li:nth-child(1) .select_span').addClass('icon_active');
                            coucher_id = $('.items li:nth-child(1)').attr('data-vid');  //  默认优惠券id;

                            var firsr_num = Number($('.items li:nth-child(1) .sheng').text());
                            $('.selectVoucher span').text(firsr_num);
                            var first_truePrice = Number(order_price) - Number(firsr_num);
                            $('.price_num').html(first_truePrice);
                        }else if(type == 'add'){
                            $('.items').append(str);
                        };
                        
                        //  刷新滑动加载;
                        ijroll2.refresh();

                        if(res.data.length >= pageSize2){
                            voucher_pageNum++;
                        }else if(res.data.length < pageSize2){
                            voucher_pageNum = -1;
                            if($('.items .data_list_none').length == 0 && $('.items li').length >= pageSize2){
                                $('.items').append('<li class="no_more">没有更多了~</li>')
                            }
                        };
                    } else {
                        //console.log(pageNum2)
                        // $('.selectVoucher span').text(0);
                        coucher_id = '';
                        if (pageNum2 === 1) {
                            $('.items').html("<li class='data_none'>暂无优惠券可用</li>");
                        };
                    };

                    
                    
                }else{
                    //  不需要提示；
                    if (pageNum2 === 1) {
                        $('.items').html("<p class='data_none'>暂无优惠券</p>");
                    };
                };
            },
            error:function(){
                app.alert('操作失败，请检查网络！');
            },
        });

    };


    //  选择优惠券点击事件；
    $('.items').on('click','li',function(){
        coucher_id = $(this).attr('data-vid');
        $(this).find('.select_span').addClass('icon_active');
        $(this).siblings('li').find('.select_span').removeClass('icon_active');
        $('.nouser_cash').find('.select_span').removeClass('icon_active');
        //  ****************写成这样也可以；*************
        // $('.voucher_list').animate({'bottom':'-6.4rem'},300);
        // shadeDiv.fadeOut();
        // $('.btn_two').show();
        $('.selectVoucher span').text(Number($(this).find('.sheng').text()));
        var truePrice = Number(order_price) - Number($('.selectVoucher span').text());
        $('.price_num').html(truePrice);
        $('.self_btn').trigger('click');
        
    });

    //  不使用优惠券；
    $('.nouser_cash').find('.select_span').on('click',function(){
        coucher_id = '';
        $(this).addClass('icon_active');
        $('.items li').find('.select_span').removeClass('icon_active');
        $('.selectVoucher span').text(0);
        var truePrice = Number(order_price) - Number($('.selectVoucher span').text());
        $('.price_num').html(truePrice);
        $('.self_btn').trigger('click');
    });


    //  确认支付；
    $('.self_pay_btn').on('click',function(){
        var data;
        if(coucher_id == ''){
            data = {
                openid:app.getItem("open_id"),
                order_id:order_id
            };
        }else{
            data = {
                openid:app.getItem("open_id"),
                order_id:order_id,
                couponId:coucher_id
            };
        };
        
        //alert(data)
        app.loading();
        $.ajax({
            type:'post',
            url:api.NWBDApiWeiXinUniformorder + "?r=" + Math.random(),
            data:data,
            dataType: 'json',
            success:function(res){
                console.log(res)
                if(res.code == 0 && res.status == 'success'){
                    // wx.chooseWXPay({
                    //     nonceStr: res.data.nonceStr,
                    //     package: res.data.package,
                    //     signType: 'MD5',
                    //     paySign: res.data.paySign,
                    //     timestamp: res.data.timeStamp,
                    //     success: function (result) {
                    //         console.log(result)
                    //         app.closeLoading();
                    //         if (result.errMsg === "chooseWXPay:ok") {
                    //             window.location.href = window.location.href.indexOf("?") === -1 ? window.location.href + '?t=' + ((new Date()).getTime()) : window.location.href + '&t=' + ((new Date()).getTime());
                                
                    //         } else {
                                
                    //             app.closeLoading();
                    //         }
                    //     },
                    //     cancel: function () {
                    //         window.location.href = window.location.href.indexOf("?") === -1 ? window.location.href + '?t=' + ((new Date()).getTime()) : window.location.href + '&t=' + ((new Date()).getTime());
                    //         app.closeLoading();
                    //     },
                    //     fail: function () {
                    //          alert("支付失败，如已付款，请联系客服");
                    //         window.location.href = window.location.href.indexOf("?") === -1 ? window.location.href + '?t=' + ((new Date()).getTime()) : window.location.href + '&t=' + ((new Date()).getTime());
                    //         app.closeLoading();
                    //     }
                    // });

                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                           "appId":res.data.appId,     //公众号名称，由商户传入     
                           "timeStamp":res.data.timeStamp,         //时间戳，自1970年以来的秒数     
                           "nonceStr":res.data.nonceStr, //随机串     
                           "package":res.data.package,     
                           "signType":res.data.signType,         //微信签名方式：     
                           "paySign":res.data.paySign //微信签名 
                        },
                        function(res){
                        if(res.err_msg == "get_brand_wcpay_request:ok" ){
                            app.closeLoading();
                            window.location.href = window.location.href + '&t=' + ((new Date()).getTime());
                        // 使用以上方式判断前端返回,微信团队郑重提示：
                              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        }else{
                            alert("支付失败，如已付款，请联系客服");
                            app.closeLoading();
                        };
                     }); 

                }else{
                    alert(res.message);
                    app.closeLoading();
                };
            },
            error:function(res){
                alert(res.message);
                app.closeLoading();
            },
        });
    });
    return;
};