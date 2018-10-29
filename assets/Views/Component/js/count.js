'use strict';

Vue.component('count-block', {
	props: {
		countblock: {
			type: Object,
			default: {}
		}
	},
	data: function data() {
		return {};
	},

	computed: {},
	methods: {
		goOrder: function goOrder() {
			var urll = window.location.href;
			//alert(urll)
			if (urll.indexOf('index') == -1) {
				window.location.href = "../YuyueRepair/reservationRepair.html";
			} else {
				window.location.href = "Views/YuyueRepair/reservationRepair.html";
			}
		},
		childs: function childs() {
			var that = this;
			var data = {
				userId: app.getItem('userInfo').id, //	app.getItem('open_id')
				pageNum: 1,
				pageSize: 1,
				seconds: api.pzTime,
				openid: app.getItem("open_id")
			};

			$.ajax({
				url: api.NWBDApiWeiXinpushOrder, //	因为检查订单状态没有返回剩余时间，所以再次请求此接口
				type: "POST",
				data: data,
				dataType: 'json',
				success: function success(result) {
					console.log(result);
					if (result.status == 'success' && result.code == 0) {
						if (result.data.length > 0) {
							localStorage.setItem('status', 1);
							var countdown = result.data[0].orderInfo.countdown;
							console.log(api.pzTime - countdown + "计时器");
							localStorage.setItem('num', api.pzTime - countdown);
							localStorage.setItem('orderId', result.data[0].orderInfo.id);
							//存储订单中维修厂信息
							localStorage.setItem('merchant', JSON.stringify(result.data[0]));

							//	查询订单状态
							var data = {
								order_id: result.data[0].orderInfo.id,
								userId: app.getItem('userInfo').id, //	app.getItem('open_id')
								openid: app.getItem("open_id")
							};
							if (data.order_id) {
								var status = setInterval(function () {
									console.log('调用成功');
									if (data.order_id != '' && data.user_id != '') {
										$.ajax({
											type: "POST",
											url: api.NWBDApiWeiXincheckOrderStatus,
											data: data,
											dataType: 'json',
											success: function success(result) {
												console.log(result);
												if (result.code == 0) {
													if (result.data == 1) {
														app.alert('商家已接单');
														localStorage.removeItem('status');
														localStorage.removeItem('num');
														clearInterval(status);
														$('.countDown_box').hide();
														$('.consumer_hotline ').removeClass('bottomP');
														//	定位出现
														$('.dwopa').show();
														//	接单后提示进入地图导航
														that.openLocation();
													} else if (result.data == 0) {
														//	未接单存1
														localStorage.setItem('status', 1);
													} else if (result.data == 2) {
														app.alert('订单完成');
														clearInterval(status);
														localStorage.removeItem('status');
														localStorage.removeItem('num');
														$('.countDown_box').hide();
														$('.consumer_hotline ').removeClass('bottomP');
														//	定位出现
														$('.dwopa').show();
													} else if (result.data == 3) {
														app.alert('订单已取消');
														clearInterval(status);
														localStorage.removeItem('status');
														localStorage.removeItem('num');
														$('.countDown_box').hide();
														$('.consumer_hotline ').removeClass('bottomP');
														//	定位出现
														$('.dwopa').show();
													} else if (result.data == 4) {
														app.alert('您选择的企业未接单，请重新下单');
														clearInterval(status);
														localStorage.removeItem('status');
														localStorage.removeItem('num');
														$('.countDown_box').hide();
														$('.consumer_hotline ').removeClass('bottomP');
														//	定位出现
														$('.dwopa').show();
													} else if (result.data == 5) {
														app.alert('维修完成');
														clearInterval(status);
														localStorage.removeItem('status');
														localStorage.removeItem('num');
														$('.countDown_box').hide();
														$('.consumer_hotline ').removeClass('bottomP');
														//	定位出现
														$('.dwopa').show();
													} else {}
													//	待确认跳转
													//									window.location.href="../QuickRepair/QuickRepair.html"
												} else {
													clearInterval(status);
													localStorage.removeItem('status');
													localStorage.removeItem('num');
													$('.countDown_box').hide();
													$('.consumer_hotline ').removeClass('bottomP');
													//	定位出现
													$('.dwopa').show();
												}
											},
											error: function error() {
												//alert('操作失败，请检查网络！');
												clearInterval(status);
											}
										});
									}
								}, 2000);
							}
						} else {
							$('.consumer_hotline ').removeClass('bottomP');
							localStorage.removeItem('status');
							localStorage.removeItem('num');
							//	定位出现
							$('.dwopa').show();
						}
					}
				},
				error: function error() {
					//		                alert('操作失败，请检查网络！');
				}

			});
		},

		//	进入地图导航界面
		openLocation: function openLocation() {
			var list = JSON.parse(localStorage.getItem('merchant'));
			if (!list) {
				return;
			}
			var layer_index = layer.open({
				content: '您的订单已被接单，是否进入导航',
				btn: ['确定', '取消'],
				yes: function yes(index, layero) {
					var merchantData = {
						lat: list.companylat,
						lng: list.companylng,
						name: list.companyName,
						address_detail: list.companyAddress
					};
					var lat = merchantData.lat;
					var lng = merchantData.lng;
					wx.openLocation({
						latitude: parseFloat(lat),
						longitude: parseFloat(lng),
						name: merchantData.name,
						address: merchantData.address_detail,
						scale: 28,
						infoUrl: '',
						fail: function fail() {
							alert("打开地图失败，请检查手机权限");
						}
					});
					layer.close(layer_index);
					//按钮【按钮一】的回调
				},
				end: function end() {
					//	地图结束

				},
				shadeClose: false
			});
		}
	},
	template: '\n\t\t<div class="countDown_box">\n    \t\t<div class="count_timer">\n\t    \t\t<span class="count_number count_number1">\u6B63\u5728\u63A5\u5355\u4E2D</span>\n\t    \t\t<div class="count_number count_number2">\n\t    \t\t\t<span>\n\t    \t\t\t\t{{countblock.min}}\n\t    \t\t\t</span>\n\t    \t\t\t:\n\t    \t\t\t<span>\n\t    \t\t\t\t{{countblock.sec}}\n\t    \t\t\t</span>\n\t    \t\t</div>\n\t    \t</div>\n\t    \t\n\t    \t<div class="count_btn" @click="goOrder()">\n\t    \t\t\u67E5\u770B\n\t    \t</div>\n\t    \t\n\t    \t<p class="count_seconds">{{api.pzTime/60}}\u5206\u949F\u5185\u82E5\u5546\u5BB6\u672A\u63A5\u5355\uFF0C\u7CFB\u7EDF\u5C06\u81EA\u52A8\u53D6\u6D88\u8BA2\u5355</p>\n    </div>\n\t'
});