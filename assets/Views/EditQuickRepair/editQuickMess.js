
var lat;
var lng;
var addressProvince = "";
var addressCity = "";
var addressCounty = "";
var carId = '';
var merchantname = '';
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
						var id = '';
						if(app.getItem('userInfo')){
							id = app.getItem('userInfo').id;
						};
							
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
						
						
						if(!app.getItem('userInfo')){
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
    };

	



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
		$(".car_showCarinsuranceName").removeClass('colorG');	//-删除样式	
		$(".car_showCarinsuranceName").addClass('colorB');
        $(".commom_page").stop().animate({"left": "100%"}, 200, "linear");
    });
   

});



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



//	新增倒计时
var vm = new Vue({
	el:'#app',
	data:{
		isBox:false,
		countBlock:{
			min:'00',
			sec:'00',
			numAll:'',
			orderId:localStorage.getItem('orderId')
		},
		countDown:''
				},
	methods:{
		//	转化时间并赋值
		formaFun(a){
			var obj = app.formatDuring(a);
				this.countBlock.min = obj.min;
				this.countBlock.sec = obj.sec;
		},
	timer(m){
		// 定时器
		var tt = setInterval(function(){
			m++;
			this.countDown = m;
			
			localStorage.setItem('num',m)
			vm.formaFun(m)
			if(this.countDown == api.pzTime){
				// 	指定时间后定时器消失
				vm.isBox = false;
				clearInterval(tt);
				vm.countDown = 0;
				localStorage.removeItem('status');
				localStorage.removeItem('num');
				$('#app').removeClass('bottomP')
				var data = {
					order_id:vm.countBlock.orderId,
					userId:app.getItem('userInfo').id,	//	app.getItem('open_id') '9d8eb665-d810-411b-8ad1-77c341f40038'	
					openid: app.getItem("open_id")
				}
				$.ajax({
					type:"POST",
					url:api.NWBDApiWeiXincancelOrder,
					data:data,
					dataType: 'json',
					success:function(result){
						console.log(result)
						if(result.code == 0){
							app.alert(result.data)
							localStorage.removeItem('status');
							localStorage.removeItem('num');
						}
					},
					error:function(){
						app.closeLoading();
					}
				});
			}
		},1000)
	}
	
	},
	mounted(){
		if(!app.getItem('userInfo')){
			return;
		}
		var number1 = app.checkTime()	
		if(number1 != ''){
			this.timer(number1);
		}
		
		//	有未接订单的情况
		var status = localStorage["status"];
		if(status == 1){
			this.isBox = true;
			$('#app').addClass('bottomP')
			this.$refs.countblock.childs();
		}else{
			this.isBox = false;
			$('#app').removeClass('bottomP')
		}
		
		// 调用组件
		this.$refs.adverblock.init();
		//	操作指南
		this.$refs.adverblock1.init1();
	}
});


	
 //  -页面加载方法
 var editQuickMess = function (){
	// -页面逻辑加载
	if(app.getItem("send_position")){
		var get_position = app.getItem("address");
		$('.choo').text(get_position);
	};
	$('body').css({'min-height':$(window).height()});
	
	var data;
	if(app.getItem("userInfo")){
		
		$('#name').val(app.getItem("userInfo").name);
		$('#mobile').val(app.getItem("userInfo").mobile);
		lat = app.getItem('location').lat;
		lng = app.getItem('location').lng;
		addressProvince = app.getItem('province');
		addressCity = app.getItem('city');
		addressCounty = app.getItem('district');
		$.ajax({
				url:api.NWBDApiGetMerchantDetailInfo + "?merchant_id=" + app.getItem("merchant_id")  + "&openid=" + app.getItem("open_id") + "&userId=" + app.getItem("userInfo").id  + "&r=" + Math.random(),
				type:'get',
				success:function(res){
					console.log(res)
					if(res.status == 'success' && res.code == 0){
						data = res.data;
						merchantname = data[0].name;	//-维修厂名字
						//-判断是否存在车辆信息
						if(!data.commonCar){
							
						}else{
							
							$('#carNo').val(data[0].commonCar.carNumber);	//-输出车牌号
							$('.car_showName').val(data[0].commonCar.brandName);	//-输出品牌型号
							$('.car_showCarinsuranceName').val(data[0].commonCar.insuranceName);	//-输出保险公司
							carId = data[0].commonCar.carId;	//-	车辆id
							
						};
					}else{
						app.alert(res.message);
					};
				},
				error:function(){
					app.alert('请检查网络')
				}
			});

		//-确定预约事件
		$('.orderBtn').on('click',function(){
			
			if (!app.getItem("merchant_id")) {
				alert("维修厂信息有变，请重新进入页面");
				window.location.href = "../QuickRepair/QuickRepair.html";
			};
			var name = $.trim($('#name').val());
			if (!name) {
				app.alert('姓名不能为空');
				return;
			};
			if (name.length < 2 || name.length > 10) {
				app.alert('姓名填写有误');
				return;
			};
			var phone = $.trim($('#mobile').val());
			if (!phone) {
				app.alert("手机号不能为空");
				return;
			};
			if (/^((17[0-9])|(14[0-9])|(13[0-9])|(15[0-9])|(16[0-9])|(18[0-9])|(19[0-9]))\d{8}$/.test(phone) == false) {
				app.alert("手机号填写有误");
				return;
			};
			var customerJson = {
				"customerId": app.getItem("userInfo").id,
				"userName": name,
				"mobile": phone
			};
			var carNo = $("#carNo").val();
			if (!carNo || carNo === "0") {
				app.alert('请填写车牌号');
				return;
			};
			if (!lat || !lng || !$(".choo").text() || !addressProvince || !addressCity || !addressCounty) {
				app.alert('请选择故障发生地点');
				return;
			};
			var carXh = $.trim($('.car_showName').text());
			if(carXh == '请选择车辆品牌型号' && $('.car_showName').hasClass('colorG')){
				app.alert('请选择车辆品牌型号');
				return;
			};
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
			};
			if (!car_brandId || !car_brandName) {
				app.alert("请选择车辆品牌型号");
				return;
			};
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

			app.loading();
			$.ajax({
				url: api.NWBDApioperateCar + "?r=" + Math.random(),
				type: "POST",
				dataType: "json",
				data: {
					carJson: JSON.stringify(carJson),
					userId: app.getItem("userInfo").id,
					type:'',
					openid: app.getItem("open_id")
				},
				async:false,
				success: function (result) {
					console.log(result);

					if (result.status === "success" && result.code === 0) {
						carId = result.data;
						var data = {
							car_id: carId,
							customerJson: JSON.stringify(customerJson),
							company_id: app.getItem("merchant_id"),
							company_name: merchantname,
							lat: lat,
							lng: lng,
							address: $(".choo").text(),
							addressProvince: addressProvince,
							addressCity: addressCity,
							addressCounty: addressCounty,
							openid: app.getItem("open_id"),
							repairContent:$('.repairContent textarea').val()
						}
						app.setItem('info',JSON.stringify(data));
						
						$.ajax({
							url: api.NWBDApiOrderAdd + "?r=" + Math.random(),
							type: "POST",
							data: data,
							dataType: 'json',
							success: function (result) {
								console.log(result)
								if (result.status === "success" && result.code === 0) {
									app.closeLoading();
									//	新增预约维修界面
									// return
									window.location.href = "../YuyueRepair/reservationRepair.html";
									//	存储订单id；
									localStorage.setItem("orderId",result.data.order_id)
									$("#carNo").val("0");
									localStorage.removeItem('status');
									localStorage.removeItem('num');
				
									
									
								} else {
									alert(result.message);
									app.closeLoading();
								}
							},
							error: function (res) {
								console.log(res)
								app.alert('操作失败，请检查网络！');
								app.closeLoading();
							}
						});
						
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
		
	}else{

	};

	
	
};