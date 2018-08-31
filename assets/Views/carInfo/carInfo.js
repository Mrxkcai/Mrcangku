var vm = new Vue({
	el:'#app',
	data:{
		isBox:false,
		countBlock:{
			min:'00',
			sec:'00',
			numAll:'',
			orderId:localStorage.getItem('orderId')
		},
		countDown:''
	},
	methods:{
		//	转化时间并赋值
		formaFun(a){
			var obj = app.formatDuring(a);
				this.countBlock.min = obj.min;
				this.countBlock.sec = obj.sec;
		},
	 timer(m){
		   // 定时器
		   var tt = setInterval(function(){
			   m++;
			   this.countDown = m;
			
			   localStorage.setItem('num',m)
			   vm.formaFun(m)
			   if(this.countDown == api.pzTime){
				   // 	指定时间后定时器消失
				   vm.isBox = false;
				   clearInterval(tt);
				   vm.countDown = 0;
				   localStorage.removeItem('status');
				localStorage.removeItem('num');
				$('#app').removeClass('bottomP')
				var data = {
					order_id:vm.countBlock.orderId,
					userId:app.getItem('userInfo').id,	//	app.getItem('open_id') '9d8eb665-d810-411b-8ad1-77c341f40038'	
					openid: app.getItem("open_id")
				}
				$.ajax({
					type:"POST",
					url:api.NWBDApiWeiXincancelOrder,
					data:data,
					dataType: 'json',
					success:function(result){
						console.log(result)
						if(result.code == 0){
							app.alert(result.data)
							localStorage.removeItem('status');
							localStorage.removeItem('num');
						}
					},
					error:function(){
						alert('操作失败，请检查网络！');
						app.closeLoading();
					}
				});
			   }
		   },1000)
	}
	},
	mounted(){
		var that = this;
		// that.init();
		var number1 = app.checkTime()	
		if(number1 != ''){
			this.timer(number1);
		}
		//	有未接订单的情况
		var status = localStorage["status"];
		if(status == 1){
			this.isBox = true;
			$('#app').addClass('bottomP')
			this.$refs.countblock.childs();
		}else{
			this.isBox = false;
			$('#app').removeClass('bottomP')
		}
	}
})