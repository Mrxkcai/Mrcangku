"use strict";

$(function () {
	"use strict";
	//-获取openid

	api.getopenid();

	if (api.isDebug) {
		//-调用页面逻辑方法
		firstDom();
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
				// var res = JSON.parse(result)
				var res = result;
				if (res.status === "success" && res.code === 0) {
					wx.config({
						debug: api.isDebug,
						appId: res.data.AppID,
						timestamp: res.data.timestamp,
						nonceStr: res.data.noncestr,
						signature: res.data.signature,
						jsApiList: ['openLocation', 'hideAllNonBaseMenuItem', 'hideOptionMenu', //	隐藏分享菜单
						'checkJsApi', //	
						'onMenuShareTimeline', //	分享到朋友圈
						'onMenuShareAppMessage' //	分享给朋友
						]
					});
					wx.ready(function () {
						//-调用页面逻辑方法
						firstDom();

						//新增分享
						wx.checkJsApi({
							jsApiList: ['chooseImage'], //	需要检测的JS接口列表
							success: function success(res) {
								// console.log(res)
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
	};

	var firstDom = function firstDom() {
		var vm = new Vue({
			el: '#app',
			data: {
				label0: {
					name: '全部',
					count: 0,
					active: true
				},
				labelArray: [
				// {
				//     name:'全部',
				//     count:0,
				//     active:true
				// },
				{
					name: '非常满意',
					count: 0,
					active: false
				}, {
					name: '满意',
					count: 0,
					active: false
				}, {
					name: '一般',
					count: 0,
					active: false
				}, {
					name: '不满意',
					count: 0,
					active: false
				}, {
					name: '很不满意',
					count: 0,
					active: false
				}, {
					name: '有内容',
					count: 0,
					active: false
				}, {
					name: '有图片',
					count: 0,
					active: false
				}],
				ratingActive: false,
				param: {
					companyId: getUrlParam('company_id'), //-维修厂id
					ratingListStr: '12345', //-评论等级
					haveImage: '', //-评价是否有图片标识 0：无图 1：有图
					haveContent: '', //-评价是否有内容 0：无 1：有
					pageNum: '1', //-
					pageSize: '10'
				},
				selectPoint: '-1', //-选择条件标记	
				list: [], //-评论列表
				loading: false,
				finished: false,
				totalCount: 0, //-查询的评论的总条数
				hasNextPage: true //-是否有下一页
			},
			methods: {
				init: function init() {
					var this_ = this;
					//-查询每种评价的数量
					$.ajax({
						url: api.NWBDApiAssessCountList,
						type: 'GET',
						data: {
							companyId: getUrlParam('company_id')
						},
						dataType: 'json',
						success: function success(res) {
							// console.log(res)
							this_.label0.count = res.data.all;
							for (var i = 0; i < this_.labelArray.length; i++) {
								if (this_.labelArray[i].name == '全部') {
									this_.labelArray[i].count = res.data.all;
								} else if (this_.labelArray[i].name == '非常满意') {
									this_.labelArray[i].count = res.data.rating5;
								} else if (this_.labelArray[i].name == '满意') {
									this_.labelArray[i].count = res.data.rating4;
								} else if (this_.labelArray[i].name == '一般') {
									this_.labelArray[i].count = res.data.rating3;
								} else if (this_.labelArray[i].name == '不满意') {
									this_.labelArray[i].count = res.data.rating2;
								} else if (this_.labelArray[i].name == '很不满意') {
									this_.labelArray[i].count = res.data.rating1;
								} else if (this_.labelArray[i].name == '有内容') {
									this_.labelArray[i].count = res.data.haveContent;
								} else if (this_.labelArray[i].name == '有图片') {
									this_.labelArray[i].count = res.data.haveImage;
								};
							};

							//-判断有没有评价内容
							if (res.data.all == 0) {
								//-	重复了
								// this_.ratingActive = true;
							};
						},
						error: function error() {}
					});

					this_.getList(this_.param);
				},
				//-获取评论列表
				getList: function getList(param) {
					var this_ = this;
					console.log(233);
					if (this_.hasNextPage == false) {
						return false;
					};
					//-获取商户评价列表
					$.ajax({
						url: api.NWBDApiAssessList,
						data: param,
						type: 'POST',
						dataType: 'json',
						async: false,
						success: function success(res) {
							console.log(res);
							if (res.code == 0) {
								this_.totalCount = res.data.totalCount;

								this_.param.pageNum = Number(res.data.currentPage) + 1;
								this_.hasNextPage = res.data.hasNextPage;
								if (res.data.list.length != 0) {
									res.data.list.forEach(function (item) {
										item.createTime = getTime(item.createTime, 1);
										if (item.customerInfo == null) {
											item.customerInfo = '匿名';
										} else {
											item.customerInfo = item.customerInfo;
										};
										this_.list.push(item);
									});
									$('.none').html('');
								} else {
									$('.none').html('<div class="data_none" style="padding:1rem .3rem;display:block;text-align:center;font-size:.3rem;color:#999;">暂无筛选结果~</div>');
								};
								console.log(this_.list);
							} else {
								app.alert(res.message);
							};
						},
						error: function error() {}
					});
				},
				//-筛选
				labelSelect: function labelSelect(index) {
					this.labelArray[index].active = !this.labelArray[index].active;
					this.label0.active = false;
					this.param.pageNum = 1; //-重置椰树
					this.param.haveContent = '';
					this.param.haveImage = '';
					this.hasNextPage = true;
					this.list = [];
					var arr = [];
					var arr2 = [];
					this.labelArray.forEach(function (item) {
						if (item.active == false) {
							arr.push(item);
						};

						if (item.active == true) {
							arr2.push(item.name);
						};
					});

					//-如果一个都不选则显示全部的信息
					if (arr.length == this.labelArray.length) {
						this.label0.active = true;
					};

					var ratingListStr = ''; //-	评价等级
					//-筛选评论

					if (arr2.length == 0) {
						this.param.ratingListStr = 12345;
					} else {

						for (var i = 0; i < arr2.length; i++) {
							if (arr2[i] == "非常满意") {
								// ratingListStr += 5
								arr2[i] = 5;
							} else if (arr2[i] == "满意") {
								// ratingListStr += 4
								arr2[i] = 4;
							} else if (arr2[i] == "一般") {
								// ratingListStr += 3
								arr2[i] = 3;
							} else if (arr2[i] == "不满意") {
								// ratingListStr += 2
								arr2[i] = 2;
							} else if (arr2[i] == "很不满意") {
								// ratingListStr += 1
								arr2[i] = 1;
							} else if (arr2[i] == "有内容") {
								// ratingListStr += 1
								this.param.haveContent = 1;
								arr2[i] = 12345;
							} else if (arr2[i] == "有图片") {
								// ratingListStr += 1
								this.param.haveImage = 1;
								arr2[i] = 12345;
							};
						};
						//-驱虫
						var temp = []; //一个新的临时数组
						for (var i = 0; i < arr2.length; i++) {
							if (temp.indexOf(arr2[i]) == -1) {
								temp.push(arr2[i]);
							}
						};

						if (temp.length > 1) {
							if (temp[temp.length - 1] == 12345) {
								temp.splice(temp.length - 1, 1);
							}

							for (var i = 0; i < temp.length; i++) {
								ratingListStr += temp[i];
							};
						} else {
							ratingListStr += temp[0];
						};

						this.param.ratingListStr = ratingListStr;
					};

					this.getList(this.param);
				},
				//-加载
				onLoad: function onLoad() {
					// 异步更新数据
					console.log(this.hasNextPage);
					console.log(this.param.pageNum);
					var this_ = this;
					if (this_.hasNextPage == false) {
						// 加载状态结束
						this_.loading = false;
						return false;
					};
					// return
					setTimeout(function () {
						//-获取商户评价列表

						// this_.param.pageNum = this_.param.pageNum + 1;
						$.ajax({
							url: api.NWBDApiAssessList,
							data: this_.param,
							type: 'POST',
							dataType: 'json',
							async: false,
							success: function success(res) {
								console.log(res);
								if (res.code == 0) {
									this_.totalCount = res.data.totalCount;
									this_.hasNextPage = res.data.hasNextPage;
									this_.label0.count = res.data.totalCount;
									if (res.data.list) {

										res.data.list.forEach(function (item) {
											item.createTime = getTime(item.createTime, 1);
											if (item.customerInfo == null) {
												item.customerInfo = '匿名';
											} else {
												item.customerInfo = item.customerInfo;
											};

											this_.list.push(item);
										});
										this_.param.pageNum = Number(this_.param.pageNum) + 1;
									};

									console.log(this_.list);
								} else {
									app.alert(res.message);
								};
							},
							error: function error() {}
						});
						// 加载状态结束
						this_.loading = false;

						// 数据全部加载完成
						if (this_.list.length >= this_.label0.count) {
							this_.finished = true;
						}
					}, 500);
				}
			},
			computed: {
				allSelect: function allSelect() {
					if (this.selectPoint == 0) {
						this.labelArray.forEach(function (item) {
							item.active = true;
						});
					}
				}
			},
			watch: {
				allSelect: function allSelect() {}
			},
			created: function created() {
				var self = this;
				$(window).scroll(function () {
					var scrollTop = $(this).scrollTop();
					var scrollHeight = $(document).height();
					var windowHeight = $(this).height();
					console.log(scrollTop + '--' + scrollHeight + '--' + windowHeight);
					if (scrollTop + windowHeight + 20 >= scrollHeight) {
						self.getList(self.param);
					};
				});
			},
			mounted: function mounted() {
				if (getUrlParam('company_id')) {
					this.init();
				};
			}
		});
	};
});
