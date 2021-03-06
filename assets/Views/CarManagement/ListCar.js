"use strict";

$(function () {
    "use strict";

    var body = $("body");
    var list = []; //- 存储数据

    $("#wrapper").css("height", $(window).height() - $(".placeholder_footer").outerHeight(true) + "px");
    var ijroll = new JRoll(document.getElementById("wrapper"));
    ijroll.pulldown({
        refresh: function refresh(complete) {
            complete();
            getCarData();
        }
    });

    var getCarData = function getCarData(func) {
        app.verificationUserInfo();
        app.loading();
        $.ajax({
            url: api.NWBDApiGetCarListByCustomer + "?userId=" + app.getItem("userInfo").id + "&openid=" + app.getItem("open_id") + "&r=" + Math.random(),
            type: "GET",
            dataType: 'json',
            success: function success(result) {

                list = result.data;
                console.log(list);
                if (result.status === "success" && result.code === 0) {
                    var str = '';
                    for (var car = 0; car < result.data.length; car++) {
                        str += "\n        <li>\n            <div class=\"car_top\">\n                <img src=\"" + result.data[car].logo + "\"/>\n                <h3 class=\"show_brands\">" + result.data[car].brand + "</h3>\n                <p class=\"show_number_plate\">" + result.data[car].car_no + "</p>\n                <p class=\"show_insurance_company\">" + (result.data[car].insurer ? result.data[car].insurer.name : "") + "</p>\n            </div>\n            <div class=\"car_bottom\">";
                        if (result.data[car].isCommon) {
                            str += "<a data-carId=\"" + result.data[car].carId + "\" class=\"set_default_car active\" href=\"javascript:;\"><span></span>\u5DF2\u8BBE\u4E3A\u9ED8\u8BA4\u8F66\u8F86</a>";
                        } else {
                            str += "<a data-carId=\"" + result.data[car].carId + "\" class=\"set_default_car\" href=\"javascript:;\"><span></span>\u8BBE\u4E3A\u9ED8\u8BA4\u8F66\u8F86</a>";
                        }
                        str += "<a data-carId=\"" + result.data[car].carId + "\" class=\"update_car\" href=\"javascript:;\">\u7F16\u8F91\u8F66\u8F86\u4FE1\u606F</a></div></li>";
                    }
                    $("#scroller").html(str);
                    ijroll.refresh();
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
    getCarData();

    //设置默认车辆
    body.on("click", ".set_default_car", function () {
        app.verificationUserInfo();
        var thisLi = $(this);
        $.ajax({
            url: api.NWBDApiSetCommonCar + "?r=" + Math.random(),
            type: "POST",
            dataType: 'json',
            data: {
                userId: app.getItem("userInfo").id,
                car_id: thisLi.attr("data-carId"),
                openid: app.getItem("open_id")
            },
            success: function success(result) {
                if (result.status === "success" && result.code === 0) {
                    app.alert("设置成功");
                    thisLi.addClass("active").html("<span></span>已设为默认车辆").parent().parent().siblings().find(".set_default_car").removeClass("active").html("<span></span>设为默认车辆");
                } else {
                    app.alert(result.message);
                }
            },
            error: function error() {
                app.alert('操作失败，请检查网络！');
            }
        });
    });

    //修改车辆
    body.on("click", ".update_car", function () {
        if (getUrlParam('e')) {
            window.location.href = "UpdateCar.html?fromType=update&e=1&update_carId=" + $(this).attr("data-carId");
        } else {
            window.location.href = "UpdateCar.html?fromType=update&update_carId=" + $(this).attr("data-carId");
        }
    });

    //添加车辆
    body.on("click", "footer", function () {
        if (getUrlParam('e')) {
            window.location.href = "UpdateCar.html?fromType=add&e=1";
        } else {
            window.location.href = "UpdateCar.html?fromType=add";
        };
    });

    //-点击选择车辆
    body.on('click', '#scroller li .car_top', function () {
        if (getUrlParam('e')) {
            var index = $(this).parent('li').index();
            var data = {
                Id: list[index].carId,
                brandId: list[index].brand_id,
                brandName: list[index].brand,
                carNo: list[index].car_no,
                insuranceId: list[index].insurer ? list[index].insurer.id : null,
                insuranceName: list[index].insurer ? list[index].insurer.name : null,
                modelId: list[index].model_id,
                modelName: list[index].model,
                seriesId: list[index].series_id,
                seriesName: list[index].series
            };

            app.setItem('carInfo', data);
            window.location.href = "../EditQuickRepair/editQuickMess.html";
            // console.log(data)
        };
    });
});