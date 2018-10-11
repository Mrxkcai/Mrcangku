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
				value:3,
				rateWord:'一般',	//-评价
				labels:[
					{
						title:'服务态度差',
						isActive:false
					},
					{
						title:'技术能力差',
						isActive:false
					},
					{
						title:'店面环境差',
						isActive:false
					},
					{
						title:'其他',
						isActive:false
					}
					
				]
            },
            methods:{
                init:function(){
                    var that = this;
                    $('body').css({'min-height':$(window).height()});
				},
				chooseLabel:function(index){
					this.labels[index].isActive = !this.labels[index].isActive
				},
				//-上传图片
				onRead:function(file){
					console.log(file)
				}
			},
			computed:{
				countChange:function(){
					if(this.value == 1){
						this.rateWord = '很不满意'
					}else if(this.value == 2){
						this.rateWord = '不满意'
					}else if(this.value == 3){
						this.rateWord = '一般'
					}else if(this.value == 4){
						this.rateWord = '满意'
					}else if(this.value == 5){
						this.rateWord = '非常满意'
					}
				}
			},
			watch:{
				countChange:function(){
				}
			},
            mounted(){
                var that = this;
                that.init();
            }
        });
    };
});