


//	初始化；
$(function () {
    "use strict";
    //  -fastclick 用法
    FastClick.attach(document.body);

	app.loading();
	if (api.isDebug) {
        //-调用页面逻辑方法
		editQuickMess();
	} else {
		$.ajax({
			url: api.NWBDApiGetWxTicket + "?r=" + Math.random(),
			type: "POST",
			async: false,
			data: {
				wxUrl: window.location.href,
				openid: app.getItem("open_id")
			},
			success: function (result) {
				console.log(result)
				app.closeLoading();
				if (result.status === "success" && result.code === 0) {
					wx.config({
						debug: api.isDebug,
						appId: result.data.AppID,
						timestamp: result.data.timestamp,
						nonceStr: result.data.noncestr,
						signature: result.data.signature,
						jsApiList: [
						'openLocation', 
						'hideAllNonBaseMenuItem',
						'hideOptionMenu',		//	隐藏分享菜单
						'checkJsApi',			//	
						'onMenuShareTimeline',	//	分享到朋友圈
						'onMenuShareAppMessage'	//	分享给朋友
						]
					});
					wx.ready(function () {
						//-调用页面逻辑方法
		                editQuickMess();
						
						//新增分享
						wx.checkJsApi({
							jsApiList:['chooseImage'],	//	需要检测的JS接口列表
							success:function(res){
								console.log(res)
							}
						});
						var id = app.getItem('userInfo').id;
						var shareUrl = api.shareAdd + id;
						var obj = {
							//	朋友圈
							title:api.shareText,	//	标题
							desc:api.shareText2,	//	描述
							link:shareUrl,	//	分享链接
							imgUrl:api.imgUrl,	//	分享图标
							fail:function(res){
								console.log(JSON.stringify(res))
							},
							success:function(){
							},
							cancel:function(){
							}
						};
						
						
						if(!app.getItem('userInfo').id){
							wx.hideAllNonBaseMenuItem();	//	隐藏所有非基础按钮
						}else{
							wx.onMenuShareTimeline(obj)	//	分享到朋友圈
							wx.onMenuShareAppMessage(obj)	//	分享给朋友
						}
					});
					wx.error(function () {
						alert("公众号页面授权失败");
						app.f_close();
					});
				} else {
					alert("获取授权失败：" + result.message);
					app.f_close();
				}
			},
			error: function () {
				alert("网络异常，请检查网络");
				app.f_close();
			}
		});
    }

	var lat;
	var lng;
	var addressProvince = "";
	var addressCity = "";
	var addressCounty = "";

	//-调用 获取openid方法
	api.getopenid();


	//-选择车牌号
	var body = $('body');
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
            shade: true,
            style: 'position:fixed; bottom:0; left:0; width: 100%; height: auto; margin:0; padding:0; border:none;'
        });
        if (!$("#carNo").val()) {
            showProvince();
        } else {
            showKeybord();
        }
	});
	

	$('body').on('click',function(e){
		e.stopPropagation();
	});


	//选择车辆品牌
	select_list.init($('.car_showName'));
	
	
	

	//选择保险公司
    body.on("click", ".chooseSafe", function (e) {
		e.stopPropagation();
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
    body.on("click", ".selected-insurance", function (e) {
		e.stopPropagation();
        $("#car_insuranceId").val($(this).attr("data-id"));
		$("#car_insuranceName").val($(this).text());
        $(".car_showCarinsuranceName").text($(this).text());		
        $(".commom_page").stop().animate({"left": "100%"}, 200, "linear");
    });
   

});

 //  -页面加载方法
 var editQuickMess = function (){
	// -页面逻辑加载
	if(app.getItem("send_position")){
		var get_position = app.getItem("send_position");
		$('.choo').text(get_position);
	};
	$('body').css({'min-height':$(window).height()});
};


function onApiLoaded() {
	try {
		var map = new AMap.Map("show_map", {resizeEnable: true, zoom: 17});

		var marker = new AMap.Marker();
		marker.setMap(map);
		//点击地图
		var clickEventListener = map.on('click', function (e) {
			layer.open({type: 2, anim: "up", shadeClose: false});
			var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];
			marker.setPosition(lnglatXY);
			geocoder.getAddress(lnglatXY, function (status, result) {
				console.log(result)
				if (status === 'complete' && result.info === 'OK') {
					addressProvince = result.regeocode.addressComponent.province;
					addressCity = result.regeocode.addressComponent.city;
					//防止高德地图，直辖市的时候，城市返回空
					if (!addressCity) {
						addressCity = addressProvince;
					}
					addressCounty = result.regeocode.addressComponent.district;
					lat = e.lnglat.getLat();
					lng = e.lnglat.getLng();
					app.closeLoading();
					$('.choo').text(result.regeocode.formattedAddress);
					$(".gaode_map").stop().animate({"left": "100%"}, 200, "linear");
				} else {
					alert("获取地址失败，请检查网络");
					app.closeLoading();
				}
			});
		});

		var placeSearch;
		var geocoder;
		AMap.service(["AMap.PlaceSearch", "AMap.Geocoder"], function () {
			placeSearch = new AMap.PlaceSearch({
				pageSize: 3,
				pageIndex: 1,
				city: "010",
				map: map,
				panel: "panel_map"
			});
			geocoder = new AMap.Geocoder({city: "010"});
			AMap.event.addListener(placeSearch, 'selectChanged', function (results) {
				
				layer.open({type: 2, anim: "up", shadeClose: false});
				addressProvince = results.selected.data.pname;
				addressCity = results.selected.data.cityname;
				//防止高德地图，直辖市的时候，城市返回空
				if (!addressCity) {
					addressCity = addressProvince;
				}
				addressCounty = results.selected.data.adname;
				var map_address;
				if (results.selected.data.pname === results.selected.data.cityname) {
					map_address = results.selected.data.cityname + results.selected.data.address + results.selected.data.name;
				} else {
					map_address = results.selected.data.pname + results.selected.data.cityname + results.selected.data.address + results.selected.data.name;
				}
				
				lat = results.selected.data.location.lat;
				lng = results.selected.data.location.lng;
				app.closeLoading();
				$('.choo').text(map_address);
				$(".gaode_map").stop().animate({"left": "100%"}, 200, "linear");
			});
			AMap.event.addListener(placeSearch, 'error', function (results) {
				alert("查询地址失败，请检查网络");
				app.closeLoading();
			});
		});
		$("#map_search").on("click", function () {
			placeSearch.search($("#map_address").val(), function () {
			});
		});

		//自动获取  	geolocation定位，提供了获取用户当前准确位置、所在城市的方法

		var get_position = app.getItem("send_position");
			
	} catch (e) {
		alert("加载高德地图失败，请检查网络后重试");
		window.location.href = "../QuickRepair/QuickRepair.html";
	}

	//-点击地图蓝色返回
	$("body").on("click", "#map_back", function () {
		$(".gaode_map").stop().animate({"left": "100%"}, 200, "linear");
	});
	//-选择故障发生地
	$("body").on("click", ".chooseArea", function () {
		$(".amap-info-contentContainer").remove();
		$(".gaode_map").stop().animate({"left": "0"}, 200, "linear");
	});
}



var jsapi = document.createElement('script');
	jsapi.charset = 'utf-8';
	jsapi.src = 'https://webapi.amap.com/maps?v=1.4.7&key=e9d83bcf337ca24921e9af7aee928b4d&callback=onApiLoaded';
	document.head.appendChild(jsapi);




	