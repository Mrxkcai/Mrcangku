//	初始化；
$(function () {
    
    //  -fastclick 用法
    FastClick.attach(document.body);

	app.loading();
	if (api.isDebug) {
        //-调用页面逻辑方法
		ProgressMess();
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
		                ProgressMess();
						
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
    var ProgressMess = function (){
        // -页面逻辑加载
        var vm = new Vue({
            el:"#app",
            data:{
                src:'',  //-维修厂logo
                lineArr:[
                    {
                        add:'待交接',
                        time:'2018-1-7'
                    },
                    {
                        add:'维修中',
                        time:'2018-1-8'
                    },
                    {
                        add:'待检验',
                        time:'2018-1-8'
                    },
                    {
                        add:'待结算',
                        time:'2018-1-8'
                    },
                    {
                        add:'待付款',
                        time:'2018-1-8'
                    },
                    {
                        add:'待取车',
                        time:'2018-1-8'
                    },
                    {
                        add:'维修完成',
                        time:'2018-1-8'
                    }
                ],
                show1:true,     //-维修进度
                show2:false,    //-车辆维修记录

            },
            methods:{
                init(){
                    var that = this;
                    //-初始化页面高度
                    $("body").css({'min-height': $(window).height() + 'px'});
                    //-计算左侧圆点的距离
                    for(var n = 0;n < that.lineArr.length;n ++){
                        $('.lineS').css({'height':0.96*n + "rem"})
                        $('.lineS span').eq(n).css({'top':0.955*n + "rem"});
                    }; 

                    //-最后一个已完成
                    //$('.lineS span:last-child').addClass('goneAc');

                    if(app.getItem('orderNo')){
                        $.ajax({
                            url:api.NWBDApiSitengS,
                            type:'post',
                            data:{
                                orderNo:app.getItem('orderNo')
                            },
                            dataType:'json',
                            success:function(res){
                                console.log(res)
                            },
                            error(){
                                app.alert('网络故障，请稍后重试')
                            }
                        });
                    };
                               
                },
                //-tab切换
                navT(n){
                    var that = this;
                    if(n == 0){
                        that.show1 = true;
                        that.show2 = false;
                        $('header>div:nth-child(1)>span').addClass('borderL');
                        $('header>div:nth-child(2)>span').removeClass('borderL');
                    }else if(n == 1){
                        that.show1 = false;
                        that.show2 = true;
                        $('header>div:nth-child(1)>span').removeClass('borderL');
                        $('header>div:nth-child(2)>span').addClass('borderL');
                    };

                    
                },
                //-可拨打电话
                telphone(tellphone){
                    window.location.href = 'tel:' + tellphone
                },
            },
            mounted(){
                var that = this;
                that.init();
            }
        })
    }
});