Vue.component('count-block',{
	props:{
		countblock:{
			type:Object,
            default: {}
		}
	},
	data(){
		return{
			
		}
	},
	computed:{
		
	},
	methods:{
		goOrder(){
			var urll = window.location.href;
			//alert(urll)
			if(urll.indexOf('index') == -1){
				window.location.href = "../YuyueRepair/reservationRepair.html";
			}else{
				window.location.href = "Views/YuyueRepair/reservationRepair.html";
			}
			
		},
		
		childs(){
			var that = this;
			var data = {
					user_id:app.getItem('userInfo').id,		//	app.getItem('open_id')
					pageNum:1,
					pageSize:1,
					seconds:api.pzTime
				};
				
				$.ajax({
					url: api.NWBDApiWeiXinpushOrder,			//	因为检查订单状态没有返回剩余时间，所以再次请求此接口
					type: "POST",
					data:data,
					dataType: 'json',
					success:function(result){
						console.log(result)
						if(result.status == 'success' && result.code == 0){
							if(result.data.length > 0){
								localStorage.setItem('status',1)
								var countdown = result.data[0].orderInfo.countdown;
								console.log(api.pzTime - countdown+"计时器")
								localStorage.setItem('num',api.pzTime - countdown)
								localStorage.setItem('orderId',result.data[0].orderInfo.id)
								//存储订单中维修厂信息
								localStorage.setItem('merchant',JSON.stringify(result.data[0]));

								
								//	查询订单状态
								var data = {
									order_id:result.data[0].orderInfo.id,
									user_id:app.getItem('userInfo').id		//	app.getItem('open_id')
								}
						   		if(data.order_id){
							   		var status = setInterval(function(){
							   			 console.log('调用成功')
							   			if(data.order_id != '' && data.user_id != ''){
							   				$.ajax({
								   				type:"POST",
								   				url:api.NWBDApiWeiXincheckOrderStatus,
								   				data:data,
												dataType: 'json',
												success:function(result){
													 console.log(result)
													if(result.code == 0){
														if(result.data == 1){
															app.alert('商家已接单')
															localStorage.removeItem('status');
															localStorage.removeItem('num');
															clearInterval(status)
															$('.countDown_box').hide();
															$('.consumer_hotline ').removeClass('bottomP');
															//	定位出现
															$('.dwopa').show();	
															//	接单后提示进入地图导航
															that.openLocation();
															
														}else if(result.data == 0){
															//	未接单存1
															localStorage.setItem('status',1)
														}else if(result.data == 2){
															app.alert('订单完成')
															clearInterval(status)
															localStorage.removeItem('status');
															localStorage.removeItem('num');
															$('.countDown_box').hide();
															$('.consumer_hotline ').removeClass('bottomP');
															//	定位出现
															$('.dwopa').show();
														}else if(result.data == 3){
															app.alert('订单已取消')
															clearInterval(status)
															localStorage.removeItem('status');
															localStorage.removeItem('num');
															$('.countDown_box').hide();
															$('.consumer_hotline ').removeClass('bottomP');
															//	定位出现
															$('.dwopa').show();
														}else if(result.data == 4){
															app.alert('您选择的企业未接单，请重新下单')
															clearInterval(status)
															localStorage.removeItem('status');
															localStorage.removeItem('num');
															$('.countDown_box').hide();
															$('.consumer_hotline ').removeClass('bottomP');
															//	定位出现
															$('.dwopa').show();
														}else if(result.data == 5){
															app.alert('维修完成')
															clearInterval(status)
															localStorage.removeItem('status');
															localStorage.removeItem('num');
															$('.countDown_box').hide();
															$('.consumer_hotline ').removeClass('bottomP');
															//	定位出现
															$('.dwopa').show();
														}else{
															
														}
														//	待确认跳转
						//									window.location.href="../QuickRepair/QuickRepair.html"
													}else{
														clearInterval(status)
														localStorage.removeItem('status');
														localStorage.removeItem('num');
														$('.countDown_box').hide();
														$('.consumer_hotline ').removeClass('bottomP');
														//	定位出现
														$('.dwopa').show();
													}
												},
												error:function(){
													alert('操作失败，请检查网络！');
									                clearInterval(status)
												}
								   			});
							   			}
							   			
							   		},2000)
							   	}
							}else{
								$('.consumer_hotline ').removeClass('bottomP')
								localStorage.removeItem('status');
								localStorage.removeItem('num');
								//	定位出现
								$('.dwopa').show();
							}
							
						}
					},
					error: function () {
//		                alert('操作失败，请检查网络！');
		          }
					
				});
				
		},
		//	进入地图导航界面
		openLocation(){
			var list = localStorage.getItem('merchant');
			console.log(list)
			return
			var layer_index = layer.open({
				content: '您的订单已被接单，是否进入导航'
				,btn: ['确定', '取消']
				,yes: function(index, layero){
					var merchantData = {
						lat:list[0].companylat,
						lng:list[0].companylng,
						name:list[0].companyName,
						address_detail:list[0].companyAddress
					}
					var lat = merchantData.lat;
					var lng = merchantData.lng;
					if (!lat || !lng) {
						geocoder.getLocation(merchantData.address_detail, function (status, result) {
							if (status === 'complete' && result.info === 'OK' && result.geocodes[0].location) {
								lat = result.geocodes[0].location.lat;
								lng = result.geocodes[0].location.lng;
								wx.openLocation({
									latitude: parseFloat(lat),
									longitude: parseFloat(lng),
									name: merchantData.name,
									address: merchantData.address_detail,
									scale: 28,
									infoUrl: '',
									fail() {
										alert("打开地图失败，请检查手机权限");
									}
								});
							} else {
								app.alert("该维修厂无法查看地图！");
								return;
							}
						});
					} else {
						wx.openLocation({
							latitude: parseFloat(lat),
							longitude: parseFloat(lng),
							name: merchantData.name,
							address: merchantData.address_detail,
							scale: 28,
							infoUrl: '',
							fail() {
								alert("打开地图失败，请检查手机权限");
							}
						});
					}
					layer.close(layer_index);
					//按钮【按钮一】的回调
				},
				end:function(){
					//	跳转车服门店
					setTimeout(function(){
						window.location.href="../QuickRepair/QuickRepair.html"
					},3000)
				},
				shadeClose:false
			})
		}
		
		
	},
	template:`
		<div class="countDown_box">
    		<div class="count_timer">
	    		<span class="count_number count_number1">正在接单中</span>
	    		<div class="count_number count_number2">
	    			<span>
	    				{{countblock.min}}
	    			</span>
	    			:
	    			<span>
	    				{{countblock.sec}}
	    			</span>
	    		</div>
	    	</div>
	    	
	    	<div class="count_btn" @click="goOrder()">
	    		查看
	    	</div>
	    	
	    	<p class="count_seconds">{{api.pzTime/60}}分钟内若商家未接单，系统将自动取消订单</p>
    </div>
	`
});
