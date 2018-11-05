"use strict";

//	初始化；
$(function () {

	app.loading();
	if (api.isDebug) {
		newDetails();
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
				console.log(result);
				app.closeLoading();
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
						newDetails();

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

	var newDetails = function newDetails() {
		"use strict";

		var vm = new Vue({
			el: "#app",
			data: {
				s1: false,
				s2: false,
				s3: false,
				none: false,
				timeStatus: "",
				marchantGrade: [],
				up: false,
				userNum: false,
				showBtn: true,
				marchantStatus: '',
				marchantJoin: '',
				userNumber: '', //-技师人数
				artificerArr: [], //-展示前五个技师
				marchantDetails: {},
				image_arr: [], //	图片重新排序
				imagesNew: [], //	图片数组
				list: [],
				totalCount: 0
			},
			methods: {
				init: function init() {
					var that = this;
					$('.slideRight').animate({ right: "0" }, 400);
					// $(".parentDiv").height($(window).height());
					//var ijroll =  new JRoll(".parentDiv", {bounce:false, zoom:false,scrollY:true});
					//	初次进入加载数据；
					that.firstIn();
				},
				seeImg: function seeImg(index, length) {
					var that = this;
					if (length == 1) {
						return;
					}
					if (index === 0) {
						$('.newDetail_block').addClass('moveActive');
						that.showBtn = false;
						// $('header img').show();
						$('.info_time2').addClass('infoActive');
						var h = $('.newDetail_block').height(),
						    h2 = $('.info_time').height(),
						    h3 = $('header').height(),
						    h4 = $('.info_time2').height(),
						    h5 = $('.info_time').height() - 60;
						// $('.newDetail_block').animate({ top: 4.2 * length - 1.26 + "rem" }, 400);
						$('.newDetail_block').animate({ top: h3 - h4 - h5 + "px" }, 600, function () {
							$('header').css({ 'height': $(window).height(), 'overflow-y': 'auto' });
							$('.newDetail_block').hide();
							
						});
						that.up = true;
					}
				},
				upImg: function upImg() {
					var that = this;
					$('.newDetail_block').show();
					$('header').animate({ scrollTop: '0px' }, 600);

					$('.newDetail_block').animate({ top: "3.54rem" }, 600, function () {
						that.showBtn = true;
						$('.info_time2').removeClass('infoActive');
						$('header').css({ 'overflow-y': 'hidden' });
					});
					// $('header img:nth-child(n+2)').hide();
					that.up = false;
				},
				firstIn: function firstIn() {
					var that_ = this;
					//当前页面保存维修厂信息
					var merchantData;
					var body = $('body');
					$("#app").css({ 'min-height': $(window).height() + 'px' });

					//首次进入页面获取维修厂信息
					if (!app.getItem("merchant_id")) {
						alert("维修厂信息有变，请重新进入页面");
						window.location.href = "../QuickRepair/QuickRepair.html";
					};

					//	输出存储的车服门店定位距离；
					var send_juli = app.getItem("send_juli");
					$(".send_juli").text(send_juli);

					$.ajax({
						type: 'get',
						url: api.NWBDApiGetMerchantDetailInfo + "?merchant_id=" + app.getItem("merchant_id") + "&openid=" + app.getItem("open_id") + "&userId=" + app.getItem("userInfo").id + "&r=" + Math.random(),
						dataType: 'json',
						async: true,
						success: function success(res) {
							console.log(res);
							if (res.code == 0 && res.status == 'success') {
								if (res.data.length > 0) {
									that_.marchantDetails = res.data[0];
									that_.userNumber = that_.marchantDetails.user.length;

									//-展示前五个技师
									if (that_.marchantDetails.user.length > 5) {
										for (var i = 0; i < 4; i++) {
											that_.artificerArr[i] = that_.marchantDetails.user[i];
										}
									} else {
										that_.artificerArr = that_.marchantDetails.user;
									}
									console.log(that_.artificerArr);
									//	判断技师人数
									if (that_.userNumber >= 10) {
										that_.userNum = true;
									} else {
										that_.userNum = false;
									}
									if (that_.marchantDetails.image.length == 0) {
										$('header').append('<img src="../../images/default_1125_633.png" />');
									};

									for (var i = 0; i < that_.marchantDetails.image.length; i++) {
										//  图片重新排序；
										if (that_.marchantDetails.image[i].image_type == 1) {
											// that_.image_arr[0] = that_.marchantDetails.image[i];
											that_.image_arr.push(that_.marchantDetails.image[i]);
										} else if (that_.marchantDetails.image[i].image_type == 8) {
											// that_.image_arr[1] = that_.marchantDetails.image[i];
											that_.image_arr.push(that_.marchantDetails.image[i]);
										} else if (that_.marchantDetails.image[i].image_type == 9) {
											// that_.image_arr[2] = that_.marchantDetails.image[i];
											that_.image_arr.push(that_.marchantDetails.image[i]);
										} else if (that_.marchantDetails.image[i].image_type == 12) {
											// that_.image_arr[3] = that_.marchantDetails.image[i];
											that_.image_arr.push(that_.marchantDetails.image[i]);
										} else if (that_.marchantDetails.image[i].image_type == 10) {
											// that_.image_arr[4] = that_.marchantDetails.image[i];
											that_.image_arr.push(that_.marchantDetails.image[i]);
										} else {}
									}

									console.log(that_.image_arr);
									//	-判断门店技师人数
									if (that_.marchantDetails.user.length == 5) {
										that_.userNum = true;
									} else {
										that_.userNum = false;
									}

									//	判断休息状态；
									if (that_.marchantDetails.working != '') {
										that_.timeStatus = '营业中';
										$('.detailStatus').addClass('icon_color');
									} else {
										that_.timeStatus = '休息中';
										$('.detailStatus').removeClass('icon_color');
									}
									//	判断评价星星数；
									var num = that_.marchantDetails.grade;
									for (var i = 0; i < num; i++) {
										that_.marchantGrade[i] = '../../images/icon5.png';
									}
									//	判断认证；
									switch (that_.marchantDetails.check_status) {
										case 0:
										case 1:
										case 2:
											that_.marchantStatus = '已认证';
											that_.s2 = true;
											break;
										case 3:
											that_.marchantStatus = '审核中';
											that_.s2 = true;
											break;
									}

									// 判断加盟；
									if (that_.marchantDetails.company_join_status && that_.marchantDetails.company_join_status == 1) {
										that_.marchantJoin = '加盟';
										that_.s3 = true;
									}
								}
							} else if (res.message == '用户Id不能为空!') {
								window.location.href = '../QuickRepair/QuickRepair.html';
							};
						},
						error: function error(res) {
							console.log(res);
						}
					});

					//-获取评价
					//-获取商户评价列表
					$.ajax({
						url: api.NWBDApiAssessList,
						data: {
							companyId: app.getItem("merchant_id"),
							ratingListStr: 12345,
							haveImage: '',
							haveContent: '',
							pageNum: 1,
							pageSize: 10
						},
						type: 'POST',
						dataType: 'json',
						success: function success(res) {
							console.log(res);
							if (res.code == 0) {
								that_.totalCount = res.data.totalCount;
								that_.list = res.data.list;
								if (that_.list) {
									if (that_.list.length > 2) {
										$('.seeMore').show();
										$('.userCommont').show();
									} else if (that_.list.length == 0) {
										$('.userCommont').hide();
									} else {
										$('.seeMore').hide();
										$('.userCommont').show();
									};
									that_.list.forEach(function (item) {
										item.createTime = getTime(item.createTime, 1);
										if (item.customerInfo == null) {
											item.customerInfo = '匿名';
										} else {
											item.customerInfo = item.customerInfo;
										};
									});
								};
							} else {
								app.alert(res.message);
							};
						},
						error: function error() {}
					});
				},

				//点击定位调用微信地图；
				wxPosition: function wxPosition() {
					var that_ = this;
					//调用微信 js-sdk 查看维修厂地图
					that_.openLocation();
				},
				openLocation: function openLocation() {
					var that_ = this;
					var lat = that_.marchantDetails.lat;
					var lng = that_.marchantDetails.lng;
					if (!lat || !lng) {
						geocoder.getLocation(that_.marchantDetails.address_detail, function (status, result) {
							if (status === 'complete' && result.info === 'OK' && result.geocodes[0].location) {
								lat = result.geocodes[0].location.lat;
								lng = result.geocodes[0].location.lng;
								wx.openLocation({
									latitude: parseFloat(lat),
									longitude: parseFloat(lng),
									name: that_.marchantDetails.name,
									address: that_.marchantDetails.address_detail,
									scale: 28,
									infoUrl: '',
									fail: function fail() {
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
							name: that_.marchantDetails.name,
							address: that_.marchantDetails.address_detail,
							scale: 28,
							infoUrl: '',
							fail: function fail() {
								alert("打开地图失败，请检查手机权限");
							}
						});
					}
				},

				//-可拨打电话
				telphoto: function telphoto(tellphone) {
					window.location.href = 'tel:' + tellphone;
				},

				//-产生订单
				peoductOrder: function peoductOrder() {
					//-检测是否登录
					app.removeItem('carInfo');
					app.verificationUserInfo();
					if (!app.getItem("merchant_id")) {
						window.location.href = "../QuickRepair/QuickRepair.html";
					} else {
						window.location.href = "../EditQuickRepair/editQuickMess.html";
					};
				},


				//-点击评价详情
				goUserRating: function goUserRating() {
					if (app.getItem("merchant_id")) {
						window.location.href = "../assess/userRating.html?company_id=" + app.getItem("merchant_id");
					};
				},
				//-查看技师
				seeUser: function seeUser() {
					if (app.getItem("merchant_id")) {
						window.location.href = "technichList.html?company_id=" + app.getItem("merchant_id");
					};
				}
			},
			mounted: function mounted() {
				var that = this;

				that.init();
			}
		});
	};
});