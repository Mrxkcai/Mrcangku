'use strict';

var vm = new Vue({
	el: '#app',
	data: {
		srcUrl: '',
		backImgShow: false
	},
	methods: {
		init: function init() {
			var that = this;
			var i = window.location.href.indexOf('?');
			var e = window.location.href.indexOf('&');
			var id = getUrlParam('customerId');
			//			alert(getUrlParam('customerId'))

			if (i > 0) {

				$.ajax({
					type: "post",
					url: api.NWBDApiWeiXincreateShareCode,
					data: {
						uniqueCode: id,
						source:'CUSTOMER'
						// openid: app.getItem("open_id")
					},
					success: function success(result) {
						console.log(result);
						if (result.code === 0) {
							that.srcUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + result.data.ticket;
							$('.imgCode').append('<img src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + result.data.ticket + '" />');
						}else{
							app.alert(result.message);
						}
					},
					error: function error() {
						alert('操作失败，请检查网络！');
					}
				});
			} else {}
		}
	},
	mounted: function mounted() {

		var that = this;
		//		app.verificationUserInfo();
		that.init();
	}
});