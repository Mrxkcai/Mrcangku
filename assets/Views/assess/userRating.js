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
                labelArray:[
                    {
                        name:'全部',
                        count:11,
                        active:true
                    },
                    {
                        name:'非常满意',
                        count:12,
                        active:false
                    },
                    {
                        name:'满意',
                        count:13,
                        active:false
                    },
                    {
                        name:'一般',
                        count:14,
                        active:false
                    },
                    {
                        name:'不满意',
                        count:15,
                        active:false
                    },
                    {
                        name:'很不满意',
                        count:16,
                        active:false
                    },
                    {
                        name:'有内容',
                        count:17,
                        active:false
                    },
                    {
                        name:'有图片',
                        count:18,
                        active:false
                    }
                ]
            },
            methods:{
                init:function(){
                    
                },
                //-筛选
                labelSelect:function(index){
                    this.labelArray[index].active = !this.labelArray[index].active;
                }
            },
            mounted(){
                this.init();
            }
        });
    };


});