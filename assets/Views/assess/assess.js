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
				// var res = JSON.parse(result)
				var res = result
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
					
				],
				uploadImgArr:[],	//-上传的图片
				uploadBool:true,		//-上传现实和隐藏
				checked:false,			//匿名
				labelLevel:true,			//-标签现实和隐藏
				company_id:getUrlParam('company_id'),			//-维修厂id
				orderId:getUrlParam('orderId'),				//-订单id
				customerId:getUrlParam('customerId'),			//-用户id
				url:api.NWBDApiAssessImgUrl,
				labeWord:[],				//-标签连起来
				imageUrl: ''
            },
            methods:{
                init:function(){
                    var that = this;
					$('body').css({'min-height':$(window).height()});
					
					if(that.company_id && that.orderId && that.customerId){
						
					};


				},
				chooseLabel:function(index){
					this.labels[index].isActive = !this.labels[index].isActive
				},
				//-上传图片
				onRead:function(file){
					// console.log(file)
					var this_ = this;
					$.ajax({
						url:api.NWBDApiAssessUpload,
						type:'post',
						dataType:'json',
						data:{
							fileType:"image",
							compress:'no',
							width:1,
							height:1,
							system:'repair',
							userId:this.customerId,
							business:1,
							image:file.content
						},
						success:function(res){
							// console.log(res)
							if(res.code == 0){
								if(this_.uploadImgArr.length < 3){
									this_.uploadBool = true;
									this_.uploadImgArr.push({'imageUrl':res.data.filePath})
								}else{
									this_.uploadImgArr.push({'imageUrl':res.data.filePath})
									this_.uploadBool = false;
								};

								console.log(this_.uploadImgArr)
								
							}else{
								app.alert(res.message)
							};
							
						},
						error:function(){

						}
					});
				},
				oversize:function(res){
					console.log(JSON.stringify(res))
					app.alert('请重新上传图片')
				},
				//-删除图片
				uploadClose:function(index){
					this.uploadImgArr.splice(index,1)
					if(this.uploadImgArr.length >= 4){
						this.uploadBool = false;
					}else{
						this.uploadBool = true;
					};
				},
				//-提交按钮
				uploadSubmit:function(){
					// console.log(this.checked)
					var number;
					if(this.checked == false){
						number = 0
					}else if(this.checked == true){
						number = 1
					};


					//-判断标签是否被选中
					var w = '';
					for(var i = 0;i < this.labels.length; i ++){
						if(this.labels[i].isActive == true){
							w += this.labels[i].title;
						}
					};


					var newArr = [];
					if(app.getItem('uploadImgArr')){
						
						var uploadArr = app.getItem('uploadImgArr');

						console.log(uploadArr)
						for(var i = 0;i < uploadArr.length;i ++){
							var signAgainReq=new Object();
								signAgainReq.imageUrl=uploadArr[i];
								newArr.push(signAgainReq);

						};
					};
					
					
					//-评价图片
					var data = {
						companyId:this.company_id,
						orderId:this.orderId,
						customerId:this.customerId,
						rating:this.value,
						commentContent:$('#textInput').val() + w,
						isVisible:number,
						imageJson:JSON.stringify(newArr)
					};
					

					console.log(JSON.stringify(newArr))
					if($('#textInput').val() == ''){
						app.alert('请填写评价内容')
						return false;
					}else if($('.uploadImg p span').text() == 0){
						app.alert('请添加评价图片')
						return false;
					}else{
						console.log(data)
						$.ajax({
							url:api.NWBDApiAssessCreate,
							dataType:'json',
							data:data,
							type:'POST',
							success:function(res){
								console.log(res)
								if(res.code == 0){
									app.removeItem('uploadImgArr');
									window.location.href = "assessSuccess.html?company_id=" + getUrlParam('company_id')
								}else{
									app.removeItem('uploadImgArr');
									app.alert(res.message)
								};
							},
							error:function(){
								app.alert('请检查网络')
							}
						});
					};

				},
				handleAvatarSuccess(res, file) {
					this.imageUrl = URL.createObjectURL(file.raw);
					console.log('after upload')
				},
				errorHandleUpload:function(){
					console.log("error upload")
				},
				beforeAvatarUpload(file) {
					const isJPG = file.type === 'image/*';
					const isLt2M = file.size / 1024 / 1024 < 2;
					console.log('before upload')
					// if (!isJPG) {
					// 	this.$message.error('上传头像图片只能是 JPG 格式!');
					// }
					if (!isLt2M) {
						this.$message.error('上传头像图片大小不能超过 2MB!');
					}
					return isJPG && isLt2M;
				}
			},
			computed:{
				countChange:function(){
					if(this.value == 1){
						this.rateWord = '很不满意'
						this.labelLevel = true
					}else if(this.value == 2){
						this.rateWord = '不满意'
						this.labelLevel = true
					}else if(this.value == 3){
						this.rateWord = '一般'
						this.labelLevel = true
					}else if(this.value == 4){
						this.rateWord = '满意'
						this.labelLevel = false
					}else if(this.value == 5){
						this.rateWord = '非常满意'
						this.labelLevel = false
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
				//-图片上传
				var $tgaUpload = $('#goodsUpload').diyUpload({
					url:api.NWBDApiAssessUpload,
					success:function( data ) { 
						console.log(data)
					},
					error:function( err ) { 
						console.log(err)
					},
					buttonText : '',
					accept: {
						title: "Images",
						extensions: 'gif,jpg,jpeg,bmp,png'
					},
					thumb:{
						width:120,
						height:90,
						quality:100,
						allowMagnify:true,
						crop:true,
						type:"image/jpeg"
					}
				});
            }
        });
    };
});