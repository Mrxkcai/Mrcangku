var vm = new Vue({
	el:'#app',
	data:{
		value1:''
	},
	methods:{
		init(){
			var that = this;
			
		}
	},
	mounted(){
		var that = this;
		that.init();
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