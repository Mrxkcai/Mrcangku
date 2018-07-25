(function ($, select_list) {
    "use strict";
    var body = $('body');

    body.append(`
<div class="select_list">
    <div class="select_list_close">×</div>
    <div id="select_list_showLetter" class="select_list_showLetter"><span>A</span></div>
    <ul class="select_list_letter">
        <li>
            <a href="javascript:;">A</a>
        </li>
        <li>
            <a href="javascript:;">B</a>
        </li>
        <li>
            <a href="javascript:;">C</a>
        </li>
        <li>
            <a href="javascript:;">D</a>
        </li>
        <li>
            <a href="javascript:;">E</a>
        </li>
        <li>
            <a href="javascript:;">F</a>
        </li>
        <li>
            <a href="javascript:;">G</a>
        </li>
        <li>
            <a href="javascript:;">H</a>
        </li>
        <li>
            <a href="javascript:;">I</a>
        </li>
        <li>
            <a href="javascript:;">J</a>
        </li>
        <li>
            <a href="javascript:;">K</a>
        </li>
        <li>
            <a href="javascript:;">L</a>
        </li>
        <li>
            <a href="javascript:;">M</a>
        </li>
        <li>
            <a href="javascript:;">N</a>
        </li>
        <li>
            <a href="javascript:;">O</a>
        </li>
        <li>
            <a href="javascript:;">P</a>
        </li>
        <li>
            <a href="javascript:;">Q</a>
        </li>
        <li>
            <a href="javascript:;">R</a>
        </li>
        <li>
            <a href="javascript:;">S</a>
        </li>
        <li>
            <a href="javascript:;">T</a>
        </li>
        <li>
            <a href="javascript:;">U</a>
        </li>
        <li>
            <a href="javascript:;">W</a>
        </li>
        <li>
            <a href="javascript:;">X</a>
        </li>
        <li>
            <a href="javascript:;">Y</a>
        </li>
        <li>
            <a href="javascript:;">Z</a>
        </li>
    </ul>
    <div class="hot_car">
        <ul></ul>
    </div>
    <div class="select_list_ul">
        <ul></ul>
    </div>
</div>
<div class="select_list2">
    <div class="select_list_close2">×</div>
    <div class="select_list_ul2">
        <ul></ul>
    </div>
</div>
<div class="select_list3">
    <div class="select_list_close3">×</div>
    <div class="select_list_ul3">
        <ul></ul>
    </div>
</div>
        `);

    select_list.init = function (element) {
        $(".select_list").css("height", $(window).height() + "px");
        $(".select_list_letter").css("height", $(window).height() + "px");
        $(".select_list_ul").css("height", ($(window).height() - $(".hot_car").outerHeight(true) - $(".select_list_close").outerHeight(true)) + "px");
        $(".select_list_ul2").css("height", ($(window).height() - $(".select_list_close2").outerHeight(true)) + "px");
        $(".select_list_ul3").css("height", ($(window).height() - $(".select_list_close3").outerHeight(true)) + "px");
        var ijroll;

        //关闭页面
        body.on('click', '.select_list_close', function () {
            $(".select_list").stop().animate({"left": "100%"}, 200, "linear");
        });

        //点击索引查询
        body.on('click', '.select_list_letter li a', function () {
            var scrollToStr = $(this).html();
            $("#select_list_showLetter span").html(scrollToStr);
            $("#select_list_showLetter").show().delay(500).hide(0);
            //定位
            ijroll.scrollTo(0, -$('#scrollTo' + $(this).html()).position().top);
        });

        //获取选择车辆品牌型号并展示
        element.on("click", function () {
            app.loading();
            $.ajax({
                url: api.NWBDApiGetBrandAll + "?r=" + Math.random(),
                type: "POST",
                dataType: 'json',
                success: function (result) {
                    // console.log(JSON.stringify(result));
                    if (result.status === "success" && result.code === 0) {
                        //热门品牌
                        var resultDataHot = result.data.hot;
                        var brandHotLength = resultDataHot.length;
                        if (brandHotLength > 0) {
                            var strHot = "<ul>";
                            for (var i = 0; i < brandHotLength; i++) {
                                strHot += '<li><img data-brandId="' + resultDataHot[i].id + '" src="' + resultDataHot[i].logo + '" data-brandName="' + resultDataHot[i].name + '" /></li>';
                            }
                            strHot += "</ul>";
                            $(".hot_car ul").html(strHot);
                        }
                        //普通的
                        var resultDataBrand = result.data.brand;
                        var brandBrandLength = resultDataBrand.length;
                        if (brandBrandLength > 0) {
                            var strBrand = "";
                            for (var j = 0; j < brandBrandLength; j++) {
                                strBrand += '<li><span id="scrollTo' + resultDataBrand[j].block + '">' + resultDataBrand[j].block + '</span>';
                                if (resultDataBrand[j].list.length > 0) {
                                    var resultDataBrandList = resultDataBrand[j].list;
                                    for (var m = 0; m < resultDataBrandList.length; m++) {
                                        strBrand += '<p data-brandId="' + resultDataBrandList[m].id + '" data-brandName="' + resultDataBrandList[m].name + '">' + resultDataBrandList[m].name + '</p>';
                                    }
                                }
                                strBrand += "</li>";
                            }
                            $(".select_list_ul ul").html(strBrand);
                        }
                        ijroll = new JRoll(document.getElementsByClassName("select_list_ul")[0]);
                        app.closeLoading();
                        $(".select_list").stop().animate({"left": "0"}, 200, "linear");
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

        //选择普通品牌（一级）
        body.on('click', '.select_list_ul ul li p', function () {
            var data_brandId = $(this).attr("data-brandId");
            var data_brandName = $(this).attr("data-brandName");
            if (!data_brandId || !data_brandName) {
                app.alert("系统有误，请重新选择！");
                $(".select_list").css({"left": "100%"});
                return false;
            }
            $("#car_brandId").val(data_brandId);
            $("#car_brandName").val(data_brandName);
            $("#car_seriesId").val('');
            $("#car_seriesName").val('');
            $("#car_modelId").val('');
            $("#car_modelName").val('');
            element.text('请您选择');
            app.loading();
            $.ajax({
                url: api.NWBDApiGetBrandSub + "?parentId=" + data_brandId + "&type=brand&r=" + Math.random(),
                type: "GET",
                dataType: 'json',
                success: function (result) {
                    if (result.status === "success" && result.code === 0) {
                        var seriesData = result.data;
                        var seriesDataLength = seriesData.length;
                        if (seriesDataLength > 0) {
                            var strSeries = "";
                            for (var i = 0; i < seriesDataLength; i++) {
                                strSeries += '<li data-seriesId="' + seriesData[i].id + '" data-seriesName="' + seriesData[i].name + '">' + seriesData[i].name + '</li>';
                            }
                            strSeries += "";
                            $(".select_list_ul2 ul").html(strSeries);
                            var ijroll2 = new JRoll(document.getElementsByClassName("select_list_ul2")[0]);
                            app.closeLoading();
                            $(".select_list2").stop().animate({"left": "0"}, 200, "linear");
                        } else {
                            app.closeLoading();
                            $("#car_seriesId").val('0');
                            $("#car_seriesName").val('0');
                            $("#car_modelId").val('0');
                            $("#car_modelName").val('0');
                            element.text(data_brandName);
                            closeAllSelectList();
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

        //选择热门（一级）
        body.on('click', '.hot_car ul li img', function () {
            // app.alertSuccess($(this).attr("data-brandId"));
            // app.alertSuccess($(this).attr("data-brandName"));
            var data_brandId = $(this).attr("data-brandId");
            var data_brandName = $(this).attr("data-brandName");
            if (!data_brandId || !data_brandName) {
                app.alert("数据有误，请重新选择！");
                closeAllSelectList();
                return false;
            }
            $("#car_brandId").val(data_brandId);
            $("#car_brandName").val(data_brandName);
            $("#car_seriesId").val('');
            $("#car_seriesName").val('');
            $("#car_modelId").val('');
            $("#car_modelName").val('');
            element.text('请您选择');
            app.loading();
            $.ajax({
                url: api.NWBDApiGetBrandSub + "?parentId=" + data_brandId + "&type=brand&r=" + Math.random(),
                type: "GET",
                dataType: 'json',
                success: function (result) {
                    if (result.status === "success" && result.code === 0) {
                        var seriesData = result.data;
                        var seriesDataLength = seriesData.length;
                        if (seriesDataLength > 0) {
                            var strSeries = "";
                            for (var i = 0; i < seriesDataLength; i++) {
                                strSeries += '<li data-seriesId="' + seriesData[i].id + '" data-seriesName="' + seriesData[i].name + '">' + seriesData[i].name + '</li>';
                            }
                            strSeries += "";
                            $(".select_list_ul2 ul").html(strSeries);
                            var ijroll2 = new JRoll(document.getElementsByClassName("select_list_ul2")[0]);
                            app.closeLoading();
                            $(".select_list2").stop().animate({"left": "0"}, 200, "linear");
                        } else {
                            app.closeLoading();
                            $("#car_seriesId").val('0');
                            $("#car_seriesName").val('0');
                            $("#car_modelId").val('0');
                            $("#car_modelName").val('0');
                            element.text(data_brandName);
                            closeAllSelectList();
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

        //关闭页面（一级）
        body.on('click', '.select_list_close2', function () {
            $(".select_list2").stop().animate({"left": "100%"}, 200, "linear");
        });

        //选择普通品牌（二级）
        body.on('click', '.select_list_ul2 ul li', function () {
            var data_seriesId = $(this).attr("data-seriesId");
            var data_seriesName = $(this).attr("data-seriesName");
            if (!data_seriesId || !data_seriesName) {
                app.alert("系统有误，请重新选择！");
                closeAllSelectList();
                return false;
            }
            $("#car_seriesId").val(data_seriesId);
            $("#car_seriesName").val(data_seriesName);
            $("#car_modelId").val('');
            $("#car_modelName").val('');
            app.loading();
            $.ajax({
                url: api.NWBDApiGetBrandSub + "?parentId=" + data_seriesId + "&type=series&r=" + Math.random(),
                type: "GET",
                dataType: 'json',
                success: function (result) {
                    if (result.status === "success" && result.code === 0) {
                        var modelData = result.data;
                        var modelDataLength = modelData.length;
                        if (modelDataLength > 0) {
                            var strModel = "";
                            for (var i = 0; i < modelDataLength; i++) {
                                strModel += '<li data-modelId="' + modelData[i].id + '" data-modelName="' + modelData[i].name + '">' + modelData[i].name + '</li>';
                            }
                            strModel += "";
                            $(".select_list_ul3 ul").html(strModel);
                            var ijroll3 = new JRoll(document.getElementsByClassName("select_list_ul3")[0]);
                            app.closeLoading();
                            $(".select_list3").stop().animate({"left": "0"}, 200, "linear");
                        } else {
                            app.closeLoading();
                            $("#car_modelId").val('0');
                            $("#car_modelName").val('0');
                            element.text(data_seriesName);
                            closeAllSelectList();
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

        //关闭页面（二级）
        body.on('click', '.select_list_close2', function () {
            $(".select_list2").stop().animate({"left": "100%"}, 200, "linear");
        });

        //选择普通品牌（三级）
        body.on('click', '.select_list_ul3 ul li', function () {
            // app.alertSuccess($(this).attr("data-modelId"));
            // app.alertSuccess($(this).attr("data-modelName"));
            var data_modelId = $(this).attr("data-modelId");
            var data_modelName = $(this).attr("data-modelName");
            if (!data_modelId || !data_modelName) {
                app.alert("系统有误，请重新选择！");
                closeAllSelectList();
                return false;
            }
            $("#car_modelId").val(data_modelId);
            $("#car_modelName").val(data_modelName);
            element.text(data_modelName);
            closeAllSelectList();
        });

        //关闭页面（三级）
        body.on('click', '.select_list_close3', function () {
            $(".select_list3").stop().animate({"left": "100%"}, 200, "linear");
        });

        function closeAllSelectList() {
            $(".select_list3").css({"left": "100%"});
            $(".select_list2").css({"left": "100%"});
            $(".select_list").css({"left": "100%"});
        }
    };
})($, window.select_list = {});