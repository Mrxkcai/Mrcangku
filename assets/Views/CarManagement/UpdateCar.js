$(function () {
    "use strict";

    var body = $("body");

    var fromType = app.getQueryString("fromType");

    app.verificationUserInfo();
    if (fromType === "update" && app.getQueryString("update_carId")) {
        app.loading();
        $.ajax({
            url: api.NWBDApiGetCarInfoByID + "?car_id=" + app.getQueryString("update_carId") + "&openid=" + app.getItem("open_id") + "&r=" + Math.random(),
            type: "GET",
            dataType: 'json',
            success: function (result) {
                // console.log(JSON.stringify(result));
                if (result.status === "success" && result.code === 0) {
                    $("#carId").val(app.getQueryString("update_carId"));
                    $("#carNo").val(result.data.car_number);
                    $("#car_brandId").val(result.data.car_brand_id);
                    $("#car_brandName").val(result.data.car_brand_name);
                    if (result.data.car_brand_name && result.data.car_brand_name !== "0") {
                        $(".car_showName").text(result.data.car_brand_name);
                        // $(".car_showName").css("color", "#6e6e70");
                    }
                    $("#car_seriesId").val(result.data.car_series_id);
                    $("#car_seriesName").val(result.data.car_series_name);
                    if (result.data.car_series_name && result.data.car_series_name !== "0") {
                        $(".car_showName").text(result.data.car_series_name);
                        // $(".car_showName").css("color", "#6e6e70");
                    }
                    $("#car_modelId").val(result.data.car_model_id);
                    $("#car_modelName").val(result.data.car_model_name);
                    if (result.data.car_model_name && result.data.car_model_name !== "0") {
                        $(".car_showName").text(result.data.car_model_name);
                        // $(".car_showName").css("color", "#6e6e70");
                    }
                    $(".car_showCarinsuranceName").text(result.data.insuranceName);
                    // $(".car_showCarinsuranceName").css("color", "#6e6e70");
                    $("#car_insuranceId").val(result.data.insurance_id);
                    $("#car_insuranceName").val(result.data.insuranceName);
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
    }

    var provinces = ["陕", "沪", "浙", "苏", "粤", "鲁", "晋", "冀",
        "豫", "川", "渝", "辽", "吉", "黑", "皖", "鄂",
        "津", "贵", "云", "桂", "琼", "青", "新", "藏",
        "蒙", "宁", "甘", "京", "闽", "赣", "湘", "挂", "学", "警", "港", "澳"];

    var keyNums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];

    //关闭数字和字母键盘
    body.on("click", ".ul_keybord li.li_close,.ul_pro li.li_close,.close_carNo_keyboard", function () {
        layer.closeAll();
    });

    //清空车牌
    body.on("click", ".ul_pro li.li_clean", function () {
        $("#carNo").val("");
    });
    var controlKeyboard = function (carNoEl, thisEl) {
        if (carNoEl.val().length < 7) {
            carNoEl.val(carNoEl.val() + thisEl.text());
        } else if (carNoEl.val().length === 7) {
            carNoEl.val(carNoEl.val() + thisEl.text());
            layer.closeAll();
        } else if (carNoEl.val().length >= 8) {
            layer.closeAll();
        }
    };
    //选择省份
    body.on("click", ".ul_pro li.li_Province", function () {
        var carNoEl = $("#carNo");
        if (carNoEl.val().length === 0) {
            carNoEl.val($(this).text());
            showKeybord();
            return;
        }
        controlKeyboard(carNoEl, $(this));
    });
    //显示省份键盘
    var showProvince = function () {
        $("#pro").html("");
        var ss = "<ul class='clearfix ul_pro'>";
        for (var i = 0; i < provinces.length; i++) {
            ss += "<li class='li_Province'><span>" + provinces[i] + "</span></li>";
        }
        ss += "<li class='li_close'><span>关闭</span></li><li class='li_clean'><span>清空</span></li><li class='li_SwitchingKeybord'><span>ABC</span></li></ul>";
        $("#pro").html(ss);
    };
    body.on("click", ".li_SwitchingKeybord", function () {
        showKeybord();
    });

    //删除按钮
    body.on("click", ".ul_keybord li.li_del", function () {
        if ($("#carNo").val().length > 0) {
            $("#carNo").val($("#carNo").val().substring(0, $("#carNo").val().length - 1));
        }
        if ($("#carNo").val().length === 0) {
            showProvince();
        }
    });
    //选择数字和字母
    body.on("click", ".ul_keybord li.li_Keybord", function () {
        var carNoEl = $("#carNo");
        controlKeyboard(carNoEl, $(this));
    });
    //显示数字和字母键盘
    var showKeybord = function () {
        $("#pro").html("");
        var sss = "<ul class='clearfix ul_keybord'>";
        for (var i = 0; i < keyNums.length; i++) {
            sss += '<li class="li_Keybord" ><span>' + keyNums[i] + '</span></li>'
        }
        sss += "<li class='li_close'><span>close</span></li><li class='li_del'><span>del</span></li><li class='li_SwitchingProvince'><span>汉字</span></li></ul>";
        $("#pro").html(sss);
    };
    body.on("click", ".li_SwitchingProvince", function () {
        showProvince();
    });

    body.on("click", "#carNo", function (e) {
        layer.open({
            type: 1,
            content: '<div id="pro"></div>',
            anim: 'up',
            shade: false,
            style: 'position:fixed; bottom:0; left:0; width: 100%; height: auto; margin:0; padding:0; border:none;'
        });
        if (!$("#carNo").val()) {
            showProvince();
        } else {
            showKeybord();
        }
    });

    //选择车辆品牌
    select_list.init($(".car_showName"));

    //选择保险公司
    body.on("click", ".car_showCarinsuranceName", function () {
        app.loading();
        var commom_page_content = $(".commom_page_content");
        $.ajax({
            url: api.NWBDApiGetInsuranceCompanyList + "?openid=" + app.getItem("open_id") + "&r=" + Math.random(),
            type: "GET",
            dataType: 'json',
            success: function (result) {
                if (result.status === "success" && result.code === 0) {
                    var insuranceData = result.data;
                    var insuranceDataLength = insuranceData.length;
                    var insuranceStr = "<ul style='margin:0 0.6rem;touch-action: none;'>";
                    for (var i = 0; i < insuranceDataLength; i++) {
                        insuranceStr += "<li class='selected-insurance' style='height: 0.8rem;line-height: 0.8rem;border-bottom: 0.01rem solid #ccc;padding-left: 0.3rem;padding-right: 0.3rem;' data-id='" + insuranceData[i].id + "'>" + insuranceData[i].name + "</li>";
                    }
                    insuranceStr += "</ul>";
                    commom_page_content.html(insuranceStr);
                    commom_page_content.css("height", ($(window).height() - $(".commom_page_close").outerHeight(true)) + "px");
                    new JRoll(commom_page_content[0]);
                    app.closeLoading();
                    common_page.init();
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
    });
    //选中保险公司后
    body.on("click", ".selected-insurance", function () {
        $("#car_insuranceId").val($(this).attr("data-id"));
        $("#car_insuranceName").val($(this).text());
        $(".car_showCarinsuranceName").text($(this).text());
        $(".commom_page").stop().animate({"left": "100%"}, 200, "linear");
    });

    //保存车辆信息
    body.on("click", "footer", function () {
        app.verificationUserInfo();
        //车辆Id
        var carId = $.trim($("#carId").val());
        //车牌号
        var carNo = $.trim($('#carNo').val());
        //车辆品牌相关
        var car_brandId = $.trim($('#car_brandId').val());
        var car_brandName = $.trim($('#car_brandName').val());
        var car_seriesId = $.trim($('#car_seriesId').val());
        var car_seriesName = $.trim($('#car_seriesName').val());
        var car_modelId = $.trim($('#car_modelId').val());
        var car_modelName = $.trim($('#car_modelName').val());
        //保险公司相关
        var car_insuranceId = $.trim($('#car_insuranceId').val());
        var car_insuranceName = $.trim($('#car_insuranceName').val());

        if (!carId) {
            app.alert('车辆信息有误');
            return;
        }
        if (!carNo) {
            app.alert('车牌号不能为空');
            return;
        }
        if (carNo.length < 6 || carNo.length > 8) {
            app.alert('车牌号格式有误');
            return;
        }
        // if (!/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z0-9挂学警港澳]{6,7}$/.test(carNo)) {
        //     app.alert('车牌号填写有误');
        //     return;
        // }


        //      修改的车辆型号只选一级
        // if (!car_brandId || !car_brandName || !car_seriesId || !car_seriesName || !car_modelId || !car_modelName) {
        //     app.alert("请选择车辆品牌型号");
        //     return;
        // }

        if (!car_brandId || !car_brandName) {
            app.alert("请选择车辆品牌型号");
            return;
        }

        // if (!car_insuranceId || !car_insuranceName) {
        //     app.alert("请选择保险公司");
        //     return;
        // }

        var carJson = {
            Id: carId,
            carNo: carNo,
            brandId: car_brandId,
            brandName: car_brandName,
            modelId: car_modelId,
            modelName: car_modelName,
            seriesId: car_seriesId,
            seriesName: car_seriesName,
            insuranceId: car_insuranceId,
            insuranceName: car_insuranceName
        };
        var type;
        if (carId === "0") {
            //新增车辆
            type = 0;
        } else {
            //修改车辆
            type = 1;
        }
        app.loading();
        $.ajax({
            url: api.NWBDApiCarAdd + "?r=" + Math.random(),
            type: "POST",
            dataType: "json",
            data: {
                carJson: JSON.stringify(carJson),
                userId: app.getItem("userInfo").id,
                type: type,
                openid: app.getItem("open_id")
            },
            success: function (result) {
                // console.log(JSON.stringify(result));
                if (result.status === "success" && result.code === 0) {
                    app.closeLoading();
                    app.alert("保存成功");
                    if (fromType === "update" || fromType === "add") {
                       
                        setTimeout(function(){
                            window.location.href = "ListCar.html";
                        },2000)
                    } else if (fromType === "QuickRepairDetails") {
                       
                        setTimeout(function(){
                            window.location.href = "../QuickRepairDetails/QuickRepairDetails.html";
                        },2000)
                    } else {
                        
                        setTimeout(function(){
                            window.location.href = "ListCar.html";
                        },2000)
                    }
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
    });

    var winHeight = $(window).height();
    $(window).resize(function () {
        var thisHeight = $(this).height();
        if (winHeight - thisHeight !== 0) {
            $("footer").hide();
        } else {
            $("footer").show();
        }
    });
});