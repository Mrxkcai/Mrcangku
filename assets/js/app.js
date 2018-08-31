(function ($, app) {
        "use strict";
        FastClick.attach(window.document.body);
        Date.prototype.toLocaleString = function () {
            return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 " + this.getHours() + ":" + this.getMinutes() + ":" + (this.getSeconds() <= 9 ? "0" + this.getSeconds() : this.getSeconds());
        };

        app.options = {};

        app.setItem = function (key, val) {
            window.localStorage.setItem(key, JSON.stringify(val));
        };
        app.getItem = function (key) {
            if (!window.localStorage.getItem(key) || window.localStorage.getItem(key) === "undefined" || window.localStorage.getItem(key) === null || window.localStorage.getItem(key) === undefined) {
                return null;
            } else {
                return JSON.parse(window.localStorage.getItem(key));
            }
        };
        app.removeItem = function (key) {
            window.localStorage.removeItem(key);
        };

        app.alert = function (str) {
            layer.open({
                content: str,
                style: 'background:rgba(0,0,0,.4); color:#fff; border:none;font-size:0.28rem;',
                time: 1.5,
                skin: 'msg',
                type:1
            });
        };
        app.loading = function () {
            layer.open({
                type: 2,
                anim: "up",
                shadeClose: false,
                success: function () {

                }
            });
        };
        app.closeLoading = function () {
            layer.closeAll();
        };

        app.getQueryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        };

        app.f_close = function () {
            if (typeof(WeixinJSBridge) != "undefined") {
                WeixinJSBridge.call('closeWindow');
            } else {
                window.opener = null;
                window.open('', '_self', '');
                window.close();
            }
        };

        app.verificationUserInfo = function () {
            if (!app.getItem("userInfo") || !app.getItem("userInfo").id || !app.getItem("userInfo").mobile || !app.getItem("open_id")) {
                alert("您还没有登录！");
                sessionStorage.removeItem("g");
                if (api.isDebug) {
                    app.setItem("open_id", "oalBd0epVVUS-w1rswxpJsaj2Fqc");
                    window.location.href = api.getLocalhostPaht() + "/" + api.debugProjectName + "/index.html";
                } else {
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + api.appid + "&redirect_uri=" + api.selfHttp + api.callbackUrl + "/index.html&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect";
                }
            }
        };

        //初始化代码
        app.init = function (options) {
            // $(window.document.body).css({'min-height': $(document).height() + 'px'});
            options = options || {};
            return $.extend(app.options, options);
        };
        
        
    
		//	查询订单剩余时间
		app.checkTime = function () {
			var data = {
				userId:app.getItem('userInfo').id,		//	app.getItem('open_id')
				pageNum:1,
				pageSize:1,
                seconds:api.pzTime,
                openid: app.getItem("open_id")
            };
			var tt;
			$.ajax({
				url: api.NWBDApiWeiXinpushOrder,
				type: "POST",
				data:data,
				dataType: 'json',
				async:false,			//	同步的使用
				success:function(result){
					// console.log(result)
					if(result.status == 'success' && result.code == 0){
						
						if(result.data.length > 0){
							var countd = result.data[0].orderInfo.countdown;
							tt = api.pzTime - countd;
							localStorage.setItem('status',1);
						}else{
                            localStorage.removeItem('status');
                            return
						}
					}
				},
				error:function(){
					
				}
            });
            
			return tt;
		};
		
		//	时间戳转化
		app.getTime = function(createTime,a){
			var date = new Date(createTime)
			var Y, M, D, h, m, s
			Y = date.getFullYear() + '年'
			M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月'
			D = app.tranformTow(date.getDate())  + '日 '
			h = app.tranformTow(date.getHours()) + ':'
			m = app.tranformTow(date.getMinutes())
		    s = app.tranformTow(date.getSeconds())
		    
		    if(a == 1){
		        return Y + M + D
		    }else if(a == 2){
		        return Y + M + D + h + m 
		    }else if(a == 3){
		        return Y + M + D + h + m  + ':' + s
		    }else if(a == 4){
                return date.getFullYear() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.' + app.tranformTow(date.getDate())
            }
		};
		
		//	时间戳中个位数转化十位数
		app.tranformTow = function (number){
			return number < 10 ? '0'+number:number
		};
		
		app.layerAlert = function (str) {
	        layer.open({
	            content: str,
	            style: 'background:rgba(0,0,0,.7); color:#fff; border:none;font-size:0.28rem;',
	            time: 2,
	            skin: 'msg'
	        });
        };
        
        app.formatDuring = function(value) {
            //	返回分钟
            var secondTime = parseInt(value);// 秒
            var minuteTime = 0;// 分
            var hourTime = 0;// 小时
            if(secondTime > 59) {//如果秒数大于60，将秒数转换成整数
                //获取分钟，除以60取整数，得到整数分钟
                minuteTime = parseInt(secondTime / 60);
                //获取秒数，秒数取佘，得到整数秒数
                secondTime = parseInt(secondTime % 60);
                //如果分钟大于60，将分钟转换成小时
                if(minuteTime > 60) {
                    //获取小时，获取分钟除以60，得到整数小时
                    hourTime = parseInt(minuteTime / 60);
                    //获取小时后取佘的分，获取分钟除以60取佘的分
                    minuteTime = parseInt(minuteTime % 60);
                }
            }
            var result = "" + parseInt(secondTime);
            if(result<10){
                result = '0' + parseInt(secondTime);
            }
            
            if(minuteTime < 10) {
                minuteTime = "0" + parseInt(minuteTime);
            }
            
           var objtime = {
                min:minuteTime,
                sec:result
           }

            return  objtime;
     };



	}
)($, window.app = {});