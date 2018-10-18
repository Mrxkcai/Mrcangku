$(function(){
	"use strict"
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
			success: function (result) {
				var res = JSON.parse(result)
				if (res.status === "success" && res.code === 0) {
					wx.config({
						debug: api.isDebug,
						appId: res.data.AppID,
						timestamp: res.data.timestamp,
						nonceStr: res.data.noncestr,
						signature: res.data.signature,
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
		                firstDom();
						
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
    };



    var firstDom = function (){
        var vm = new Vue({
            el:'#app',
            data:{
				label0:{
					name:'全部',
					count:0,
					active:true
				},
                labelArray:[
                    {
                        name:'非常满意',
                        count:0,
                        active:false
                    },
                    {
                        name:'满意',
                        count:0,
                        active:false
                    },
                    {
                        name:'一般',
                        count:0,
                        active:false
                    },
                    {
                        name:'不满意',
                        count:0,
                        active:false
                    },
                    {
                        name:'很不满意',
                        count:0,
                        active:false
                    },
                    {
                        name:'有内容',
                        count:0,
                        active:false
                    },
                    {
                        name:'有图片',
                        count:0,
                        active:false
                    }
				],
				ratingActive:false,
				param:{
					companyId:getUrlParam('company_id'),	//-维修厂id
					ratingListStr:'12345',		//-评论等级
					haveImage:'',		//-评价是否有图片标识 0：无图 1：有图
					haveContent:'',		//-评价是否有内容 0：无 1：有
					pageNum:'1',		//-
					pageSize:'10'
				},
				selectPoint:'-1',		//-选择条件标记	
				list: [],				//-评论列表
				loading: false,
				finished: false,
				totalCount:0		//-查询的评论的总条数
            },
            methods:{
                init:function(){
					var this_ = this;
					//-查询每种评价的数量
					$.ajax({
						url:api.NWBDApiAssessCountList,
						type:'GET',
						data:{
							companyId:getUrlParam('company_id')
						},
						dataType:'json',
						success:function(res){
							console.log(res)
							this_.label0.count = res.data.all;
							console.log(this_.label0.count)
							for(var i = 0;i < this_.labelArray.length;i ++){
								if(this_.labelArray[i].name == '全部'){
									this_.labelArray[i].count = res.data.all
								}else if(this_.labelArray[i].name == '非常满意'){
									this_.labelArray[i].count = res.data.rating5
								}else if(this_.labelArray[i].name == '满意'){
									this_.labelArray[i].count = res.data.rating4
								}else if(this_.labelArray[i].name == '一般'){
									this_.labelArray[i].count = res.data.rating3
								}else if(this_.labelArray[i].name == '不满意'){
									this_.labelArray[i].count = res.data.rating2
								}else if(this_.labelArray[i].name == '很不满意'){
									this_.labelArray[i].count = res.data.rating1
								}else if(this_.labelArray[i].name == '有内容'){
									this_.labelArray[i].count = res.data.haveContent
								}else if(this_.labelArray[i].name == '有图片'){
									this_.labelArray[i].count = res.data.haveImage
								};
							};



							//-判断有没有评价内容
							if(res.data.all== 0){
								this_.ratingActive = true;
							};
						},
						error:function(){

						}
					});


					this_.getList(this_.param);

				},
				//-获取评论列表
				getList:function(param){
					var this_ = this;
					//-获取商户评价列表
					$.ajax({
						url:api.NWBDApiAssessList,
						data:param,
						type:'POST',
						dataType:'json',
						success:function(res){
							console.log(res)
							if(res.code == 0){
								this_.totalCount = res.data.totalCount;
								this_.list = res.data.list;
								this_.param.pageNum = res.data.currentPage
								if(this_.list){
									this_.list.forEach(item => {
										item.createTime = getTime(item.createTime,1);
										if(item.customerInfo == null){
											item.customerInfo = '匿名'
										}else{
											item.customerInfo = item.customerInfo;
										};
										
									});
								};
								
							}else{
								app.alert(res.message)
							};
							
						},
						error:function(){

						},
					});
				},
                //-筛选
                labelSelect:function(index){
					this.labelArray[index].active = !this.labelArray[index].active;
					this.label0.active = false;
					var arr = [];
					var arr2 = [];
					this.labelArray.forEach(item => {
						if(item.active == false){
							arr.push(item)
						};

						if(item.active == true){
							arr2.push(item.name)
						};
					});
					
					
					//-如果一个都不选则显示全部的信息
					if(arr.length == this.labelArray.length){
						this.label0.active = true;
					};
					
					
					var ratingListStr = '';		//-	评价等级
					//-筛选评论
					
					if(arr2.length == 0){
						this.param.ratingListStr = 12345
					}else{

						for(var i = 0;i < arr2.length; i ++){
							if(arr2[i] == "非常满意"){
								// ratingListStr += 5
								arr2[i] = 5
							}else if(arr2[i] == "满意"){
								// ratingListStr += 4
								arr2[i] = 4
							}else if(arr2[i] == "一般"){
								// ratingListStr += 3
								arr2[i] = 3
							}else if(arr2[i] == "不满意"){
								// ratingListStr += 2
								arr2[i] = 2
							}else if(arr2[i] == "很不满意"){
								// ratingListStr += 1
								arr2[i] = 1
							}else if(arr2[i] == "有内容"){
								// ratingListStr += 1
								arr2[i] = 12345
							}else if(arr2[i] == "有图片"){
								// ratingListStr += 1
								arr2[i] = 12345
							}
							
						};
						//-驱虫
						var temp = []; //一个新的临时数组
						for(var i = 0; i < arr2.length; i++){
							if(temp.indexOf(arr2[i]) == -1){
								temp.push(arr2[i]);
							}
						};

						if(temp.length > 1){
							if(temp[temp.length - 1] == 12345){
								temp.splice(temp.length - 1,1)
							}

							for(var i = 0;i < temp.length; i ++){
								ratingListStr += temp[i]
							};
						}else{
							ratingListStr += temp[0]
						};

						this.param.ratingListStr = ratingListStr;
					}
					// console.log(temp)
					// console.log(ratingListStr)
					// console.log(this.param)
					// return
					

					this.getList(this.param);



				},
				//-全选
				allSele:function(){
					// this.selectPoint = 0;
				},
				//-加载
				onLoad() {
					// 异步更新数据
					var this_ = this;
					setTimeout(() => {
						//-获取商户评价列表
						
						// this_.param.pageNum = this_.param.pageNum + 1;
						// $.ajax({
						// 	url:api.NWBDApiAssessList,
						// 	data:this_.param,
						// 	type:'POST',
						// 	dataType:'json',
						// 	success:function(res){
						// 		console.log(res)
						// 		if(res.code == 0){
						// 			this_.totalCount = res.data.totalCount;
						// 			this_.list.push(res.data.list);
						// 			// this_.list = res.data.list;
						// 			if(this_.list){
						// 				this_.list.forEach(item => {
						// 					item.createTime = getTime(item.createTime,1);
						// 					if(item.customerInfo == null){
						// 						item.customerInfo = '匿名'
						// 					}else{
						// 						item.customerInfo = item.customerInfo;
						// 					};
											
						// 				});
						// 			};
									
						// 		}else{
						// 			app.alert(res.message)
						// 		};
								
						// 	},
						// 	error:function(){

						// 	},
						// });
						// for (var i = 0; i < 10; i++) {
						// 	this.list.push(this.list.length + 1);
						// }	
						// 加载状态结束
						this.loading = false;
				
						// 数据全部加载完成
						if (this.list.length >= this.label0.count) {
							this.finished = true;
						}
					}, 500);
				}
			},
			computed:{
				allSelect:function(){
					if(this.selectPoint == 0){
						this.labelArray.forEach(item => {
							item.active = true;
						});
					}
				}
			},
			watch:{
				allSelect:function(){}
			},
            mounted(){
				if(app.getItem("merchant_id")){
					this.init();
				};
                
            }
        });
    };


});