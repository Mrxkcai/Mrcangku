"use strict";

$(function () {
	if (api.isDebug) {} else {
		//return
		//console.log(app.getItem("open_id"))
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
						jsApiList: ['hideOptionMenu', //	隐藏分享菜单
						'checkJsApi', //
						'onMenuShareTimeline', //	分享到朋友圈
						'onMenuShareAppMessage', //	分享给朋友
						'chooseWXPay', 'hideAllNonBaseMenuItem', 'openLocation']
					});
					wx.ready(function () {
						//新增分享
						wx.checkJsApi({
							jsApiList: ['chooseImage'], //	需要检测的JS接口列表
							success: function success(res) {
								console.log(res);
							}
						});

						var i = window.location.href.indexOf('?');
						var e = window.location.href.indexOf('&');
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
							success: function success() {
								layer.close();

								$.ajax({
									url: api.NWBDApiWeiXinShareHaif,
									type: 'POST',
									data: {
										uniqueCode: app.getItem('userInfo').id,
										source: 'CUSTOMER',
										status: 'SUCCEED'
									}
								}).done(function (res) {
									console.log(res);
									var list = res;
									console.log(list.status);
									if (list.status == "success") {
										$.ajax({
											url: api.NWBDApiWeiXinShareModel,
											type: 'POST',
											data: {
												commissionType: 'QR_CODE_SHARE',
												openid: app.getItem("open_id")
											}
										}).done(function (req) {
											$('.ui-dialog').addClass('show');
											if ($('.show-dialog .ui-dialog-bd>h1').length == 0) {
												var item = req;
												var items = '<h1>' + item.data + '<span>' + '元' + '</span>' + '</h1>';
												$('.ui-dialog-bd').prepend(items);
											}
											$('.ui-dialog-close').click(function (event) {
												$(this).parents('.ui-dialog').removeClass('show');
											});
										});
									}
								});
							}
						};
						if (!app.getItem('userInfo').id) {
							wx.hideAllNonBaseMenuItem(); //	隐藏所有非基础按钮
						} else {
							wx.onMenuShareTimeline(obj); //	分享到朋友圈
							wx.onMenuShareAppMessage(obj); //	分享给朋友
						}
					});
					wx.error(function (res) {
						console.log(res);
						alert("公众号页面授权失败");
						app.f_close();
					});
				} else {
					alert("获取授权失败");
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