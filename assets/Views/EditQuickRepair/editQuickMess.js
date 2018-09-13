//	初始化；
$(function () {
    
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

    //  -页面加载方法
    var editQuickMess = function (){
        // -页面逻辑加载
        var vm = new Vue({
            el:"#app",
            data:{

            },
            methods:{
                init(){
                    //  页面加载组织某些input输入
                    // $('#chooseAddress').prop('disabled',true);
                }
            },
            mounted(){
                var that = this;
                that.init();
            }
        })
    }
    

});