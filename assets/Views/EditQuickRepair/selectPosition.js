"use strict";

var lat;
var lng;
var addressProvince = "";
var addressCity = "";
var addressCounty = "";

//-调用 获取openid方法
api.getopenid();

$(function () {

	app.loading();
	if (api.isDebug) {
		selectPosition();
	} else {
		$.ajax({
			url: api.NWBDApiGetWxTicket + "?r=" + Math.random(),
			type: "POST",
			async: false,
			data: {
				wxUrl: window.location.href,
				openid: app.getItem("open_id")
			},
			success: function success(result) {
				if (result.status === "success" && result.code === 0) {
					wx.config({
						debug: api.isDebug,
						appId: result.data.AppID,
						timestamp: result.data.timestamp,
						nonceStr: result.data.noncestr,
						signature: result.data.signature,
						jsApiList: ['openLocation', 'hideAllNonBaseMenuItem', 'hideOptionMenu', //	隐藏分享菜单
						'checkJsApi', //	
						'onMenuShareTimeline', //	分享到朋友圈
						'onMenuShareAppMessage' //	分享给朋友
						]
					});
					wx.ready(function () {
						selectPosition();

						//新增分享
						wx.checkJsApi({
							jsApiList: ['chooseImage'], //	需要检测的JS接口列表
							success: function success(res) {
								console.log(res);
							}
						});
						var id = app.getItem('userInfo').id;
						var shareUrl = api.shareAdd + id;
						var obj = {
							//	朋友圈
							title: api.shareText, //	标题
							desc: api.shareText2, //	描述
							link: shareUrl, //	分享链接
							imgUrl: api.imgUrl, //	分享图标
							fail: function fail(res) {
								console.log(JSON.stringify(res));
							},
							success: function success() {},
							cancel: function cancel() {}
						};

						if (!app.getItem('userInfo').id) {
							wx.hideAllNonBaseMenuItem(); //	隐藏所有非基础按钮
						} else {
							wx.onMenuShareTimeline(obj); //	分享到朋友圈
							wx.onMenuShareAppMessage(obj); //	分享给朋友
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
			error: function error() {
				alert("网络异常，请检查网络");
				app.f_close();
			}
		});
	}
});

function onApiLoaded() {
	try {
		var map = new AMap.Map("show_map", { resizeEnable: true, zoom: 17 });

		var marker = new AMap.Marker();
		marker.setMap(map);
		//点击地图
		var clickEventListener = map.on('click', function (e) {
			layer.open({ type: 2, anim: "up", shadeClose: false });
			var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];
			marker.setPosition(lnglatXY);
			geocoder.getAddress(lnglatXY, function (status, result) {
				console.log(result);
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
			geocoder = new AMap.Geocoder({ city: "010" });
			AMap.event.addListener(placeSearch, 'selectChanged', function (results) {
				layer.open({ type: 2, anim: "up", shadeClose: false });
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
			});
			AMap.event.addListener(placeSearch, 'error', function (results) {
				alert("查询地址失败，请检查网络");
				app.closeLoading();
			});
		});
		$("#map_search").on("click", function () {
			placeSearch.search($("#map_address").val(), function () {});
		});

		//-点击蓝色返回
		$('#map_back').on('click', function () {
			window.history.back();
		});

		//自动获取  	geolocation定位，提供了获取用户当前准确位置、所在城市的方法

		var get_position = app.getItem("send_position");
	} catch (e) {
		alert("加载高德地图失败，请检查网络后重试");
		window.location.href = "editQuickMess.html";
	}
};

var jsapi = document.createElement('script');
jsapi.charset = 'utf-8';
jsapi.src = 'https://webapi.amap.com/maps?v=1.4.7&key=e9d83bcf337ca24921e9af7aee928b4d&callback=onApiLoaded';
document.head.appendChild(jsapi);

//  -页面加载方法
var selectPosition = function selectPosition() {
	// -页面逻辑加载

	app.closeLoading();
};