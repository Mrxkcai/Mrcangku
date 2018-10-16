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
					companyId:app.getItem("merchant_id"),	//-维修厂id
					ratingListStr:'',		//-评论等级
					haveImage:'',		//-评价是否有图片标识 0：无图 1：有图
					haveContent:'',		//-评价是否有内容 0：无 1：有
					pageNum:'',		//-
					pageSize:''
				},
				selectPoint:'-1'		//-选择条件标记	
            },
            methods:{
                init:function(){
					var this_ = this;
					//-查询每种评价的数量
					$.ajax({
						url:api.NWBDApiAssessCountList,
						type:'GET',
						data:{
							companyId:app.getItem("merchant_id")
						},
						dataType:'json',
						success:function(res){
							console.log(res)
							this_.label0.count = res.data.all;
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


					//-获取商户评价列表

                },
                //-筛选
                labelSelect:function(index){
					this.labelArray[index].active = !this.labelArray[index].active;
					this.label0.active = false;
					var arr = [];
					this.labelArray.forEach(item => {
						if(item.active == false){
							arr.push(item)
						};
					});
					
					//-如果一个都不选则显示全部的信息
					if(arr.length == this.labelArray.length){
						this.label0.active = true;
					};
					
                    
				},
				//-全选
				allSele:function(){
					// this.selectPoint = 0;
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