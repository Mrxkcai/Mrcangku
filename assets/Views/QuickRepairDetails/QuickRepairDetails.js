var quickRepairDetails = function () {
    "use strict";

    var body = $('body');
    $(".container").css({'min-height': $(window).height() + 'px'});
    

    //  阻止微信拉动出现背景
    document.querySelector('body').addEventListener('touchmove', function(e) {
        if (!document.querySelector('.container').contains(e.target)) {
            e.preventDefault();
        }
    });

    $('.container').on('touchmove',function(e){
        e.stopPropagation();
    });




    //当前页面保存维修厂信息
    var merchantData;

    //进页面之前获取姓名手机号在界面展示
    app.verificationUserInfo();
    $("#name").val(app.getItem("userInfo").name);
    $("#phone").val(app.getItem("userInfo").mobile);

    //首次进入页面获取维修厂信息
    if (!app.getItem("merchant_id")) {
        alert("维修厂信息有变，请重新进入页面");
        window.location.href = "../QuickRepair/QuickRepair.html";
    }
    $.ajax({
        url: api.NWBDApiGetMerchantDetailInfo + "?merchant_id=" + app.getItem("merchant_id") + "&r=" + Math.random(),
        type: "GET",
        dataType: 'json',
        success: function (result) {
               console.log(result);
            if (result.status === "success" && result.code === 0) {
                merchantData = result.data[0];
//				取消時間限制，下单按钮总是可点击
//              if (merchantData.working === "0") {
//                  $(".btn_reservation").css("background", "#ccc");
//                  $(".btn_reservation").prop("disabled", true);
//              }

                //Banner
                var bannerStr = "";
                if (merchantData.image.length > 0) {
                    for (var i = 0; i < merchantData.image.length; i++) {
                        if (merchantData.image[i]) {
                            bannerStr += '<div class="swiper-slide"><img src="' + merchantData.image[i].image_url + '" /></div>';
                        }
                    }
                } else {
                    bannerStr += '<div class="swiper-slide"><img src="../..' + api.Merchant_default_Banner + '" /></div>';
                }
                $(".swiper-container .swiper-wrapper").html(bannerStr);
                new Swiper('.swiper-container', {
                    direction: 'horizontal',
                    loop: true,
                    pagination: {el: '.swiper-pagination'}
                });

                //维修厂名称和评价
                $(".merchant_name_grade span").text(merchantData.name);
                switch (merchantData.grade) {
                    case "1":
                        $(".merchant_name_grade ul li:nth-child(1)").text("");
                        break;
                    case "2":
                        $(".merchant_name_grade ul li:nth-child(1)").text("");
                        $(".merchant_name_grade ul li:nth-child(2)").text("");
                        break;
                    case "3":
                        $(".merchant_name_grade ul li:nth-child(1)").text("");
                        $(".merchant_name_grade ul li:nth-child(2)").text("");
                        $(".merchant_name_grade ul li:nth-child(3)").text("");
                        break;
                    case "4":
                        $(".merchant_name_grade ul li:nth-child(1)").text("");
                        $(".merchant_name_grade ul li:nth-child(2)").text("");
                        $(".merchant_name_grade ul li:nth-child(3)").text("");
                        $(".merchant_name_grade ul li:nth-child(4)").text("");
                        break;
                    case "5":
                        $(".merchant_name_grade ul li").text("");
                        break;
                }

                //企业信息
                $(".service_hotline_value").html('<a style="color:#6e6b6a;" href="tel:' + merchantData.service_hotline + '">' + merchantData.service_hotline + '</a>');
                $(".businessHours_value").text(merchantData.businessHours);
                $(".address_detail_value").html(merchantData.address_detail);

                //主修车型
                var mainBrandStr = "";
                for (var i = 0; i < merchantData.mainBrand.length; i++) {
                    mainBrandStr += `<li>
                    <img src="${merchantData.mainBrand[i].logo}" />
                    <p class="ellipsis">${merchantData.mainBrand[i].brand_name ? merchantData.mainBrand[i].brand_name : ''}</p>
                </li>`;
                }
                $(".major_models>ul").html(mainBrandStr);
            } else {
                app.alert(result.message);
            }
        },
        error: function () {
            app.alert('操作失败，请检查网络！');
        }
    });

    //返回维修厂列表页面
    body.on("click", ".back_span", function () {
        window.location.href = "../QuickRepair/QuickRepair.html?sv=" +app.getQueryString("sv");

    });

    var openLocation = function () {
        var lat = merchantData.lat;
        var lng = merchantData.lng;
        if (!lat || !lng) {
            geocoder.getLocation(merchantData.address_detail, function (status, result) {
                if (status === 'complete' && result.info === 'OK' && result.geocodes[0].location) {
                    lat = result.geocodes[0].location.lat;
                    lng = result.geocodes[0].location.lng;
                    wx.openLocation({
                        latitude: parseFloat(lat),
                        longitude: parseFloat(lng),
                        name: merchantData.name,
                        address: merchantData.address_detail,
                        scale: 28,
                        infoUrl: '',
                        fail() {
                            alert("打开地图失败，请检查手机权限");
                        }
                    });
                } else {
                    app.alert("该维修厂无法查看地图！");
                    return;
                }
            });
        } else {
            wx.openLocation({
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),
                name: merchantData.name,
                address: merchantData.address_detail,
                scale: 28,
                infoUrl: '',
                fail() {
                    alert("打开地图失败，请检查手机权限");
                }
            });
        }
    };

    //调用微信 js-sdk 查看维修厂地图
    body.on("click", ".address_detail_value", function () {
        openLocation();
    });
    //调用微信 js-sdk 查看维修厂地图
    body.on("click", ".img_address", function () {
        openLocation();
    });

    //车辆操作
    var carList_a = $(".carList_a");
    var carList_ul = $("#carList_ul");
    var carData = [];
    var carDataLength = 0;
    carList_ul.html('');
    //更新车辆列表
    var update_carList_ul = function () {
        app.verificationUserInfo();
        $.ajax({
            url: api.NWBDApiGetCarListByCustomer + "?open_id=" + app.getItem("userInfo").id + "&r=" + Math.random(),
            type: "GET",
            dataType: 'json',
            success: function (result) {
                console.log(result.data[0].brand);
                if (result.status === "success" && result.code === 0) {
                    carData = result.data;
                    carDataLength = carData.length;
                    var str = '';
                    for (var car = 0; car < carDataLength; car++) {
                        str += `<li class="carList_ul_li ${result.data[car].isCommon == true ? "active" : ""}" data-carId="${result.data[car].carId}"><span class="car_logo"><img src="${result.data[car].logo}" style="width: 0.5rem;height: 0.5rem;"/></span><h3 class="ellipsis">${result.data[car].brand}</h3><p class="ellipsis">${result.data[car].car_no}</p></li>`;
                        if (result.data[car].isCommon == true) {
                            carList_a.html('<span class="carList_selectCar" data-iconfont="e900"></span><div class="carList_checkedCar"><p>' + result.data[car].brand + '</p><p>' + result.data[car].car_no + '</p></div>');
                            $("#carList_carInfo_Id").val(result.data[car].carId);
                        }
                    }
                    str += '<li class="carList_ul_li carList_ul_addCar" data-carId="0"><a href="../CarManagement/UpdateCar.html?fromType=QuickRepairDetails"><span class="carList_ul_addCar_span"></span><p class="carList_ul_addCar_p">添加车辆</p></a></li>';
                    carList_ul.html(str).fadeIn(200);
                } else {
                    app.alert(result.message);
                }
            },
            error: function () {
                app.alert('操作失败，请检查网络！');
            }
        });
    };

    //点击显示车辆列表
    carList_a.on("click", function () {
        var iconfont = carList_a.find("span:first-child");
        if (iconfont.attr("data-iconfont") === 'e901') {
            //显示
            iconfont.attr("data-iconfont", "e900").text("");

            //第一次进入页面的时候需要获取车辆信息
            if (carDataLength === 0) {
                update_carList_ul();
            } else {
                carList_ul.fadeIn(200);
            }
        } else if (iconfont.attr("data-iconfont") === 'e900') {
            //隐藏
            iconfont.attr("data-iconfont", "e901").text("");
            carList_ul.fadeOut(200);
        }
    });
    carList_a.click();

    //点击车辆列表
    carList_ul.on("click", ".carList_ul_li", function () {
        var curCar = $(this);
        curCar.addClass("active").siblings().removeClass("active");
        carList_a.html('<span class="carList_selectCar" data-iconfont="e900"></span><div class="carList_checkedCar"><p>' + curCar.children("h3").text() + '</p><p>' + curCar.children("p").text() + '</p></div>');

        //点击“新增按钮”时情况界面
        if (curCar.attr("data-carId") === "0") {
            $("#carList_carInfo_Id").val("0");
            carList_a.html('<span class="carList_selectCar" data-iconfont="e900"></span><div class="carList_checkCar"> <p class="carList_selectCar">请您选择</p></div>');
        } else {
            $("#carList_carInfo_Id").val(curCar.attr("data-carId"));
        }
    });

    //我要维修
    body.on("click", ".btn_reservation", function () {
        // alert($("#carList_carInfo_Id").val())
        app.verificationUserInfo();
        if (!app.getItem("merchant_id")) {
            alert("维修厂信息有变，请重新进入页面");
            window.location.href = "../QuickRepair/QuickRepair.html";
        }
        var name = $.trim($('#name').val());
        if (!name) {
            app.alert('姓名不能为空');
            return;
        }
        if (name.length < 2 || name.length > 10) {
            app.alert('姓名填写有误');
            return;
        }
        var phone = $.trim($('#phone').val());
        if (!phone) {
            app.alert("手机号不能为空");
            return;
        }
        if (/^((17[0-9])|(14[0-9])|(13[0-9])|(15[0-9])|(16[0-9])|(18[0-9])|(19[0-9]))\d{8}$/.test(phone) == false) {
            app.alert("手机号填写有误");
            return;
        }
        var customerJson = {
            "customerId": app.getItem("userInfo").id,
            "userName": name,
            "mobile": phone
        };
        var carList_carInfo_Id = $("#carList_carInfo_Id").val();
        if (!carList_carInfo_Id || carList_carInfo_Id === "0") {
            app.alert('请选择车辆');
            return;
        }
        if (!lat || !lng || !$("#address").val() || !addressProvince || !addressCity || !addressCounty) {
            app.alert('请选择预约地址');
            return;
        }
        

        var data = {
                car_id: carList_carInfo_Id,
                customerJson: JSON.stringify(customerJson),
                company_id: app.getItem("merchant_id"),
                company_name: merchantData.name,
                lat: lat,
                lng: lng,
                address: $("#address").val(),
                addressProvince: addressProvince,
                addressCity: addressCity,
                addressCounty: addressCounty
            }
        app.setItem('info',JSON.stringify(data));
        
        
        app.loading();
        $.ajax({
            url: api.NWBDApiOrderAdd + "?r=" + Math.random(),
            type: "POST",
            data: {
                car_id: carList_carInfo_Id,
                customerJson: JSON.stringify(customerJson),
                company_id: app.getItem("merchant_id"),
                company_name: merchantData.name,
                lat: lat,
                lng: lng,
                address: $("#address").val(),
                addressProvince: addressProvince,
                addressCity: addressCity,
                addressCounty: addressCounty
            },
            dataType: 'json',
            success: function (result) {
            	console.log(result)
                if (result.status === "success" && result.code === 0 && result.code!== 2) {
                    app.closeLoading();
                	//	存储订单id；
                	localStorage.setItem("orderId",result.data.order_id)
                    $("#carList_carInfo_Id").val("0");
                    carList_a.html('<span class="carList_selectCar" data-iconfont="e900"></span><div class="carList_checkCar"> <p class="carList_selectCar">请您选择</p></div>');
                    $(".carList_ul_li").removeClass("active");
                    carList_a.find("span:first-child").attr("data-iconfont", "e901").text("");
                    carList_ul.fadeOut(200);
                     
                     //  弹出优惠券界面
                    if(!red_bag()){
                        return
                    }

                    
                    localStorage.removeItem('status');
					localStorage.removeItem('num');
                   
                    
                    
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

    var winHeight = $(window).height();
//  $(window).resize(function () {
//      var thisHeight = $(this).height();
//      if (winHeight - thisHeight >= 50) {
//          $(".btn_reservation").hide();
//      } else {
//          $(".btn_reservation").show();
//      }
//  });


    //  新增优惠券方法
    var red_bag = function(){
        var kg = false;
        
        var index = layer.open({
                    content:
                    `<div class="d-voucher">
                        <div class="img_div">
                            <img src="../../images/default_1125_633.png" alt="图片"/>
                        </div>
                        <p class="get-voucher">恭喜您获得代金券</p>
                        <p>50元</p>
                        <p>有效期：2018.05.04-2018.05.06</p>
                        <p>代金券已帮您保存至个人中心-优惠券列表中，可前往查看。</p>
                        <p>仅支持通过公众号付款时使用。</p>

                        <button class="btn-get">我知道了</button>
                    </div>
                    `,
                    style:"padding:none!important;background:none;box-shadow:none;",
                    shadeClose: false,
                });

        $('.layui-m-layercont').addClass('new');

        $('.btn-get').on('click',function(){
            $('.layui-m-layercont').removeClass('new');
            layer.close(index);
            //	新增预约维修界面
            window.location.href = "../YuyueRepair/reservationRepair.html";
        });

        return  kg;    //     测试阻止--------------------
    };

    app.closeLoading();
};