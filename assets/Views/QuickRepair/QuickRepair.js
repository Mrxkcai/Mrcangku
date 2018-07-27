var quickRepair = function () {
    "use strict";

    var body = $('body');
    $(".container").css({'height': $(window).height() + 'px'});
    $(".repairer_list").css({'height': ($(window).height() - $("header").outerHeight(true)) + 'px'});
    
    //	检测是否有搜索记录
    if(sessionStorage.getItem("sv")){
    	$('.search_bar').val(sessionStorage.getItem("sv"))
    }

    var lng = 0;
    var lat = 0;
    var pageNum = 1;
    var pageSize = 10;
    var ijroll;
    var ijroll_y = 0;
    
    ijroll = new JRoll($(".repairer_list")[0]);
    ijroll.pulldown({
        refresh: function (complete) {
            if (ijroll.y >= 44) {
            	//	下拉刷新
                pageNum = 1;
                ijroll_y = 0;
                complete();
                
				//	判断是否为搜索
				positionGetMerchantList("update");
                
            }
        }
    });
    ijroll.scrollTo(0, ijroll_y);
    ijroll.on('touchEnd', function () {
        if (ijroll.maxScrollY >= ijroll.y + 5) {			//	+数字是为了区分屏幕的点击事件，因为点击事件会触发上拉事件，从而进行了页面加载，而非跳转
        		//	上拉加载
            ijroll_y = ijroll.maxScrollY;
            
			//	判断是否为搜索
			positionGetMerchantList("add");
            
        }
    });

    var createData = function (repairer_list_data, repairer_list_data_length) {
    	console.log(repairer_list_data)
    	
        var repairer_list_str = "";
        for (var i = 0; i < repairer_list_data_length; i++) {
            //列表图片
            var strIcon = "../.." + api.Merchant_default_Icon;
            for (var m = 0; m < repairer_list_data[i].image.length; m++) {
                if (repairer_list_data[i].image[m].image_type === 1) {
                    strIcon = repairer_list_data[i].image[m].image_url;
                    break;
                }else{
                	strIcon = repairer_list_data[i].image[0].image_url;
                    break;
                }
            }

            //评分
            var strGrade;
            switch (repairer_list_data[i].grade) {
                case "1":
                    strGrade = `<li></li><li></li><li></li><li></li><li></li>`;
                    break;
                case "2":
                    strGrade = `<li></li><li></li><li></li><li></li><li></li>`;
                    break;
                case "3":
                    strGrade = `<li></li><li></li><li></li><li></li><li></li>`;
                    break;
                case "4":
                    strGrade = `<li></li><li></li><li></li><li></li><li></li>`;
                    break;
                case "5":
                    strGrade = `<li></li><li></li><li></li><li></li><li></li>`;
                    break;
                default:
                    strGrade = `<li></li><li></li><li></li><li></li><li></li>`;
                    break;
            }

            //主修车型
            var mainBrandStr = "";
            if (repairer_list_data[i].mainBrand && repairer_list_data[i].mainBrand.length > 0) {
                for (var j = 0; j < repairer_list_data[i].mainBrand.length; j++) {
                    if (repairer_list_data[i].mainBrand[j].brand_name && j === repairer_list_data[i].mainBrand.length - 1) {
                        mainBrandStr += repairer_list_data[i].mainBrand[j].brand_name;
                    } else {
                        mainBrandStr += repairer_list_data[i].mainBrand[j].brand_name + '<span>｜</span>';
                    }
                }
            } else {
                mainBrandStr = '其他';
            }

            var checkStatus = "";
            if (repairer_list_data[i].road_qualification_type) {
//              checkStatus += '<div class="lei">' + repairer_list_data[i].road_qualification_type + '</div>';
            }
            

            //维修厂状态
            switch (repairer_list_data[i].check_status) {
                case 0:
                case 1:
                case 3:
                    checkStatus += '<div class="shehezhong">审核中</div>';
                    break;
                case 2:
                    checkStatus += '<div class="renzheng">已认证</div>';
                    break;
            }

			//	換位置
			//1已加盟，0未加盟
            if (repairer_list_data[i].company_join_status && repairer_list_data[i].company_join_status === 1) {
                checkStatus += '<div class="jiameng">加盟</div>';
            }
            
            repairer_list_str += `
            <li class="repairer_list_ul_li" data-id="${repairer_list_data[i].id}" data-working="${repairer_list_data[i].working}">
                <div class="repairer_info clearfix">
                    <div class="repairer_img">
                        <img src="${strIcon}"/>
                    </div>
                    <div class="repairer_info_text">
                        <h3 class="h3_name ellipsis">${repairer_list_data[i].name}</h3>
                        <div class="repairer_info_grade clearfix">
                            <ul class="clearfix">${strGrade}</ul>
                            <p class="p_grade">(${repairer_list_data[i].gradeCount}条评价)</p>
                        </div>
                        <div class="zxcx_span clearfix">
                            <span class="zhu">主</span>
                            <div class="zxcx_name clearfix ellipsis">${mainBrandStr}</div>
                        </div>
                        <ul class="wxnr_span clearfix">
                            <li>保养</li>
                            <li>美容</li>
                            <li>维修</li>
                        </ul>
                        <span class="address_detail clearfix ellipsis">${repairer_list_data[i].address_detail}</span>
                        <span class="juli">${repairer_list_data[i].juli && repairer_list_data[i].juli !== "null" && repairer_list_data[i].juli !== "未知" ? (repairer_list_data[i].juli / 1000).toFixed(1) + "km" : ""}</span>
                    </div>
                    <div class="kind_type">
                        ${checkStatus}
                    </div>
                    <div data-id="${repairer_list_data[i].id}" data-working="${repairer_list_data[i].working}" class="${repairer_list_data[i].working !== "" ? "reservation" : "notReservation"}"><span></span>${repairer_list_data[i].working !== "" ? "立即预约" : "休息中"}</div>
                </div>
            </li>`;
        }
        return repairer_list_str;
    };
    var positionGetMerchantList = function (datatype) {
    
    	var searchCont = $('.search_bar').val();
    	
        if (pageNum === -1) {
            return;
        }
        if (!lng || !lat) {
            alert('未打开定位功能，无法正常获取汽修厂！');
            return;
        }
        
        app.loading();
        app.verificationUserInfo();
        //	修改搜索下拉查值
    	if(!searchCont){
    		//	下拉时没值则请求所有数据
    		sessionStorage.setItem("sv",$('.search_bar').val())
    		$.ajax({
	            url: api.NWBDApiPositionGetMerchantList + "?r=" + Math.random(),
	            type: "POST",
	            data: {
	                open_id: app.getItem("userInfo").id,
	                lng: lng,
	                lat: lat,
	                pageNum: pageNum,
	                pageSize: pageSize
	            },
	            dataType: 'json',
	            success: function (result) {
	                 console.log(JSON.stringify(result));
	                if (result.status === "success" && result.code === 0) {
	                    var repairer_list_data = result.data;
	                    var repairer_list_data_length = repairer_list_data.length;
	                    if (repairer_list_data_length > 0) {
	                        var repairer_list_str = createData(repairer_list_data, repairer_list_data_length);
	                        if (datatype === "add") {
	                            $(".repairer_list_ul").append(repairer_list_str);
	                        } else if (datatype === "update") {
	                            $(".repairer_list_ul").html(repairer_list_str);
	                        }
	                        if (repairer_list_data_length >= pageSize) {
	                            pageNum++;
	                        } else {
	                            pageNum = -1;
	                        }
	                        ijroll.refresh();
	                    }
	                    else{
	                    	app.alert(result.message);
	                    }
	                    app.closeLoading();
	                } else {
	                    app.closeLoading();
	                    app.alert(result.message);
	                }
	            },
	            error: function () {
	                app.closeLoading();
	                app.alert('操作失败，请检查网络！');
	            }
	        });
    	}else{
    		//	否则请求查询数据
    		$(".icon_search").click();
    	}
    	
        
    };
    var positioning = function (func, val) {
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                lat = res.latitude;
                lng = res.longitude;
                AMap.service('AMap.Geocoder', function () {
                    var geocoder;
                    geocoder = new AMap.Geocoder({city: "010"});
                    geocoder.getAddress([lng, lat], function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                          	$('.position_text span').animate({width:5+"rem"},500)
                            $('.position_text span').text("当前位置：" + result.regeocode.formattedAddress)
                      

							//	2m后缩回
							setTimeout(function(){
								$('.position_text span').animate({width:0},500)
							},2000)
                            func(val);
                        } else {
                            app.alert("获取定位失败，请打开定位功能");
                        }
                    });
                });
            },
            fail() {
                alert("获取定位失败，请打开定位功能");
            }
        });
    };

    app.verificationUserInfo();
    $.ajax({
        url: api.NWBDApiCarIsExist + "?r=" + Math.random(),
        type: "POST",
        data: {
            customerId: app.getItem("userInfo").id
        },
        dataType: 'json',
        success: function (result) {
            if (result.status === "success" && result.code === 0) {
                if (result.data) {
                    $(".userInfo_prompt").hide();
                } else {
                    $(".userInfo_prompt").show();
                }
            } else {
                app.alert(result.message);
            }
        }, error: function () {
            app.alert('操作失败，请检查网络！');
        }
    });
    body.on("click", ".userInfo_prompt", function () {
        if (api.isDebug) {
            window.location.href = api.getLocalhostPaht() + "/" + api.debugProjectName + "/index.html";
        } else {
            window.location.href = "https://" + api.callbackUrl + "/index.html";
        }
    });

    // lat = 34.160183;
    // lng = 108.97301;
    // positionGetMerchantList("add");
    positioning(positionGetMerchantList, "add");

    // var city = ["西安市", "咸阳市", "渭南市", "榆林市", "酒泉市", "银川市", "兴义市", "清镇市"];
    // var district = ["123", "234", "345", "456", "567", "678", "789", "809"];
    // var showCity = function () {
    //     var str = "";
    //     for (var i = 0; i < city.length; i++) {
    //         str += "<li class='city_li' data-cityid='" + city[i].id + "'>" + city[i] + "</li>";
    //     }
    //     $(".cityDistrict ul").html(str);
    //     new JRoll($(".cityDistrict")[0]);
    // };
    // var showDistrict = function () {
    //     var str = "";
    //     for (var i = 0; i < district.length; i++) {
    //         str += "<li class='district_li' data-districtid='" + district[i].id + "'>" + district[i] + "</li>";
    //     }
    //     $(".cityDistrict ul").html(str);
    //     new JRoll($(".cityDistrict")[0]);
    // };
    // body.on("click", ".area", function () {
    //     if ($(".cityDistrict")) {
    //         app.closeLoading();
    //     }
    //     layer.open({
    //         type: 1,
    //         content: `<div class="cityDistrict"><ul></ul></div>`,
    //         anim: 'up',
    //         shade: false,
    //         style: 'position:fixed; bottom:0; left:0; width: 100%; height: auto; margin:0; padding:0; border:none;'
    //     });
    //     showCity();
    // });
    // body.on("click", ".city_li", function () {
    //     showDistrict();
    // });
    // body.on("click", ".district_li", function () {
    //
    //     app.closeLoading();
    // });
    // body.on("click", ".sorting_select,.kind_select,.repairer_list,.search_bar,.icon_search", function () {
    //     app.closeLoading();
    // });
    // body.on("change", ".sorting_select", function () {
    //     $(".sorting").text($(this).children("option:selected").text() + "▼");
    // });
    // body.on("change", ".kind_select", function () {
    //     $(".kind").text($(this).children("option:selected").text() + "▼");
    // });

    body.on("click", ".positioning", function () {
        document.getElementsByClassName("positioning")[0].style.animation = "";
		$('.position_text').show();
		$('.position_text span').animate({width:'5rem'},500)
		//	2m后缩回
		setTimeout(function(){
			$('.position_text span').animate({width:0},500)
		},2000)
    });
    
    //animationend
    document.getElementsByClassName("positioning")[0].addEventListener("click", function () {
        document.getElementsByClassName("positioning")[0].style.animation = null;
        app.alert("开始定位");
        positioning(function () {
        });
    });

    //搜索的时候获取维修厂列表
    body.on("click", ".icon_search", function () {
        var search_bar = $.trim($(".search_bar").val());
        sessionStorage.setItem("sv",$('.search_bar').val());
        if (!lng || !lat) {
            alert('未打开定位功能，无法正常获取汽修厂！');
            return;
        }
        app.loading();
        $.ajax({
            url: api.NWBDApiSearchMerchantList + "?keyValue=" + search_bar + "&lng=" + lng + "&lat=" + lat + "&r=" + Math.random(),
            type: "POST",
            dataType: 'json',
            success: function (result) {
                   console.log(JSON.stringify(result));
                if (result.status === "success" && result.code === 0) {
                    var repairer_list_data = result.data;
                    var repairer_list_data_length = repairer_list_data.length;
                    if (repairer_list_data_length > 0) {
                        var repairer_list_str = createData(repairer_list_data, repairer_list_data_length);
                        $(".repairer_list_ul").html(repairer_list_str);
                    } else {
                        $(".repairer_list_ul").html("<li class='text'>"+result.message+"</li>");
                        
                    }
                    
                    //	实例化滚动盒子
                    ijroll.refresh();
                    app.closeLoading();
                } else {
                    app.closeLoading();
                    app.alert(result.message);
                }
            }, error: function () {
                app.closeLoading();
                app.alert('操作失败，请检查网络！');
            }
        });
    });
    document.getElementById('search_from').onsubmit = function (e) {
        document.activeElement.blur();
        $(".icon_search").click();
        e.preventDefault();
    };

    body.on("input", ".search_bar", function () {
        if ($(".search_bar").val().length > 0) {
            $(".delete_search").show();
        } else {
            $(".delete_search").hide();
        }
    });
    body.on("click", ".delete_search", function () {
        $(".search_bar").val("");
        $(".delete_search").hide();
    });

    //查看维修厂详情
    body.on("click", ".reservation,.notReservation,.repairer_list_ul_li", function () {
        // if ($(this).attr("data-working") !== "1") {
        //     app.alert("该汽修厂休息中");
        //     return;
        // }
        app.setItem("merchant_id", $(this).attr("data-id"));
        sessionStorage.setItem("sv",$('.search_bar').val())
        window.location.href = "../QuickRepairDetails/QuickRepairDetails.html";
    });
};