Vue.component("adve-block",{
    props:{
        arr:{
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
        init:function(){
            var cont = $("#barrage");
			var contW = $("#barrage").width();
			var contH = $("#barrage").height();
			var startX, startY, sX, sY, moveX, moveY;
			var winW = $(window).width();
			var winH = $(window).height();
			var barrage_name = $("#barrage_name");
			var barrage_frame = $("#barrage_frame");
            var body = $("body");
            var windowUrl = window.location.href;
            $('.icon_none').show();
            //	首次进来直接展示公告
            var index_;
			if(!sessionStorage.getItem("g") && localStorage.getItem("userInfo") && windowUrl.indexOf('QuickRepair') >= 0){
				console.log(windowUrl.indexOf('QuickRepair'))
				index_ = layer.open({
					title:'',
					style:'padding: 0!important;background: none!important;box-shadow:none;',
					content:`<div class='img_box' style="display:none;opacity:1;">
								<img src='../../images/img_gonggao.png?v=2.0.1' style="min-width:2rem;min-height:3rem;width: 93%;margin-top: -1rem"/>
                                <div class="line_shu"></div>
                                <img src='../../images/icon_close.png' class="close_img" />
							</div>
							`
                })
                $('.layui-m-layercont').addClass('new');
                $('.img_box').show();
                sessionStorage.setItem("g",1);
                //  关闭叉号
                $('.close_img').on('click',function(){
                    $('.layui-m-layer').hide();
                    couponIndex();
                    $('.layui-m-layercont').removeClass('new');
                    //  出发蒙版的点击事件
                    $('.layui-m-layershade').trigger('click');
                    
                })
				
			} else if(!sessionStorage.getItem("k") && localStorage.getItem("userInfo") && windowUrl.indexOf('index') >= 0){
                sessionStorage.setItem("k",1);
                //console.log(windowUrl.indexOf('index'))
                couponIndex();
			    //alert(0)
            } else{
                console.log(windowUrl.indexOf('index'))
                layer.close(index_);
			}

            cont.on({ //绑定事件
				touchstart: function(e) {
					startX = e.originalEvent.targetTouches[0].clientX; //获取点击点的X坐标    
					startY = e.originalEvent.targetTouches[0].clientY; //获取点击点的Y坐标
					//console.log("startX="+startX+"************startY="+startY);
					sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
					sY = e.originalEvent.targetTouches[0].clientY; //相对于当前窗口Y轴的偏移量
					//console.log("sX="+sX+"***************sY="+sY);
					leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
					rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
					topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
					bottomY = winH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置                
				},
				touchmove: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
					moveX = e.originalEvent.targetTouches[0].clientX; //移动过程中X轴的坐标
					moveY = e.originalEvent.targetTouches[0].clientY; //移动过程中Y轴的坐标
					//console.log("moveX="+moveX+"************moveY="+moveY);
					if(moveX < leftX) {
						moveX = leftX;
					}
					if(moveX > rightX) {
						moveX = rightX;
					}
					if(moveY < topY) {
						moveY = topY;
					}
					if(moveY > bottomY) {
						moveY = bottomY;
					}
					$(this).css({
						"left": moveX + sX - startX + 10,
						"top": moveY + sY - startY,
                        "height":".96rem"
					})
                },
                touchend:function(e){
                    // e.preventDefault();
                    e.stopPropagation();
                },
                click:function(){
                    layer.open({
                        title:'',
                        style:'padding: 0!important;background: none!important;box-shadow:none;',
                        content:`<div class='img_box'>
                                    <img src='../../images/img_gonggao.png?v=2.0.1'/>
                                    <div class="line_shu"></div>
                                    <img src='../../images/icon_close.png' class="close_img" />
                                </div>
                                `
                    });

                    $('.layui-m-layercont').addClass('new');
                    //  关闭叉号
                    $('.close_img').on('click',function(){
                        $('.layui-m-layer').hide();
                        $('.layui-m-layercont').removeClass('new');
                        //  出发蒙版的点击事件
                        $('.layui-m-layershade').trigger('click');
                        
                    })
                }
                

            })

            //  html加载完成执行
            $(document).ready(function(){
                $('.barrage_name').show();
            })

        }
    },
    template:
    `
    <div class="barrage" id="barrage">
        <div class="barrage_name" id="barrage_name" style="display:none;">
            
                <img src="../../images/icon_huodong.gif?v=2.0.0" class="icon_none" style="display:none;opacity:1;" />
            
        </div>
    </div>
    `
});
function couponIndex() {
    $.ajax({
        type:'GET',
        url:api.NWBDApiWeiXincouponIndex + '?v=' + Math.random(),
        data:{
            userId: app.getItem("userInfo").id
        },
        async:true,
        success:function(res){
            console.log(res)
            if(res.code == 0 && res.status === "success"){
                if(!res.data)return false;
                if(!res.data.totalAmount)return false;
                red_bag(res.data)
            }else{
                app.closeLoading();
                app.alert(res.message);
            };

        },
        error:function(res){
            app.closeLoading();
            app.alert(res.message);
        }
    });
}

//  新增优惠券方法
var red_bag = function(res){
    //console.log(res)
    var priceAll = 0;
    priceAll += Number(res.totalAmount);
    var kg = false;

    var index = layer.open({
        content:
            `<div class="d-voucher">
                    <p class="get-voucher" style="opacity:0;"><span>¥</span>${priceAll}</p>
                    <p style="font-size:1rem;color:rgba(249,250,169,1);padding-top:.1rem;">${priceAll} <span style="font-size:.7rem;color:rgba(255,218,116,1);">元</span></p>
                    <p>有效期：<br /> ${res.beginDate}-${res.endDate}</p>
                    <p>* 代金券已帮您保存至“个人中心-优惠券”列表中，可前往查看。</p>
                    <p><img src="../../../images/img_zhu.png"/> 部分4S店及修理厂不支持线上支付，请 您加微信号“bbcfkf01”领取现金红包。</p>

                    <button class="btn-get"></button>
                    <div class="btn_see">查看详情 >></div>
                </div>
                `,
        style:"padding:none!important;background:none;box-shadow:none;width:6.94rem",
        shadeClose: false,
    });

    $('.layui-m-layercont').addClass('new');
    $('.layui-m-layercont').addClass('layui-m-layercont_self'); //  调整layer样式；

    //  查看详情按钮；
    $('.btn_see').on('click',function(){
        window.location.href = '../../Views/Voucher/voucher.html'
    });


    $('.btn-get').on('click',function(){
        $('.layui-m-layercont').removeClass('new');
        $('.layui-m-layercont').removeClass('layui-m-layercont_self');

        $.ajax({
            type:'GET',
            url:api.NWBDApiWeiXincouponGet + '?v=' + Math.random(),
            data:{
                userId: app.getItem("userInfo").id
            },
            async:true,
            success:function(res){
                console.log(res)
                if(res.code == 0 && res.status === "success"){
                    layer.close(index);
                    window.location.href = '../../Views/Voucher/voucher.html'
                }else{
                    app.closeLoading();
                    app.alert(res.message);
                };

            },
            error:function(res){
                app.closeLoading();
                app.alert(res.message);
            }
        });
    });

    return  kg;    //     测试阻止--------------------
};
