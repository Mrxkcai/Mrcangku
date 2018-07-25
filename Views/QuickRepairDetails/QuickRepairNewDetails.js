var vm = new Vue({
	el:"#app",
	data:{
		carDetailsList:[
		"https://wxcs.nuoweibd.com/images/default_1125_633.png",
		"https://wxcs.nuoweibd.com/images/default_1125_633.png"
		],
		detailTime:"08:00-22:00",
		timeStatus:"休息中",
		shopName:"西安利玛汽车维修服务有限公司",
		commonNum:"298",
		showBtn:true,
		up:false
	},
	methods:{
		init(){
			var that = this;
			$('.slideRight').animate({right:"0"},400)
		},
		seeImg(index,length){
			var that = this;
			if(index === 0){
				$('.newDetail_block').addClass('moveActive');
				that.showBtn = false;
				var h = $('.newDetail_block').height(),
					h2 = $('.info_time').height();
				$('.newDetail_block').animate({top:4.2 * length -1.26 + "rem"},400);
				that.up = true;
			}
		},
		upImg(){
			var that = this;
			$('.newDetail_block').animate({top:"3.54rem"},400);
			that.up = false;
			that.showBtn = true;
		}
	},
	mounted(){
		var that = this;
		that.init();
	}
})
