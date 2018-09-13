var quickRepair = function () {
    "use strict";

    var body = $('body');

    $(".container").css({'height': $(window).height() + 'px'});
    $(".repairer_list").css({'height': ($(window).height() - $("header").outerHeight(true)) + 'px'});
    
    //	检测是否有搜索记录
    if(sessionStorage.getItem("sv")){
    	$('.search_bar').val(sessionStorage.getItem("sv"))
    }

    
    //  检测是否含有openid
    api.getopenid();



    var companyTypeId=[],
        lng = 0,
        lat = 0,
        pageNum = 1,
        pageSize = 10,
        ijroll,
        ijroll_y = 0,
        isClick = true,
        totalPage ='',
        currentPage = '',
        pageNo =1,
        totalPage2 ='',
        currentPage2='',
        isSearch = false;

    ijroll = new JRoll($(".repairer_list")[0]);
    ijroll.pulldown({
        refresh: function (complete) {
            if (ijroll.y >= 44) {
            	//	下拉刷新
                pageNum = 1;
                pageNo =1;
                ijroll_y = 0;
                complete();
                
				//	判断是否为搜索
				positionGetMerchantList("refresh",provinces,citys,countries,companyTypeId);
                
            }
        }
    });
    ijroll.scrollTo(0, ijroll_y);
    ijroll.on('touchEnd', function () {
        if (ijroll.maxScrollY >= ijroll.y + 5) {			//	+数字是为了区分屏幕的点击事件，因为点击事件会触发上拉事件，从而进行了页面加载，而非跳转
        		//	上拉加载
            ijroll_y = ijroll.maxScrollY;
            
			//	判断是否为搜索
            if($('.search_bar').val()){
                if (pageNo === -1||totalPage2 <= currentPage2) return;
            }else {
                if (pageNum === -1||totalPage <= currentPage) return;
            }
            isClick = false;
			positionGetMerchantList("add",provinces,citys,countries,companyTypeId);
            
        }
    });
    
    var createData = function (repairer_list_data, repairer_list_data_length) {
    	console.log(repairer_list_data)
    	
        var repairer_list_str = "";
        for (var i = 0; i < repairer_list_data_length; i++) {
            
            //列表图片
            var strIcon;
            var image_arr = [];

            if(repairer_list_data[i].image.length > 0){
                for (var m = 0; m < repairer_list_data[i].image.length; m++) {
                    if (repairer_list_data[i].image[m].image_type == 1) {
                        strIcon = repairer_list_data[i].image[m].image_url;
                        break;
                    }else if(repairer_list_data[i].image[m].image_type != 1){
                        //-重新排序图片
                        
                        if(repairer_list_data[i].image[m].image_type == 8){
                            image_arr[0] = repairer_list_data[i].image[m].image_url;
                        }else if(repairer_list_data[i].image[m].image_type == 9){
                            image_arr[1] = repairer_list_data[i].image[m].image_url;
                        }else if(repairer_list_data[i].image[m].image_type == 12){
                            image_arr[2] = repairer_list_data[i].image[m].image_url;
                        }else if(repairer_list_data[i].image[m].image_type == 10){
                            image_arr[3] = repairer_list_data[i].image[m].image_url;
                        };
                        // repairer_list_data[i].image = image_arr;
                        // console.log(repairer_list_data[i].image)
                        strIcon = repairer_list_data[i].image[0].image_url;
                    }
                }
                
            }else{
                strIcon = "../.." + api.Merchant_default_Icon;
            };

            //维修店类型
            var repairType ='';
            if(repairer_list_data[i].repair_type == 0){
                repairType = '<div class="repair_type">维修厂</div>';
            }else if(repairer_list_data[i].repair_type == 1){
                repairType = '<div class="repair_type repair_type1">4S店</div>';
            }else if(repairer_list_data[i].repair_type == 2) {
                repairType = '<div class="repair_type repair_type2">快修店</div>';
            }else {
                repairType = '<div class="repair_type">维修厂</div>';
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
                mainBrandStr = '大众<span>｜</span>丰田<span>｜</span>比亚迪';
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
                    ${repairType}
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

    
    var positionGetMerchantList = function (datatype,province,city,country,companyTypeId) {
    
    	var searchCont = $('.search_bar').val();
        ijroll.enable();

        if (!lng || !lat) {
            alert('未打开定位功能，无法正常获取汽修厂！');
            return;
        }
        if(companyTypeId){
            var typeId = companyTypeId.join()
        }else {
            typeId = ''
        }
        // app.loading();
         app.verificationUserInfo();      //  判断登录去掉；
        //	修改搜索下拉查值
    	if(!searchCont){
    		//	下拉时没值则请求所有数据
    		sessionStorage.setItem("sv",$('.search_bar').val());
            isSearch = false;
    		$.ajax({
	            url: api.NWBDApiGetMerchantListByArea,
	            type: "POST",
	            data: {
                    province:province,
                    city:city,
                    country:country,
                    companyTypeId:typeId,
	                lng: lng,
	                lat: lat,
                    pageNo: pageNum,
                    pageSize: pageSize,
                    openid: app.getItem("open_id")
	            },
	            dataType: 'json',
	            success: function (result) {
	                //  console.log(JSON.stringify(result));
	                  console.log(result)
                    totalPage = result.data.totalPage;
                    currentPage = result.data.currentPage;
	                if (result.status === "success" && result.code === 0) {
	                    var repairer_list_data = result.data.list;
	                    var repairer_list_data_length = repairer_list_data.length;
	                    if (repairer_list_data_length > 0) {
	                        var repairer_list_str = createData(repairer_list_data, repairer_list_data_length);
	                        if (datatype === "add") {
	                            $(".repairer_list_ul").append(repairer_list_str);
	                        } else if (datatype === "update") {
                                ijroll.scrollTo(0,0,0);
                                $(".repairer_list_ul").html(repairer_list_str);
	                        }else {
                                $(".repairer_list_ul").html(repairer_list_str);
                            }
	                        if (repairer_list_data_length >= pageSize) {
	                            pageNum++;
	                        } else {
	                            pageNum = -1;
	                        }
	                        ijroll.refresh();
	                    } else{
                            ijroll.scrollTo(0,0,0);
                            ijroll.disable();
                            $(".repairer_list_ul").html("<li class='text'>"+result.message+"</li>");
	                    	app.alert(result.message);
	                    }
	                    // app.closeLoading();
                    } else {
                        pageNum = -1;
	                    // app.closeLoading();
                        ijroll.scrollTo(0,0,0);
                        ijroll.disable();
                        $(".repairer_list_ul").html("<li class='text'>没有匹配的商户列表</li>");
	                    app.alert('没有匹配的商户列表');
	                };
	                setTimeout(function () {
                        isClick = true;
                    },1000)
	            },
	            error: function () {
	                // app.closeLoading();
	                app.alert('网络故障，请检查网络！');
	            }
	        });
    	}else{
    		//	否则请求查询数据

            if (datatype === "add") {
                searchs();
            }else if(datatype === 'refresh'){
                searchs('up');
            }else {
               return false;
            }
    	}
    	
        
    };
    
    var positioning = function (func, val) {
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                //console.log(res);
                lat = res.latitude;
                lng = res.longitude;
                AMap.service('AMap.Geocoder', function () {
                    var geocoder;
                    geocoder = new AMap.Geocoder({city: "010"});
                    geocoder.getAddress([lng, lat], function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                          	$('.position_text span').animate({width:5.5+"rem"},500)
                            $('.position_text span').text("当前位置：" + result.regeocode.formattedAddress);
                            app.setItem('address',result.regeocode.formattedAddress);
                            var addressComponents = result.regeocode.addressComponent;
                            //console.log(addressComponents)
                            getPositioning(addressComponents.province,addressComponents.city);
                            app.setItem('province',addressComponents.province);
                            app.setItem('city',addressComponents.city);
                            app.setItem('district',addressComponents.district);
                            var locationObj = {
                                lat : res.latitude,
                                lng : res.longitude,
                            }
                            app.setItem('location',locationObj)
                           
                            //console.log(locationObj);
							//	2m后缩回
							setTimeout(function(){
								$('.position_text span').animate({width:0},500)
							},2000)
                            func(val);
                        } else {
                            app.alert("获取定位失败，请打开定位功能");
                            getPositioning('定位失败','定位失败')
                        }
                    });
                });
            },
            fail() {
                app.alert("获取定位失败，请打开定位功能");
                getPositioning('定位失败','定位失败')
            }
        });
    };

    
    var getPositioning = function(province,city){
        var positionText = $('.city-position-text')
        $('.area-text').html(city);
        positionText.html(city);
        if(city == '定位失败') return false;
        positionText.attr('data-province',province);

    };
    
    app.verificationUserInfo();      //  判断登录去掉；
    //  进入车服门店界面查询用户是否有车辆，若无则提示用户完善车辆信息；现在修改为用户可以无需登录查看维修厂列表；
    $.ajax({
        url: api.NWBDApiCarIsExist + "?r=" + Math.random(),
        type: "POST",
        data: {
            userId: app.getItem("userInfo").id,
            openid: app.getItem("open_id")
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
            app.alert('网络故障，请检查网络！');
        }
    });
    body.on("click", ".userInfo_prompt", function () {
        if (api.isDebug) {
            window.location.href = api.getLocalhostPaht() + "/" + api.debugProjectName + "/index.html";
        } else {
            window.location.href = api.selfHttp + api.callbackUrl + "/index.html";
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
        pageNo = 1;
        ijroll.scrollTo(0,0,0);
        var search_bar = $.trim($(".search_bar").val());
        sessionStorage.setItem("sv",$('.search_bar').val());
        if (!lng || !lat) {
            alert('未打开定位功能，无法正常获取汽修厂！');
            return;
        };
        if(!search_bar){
            positionGetMerchantList('update');
            return false;
        }
        ijroll.enable();
        searchs('up')
        // app.loading();

    });
    function searchs(searchType){
        if(searchType == 'up'){
            pageNo = 1;
        }
        $.ajax({
            url: api.NWBDApiSearchMerchantList + "?r=" + Math.random(),
            type: "POST",
            data:{
                keyValue:$.trim($(".search_bar").val()),
                lng:lng,
                lat:lat,
                pageSize:10,
                pageNo:pageNo,
                openid: app.getItem("open_id")
            },
            dataType: 'json',
            success: function (result) {
                //    console.log(JSON.stringify(result));
                totalPage2 = result.data.totalPage;
                currentPage2 = result.data.currentPage;
                if (result.status === "success" && result.code === 0) {
                    var repairer_list_data = result.data.list;
                    var repairer_list_data_length = repairer_list_data.length;
                    if(!isSearch){
                        $(".repairer_list_ul").html("");
                    };
                    isSearch = true;
                    if (repairer_list_data_length > 0) {
                        var repairer_list_str = createData(repairer_list_data, repairer_list_data_length);
                        if(searchType == 'up'){
                            $(".repairer_list_ul").html(repairer_list_str);
                        }else {
                            $(".repairer_list_ul").append(repairer_list_str);
                        }

                    } else {
                        $(".repairer_list_ul").html("<li class='text'>"+result.message+"</li>");

                    }
                    if (repairer_list_data_length >= pageSize) {
                        pageNo++;
                    } else {
                        pageNo = -1;
                    }
                    ijroll.refresh();

                    //	实例化滚动盒子
                    ijroll.refresh();
                    // app.closeLoading();
                } else {
                    // app.closeLoading();
                    ijroll.scrollTo(0,0,0);
                    ijroll.disable();
                    $(".repairer_list_ul").html("<li class='text'>"+result.message+"</li>");
                    app.alert(result.message);
                }
            }, error: function () {
                // app.closeLoading();
                app.alert('网络故障，请检查网络！');
            }
        });
    }
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
        if(isClick){
            app.setItem("merchant_id", $(this).attr("data-id"));
            app.setItem("send_position", $('.position_text span').text());
            app.setItem("send_juli", $(this).find('.juli').text());
            sessionStorage.setItem("sv",$('.search_bar').val())
            window.location.href = "../QuickRepairDetails/QuickRepairDetails.html";
        }
    });
    function areaScroll(index,id){
        var areaListH = $('.area-list-box').height();
        var ulH = (index+1)*liListH;
        if(areaListH<ulH){
            var areaScrollY = ulH - areaListH + 10;
            setTimeout(function () {
                vm.ijroll(id,-areaScrollY);
            },100);
        }
    }
    //tab切换
    body.on("click", ".search_select li", function () {
        var i = $('.search_select li').index($(this));
        var choiceBox = $('.choice-box');
        if(i == 0 && !$(this).hasClass('active')){
            var areaListH = $('.area-list-box').height();
            if(liListH){
                areaScroll(provincesIndex,'.province');
                areaScroll(cityIndex,'.city');
            }else {
                setTimeout(function () {
                    var ijrolls = new JRoll($('.province')[0]);
                    ijrolls.refresh();
                },100)
            }
        };
        if(!$(this).hasClass('active')){
            choiceBox.hide();
            $('.mask-all').show();
            choiceBox.eq(i).show();
            $(this).siblings().removeClass('active')
            $(this).addClass('active')
        }else {
            choiceBox.hide();
            $('.mask-all').hide();
            $(this).removeClass('active');
            if(!companyTypeId){
                $('.screen-type-list p').removeClass('active');
            }else {
                for(var i=0;i<companyTypeId.length;i++){
                    $('.screen-type-list p').eq(companyTypeId[i]).addClass('active')
                }
            }
        }
        // var y = $('.province_active').height()
        // console.log(y)
    });

    
    function maskHidex(){
        $('.search_select li').removeClass('active');
        $('.choice-box').hide();
        $('.mask-all').hide();
    }
    //选择排序
    body.on("click", ".sorting-list p", function () {
        $(this).addClass('active').siblings().removeClass('active')
        $('.sorting-text').html($(this).text());
        maskHidex();
    });
    //筛选
    body.on("click", ".screen-type-list p", function () {
        if(!$(this).hasClass('active')){
            $(this).addClass('active')
        }else {
            $(this).removeClass('active');
        }
    });
    body.on("click", ".reset-btn", function () {
        $('.screen-type-list p').removeClass('active');
    });
    body.on("click", ".mask-all", function (e) {
        e.stopPropagation();
        maskHidex();
        if(!companyTypeId){
            $('.screen-type-list p').removeClass('active');
        }else {
            for(var i=0;i<companyTypeId.length;i++){
                $('.screen-type-list p').eq(companyTypeId[i]).addClass('active')
            }
        }
    });
    
    body.on("click", ".confirm-btn", function () {
        var companyType = $('.screen-type-list p');
        companyTypeId = [];
        for (var i=0;i<companyType.length;i++){
            if(companyType.eq(i).hasClass('active')){
                companyTypeId.push(companyType.eq(i).attr("data-type"));
            };
        };
        maskHidex();
        pageNum = 1;
        positionGetMerchantList('update',provinces,citys,countries,companyTypeId)

    });
    //地区
    body.on("click", ".area-list label", function () {
        $(this).parent().addClass('active').siblings().removeClass('active');
        $('.area-text').html($(this).text());
        maskHidex();
    });
    //选择城市
    body.on("click", ".tab-city", function () {
        $('.confirm-btn').click();
        $('#city-content').animate({
            'left':'0%'
        },200,function () {
            $('.letter').show();
            $('.city_page_close').show();
        })
    });
    body.on("click", ".city-position-text", function () {
        var dataProvince = $(this).attr('data-province');
        if(dataProvince == '定位失败') return false;
        liListH = $('.province li').height();
        countries = '';
        pageNum = 1;
        positionGetMerchantList('update',dataProvince,$(this).text(),countries,companyTypeId);
        provinces = dataProvince;
        citys = $(this).text();

        $('.area-text').text($(this).text())
        var provinceList = $('.province').find('li');
        for(var i=0;i<provinceList.length;i++){
            if(provinceList.eq(i).html() == dataProvince){
                provincesIndex = i;
            }
        };
        vm.classActive(provincesIndex,$(this).text());
        setTimeout(function () {maskHidex();},100)
    });
    body.on("click", ".city li", function () {
        var i =$('.city li').index($(this));
        var district = vm.city[i].childCity
        if(district.length<=1){
            pageNum = 1;
            countries = '';
            positionGetMerchantList('update',provinces,citys,countries,companyTypeId)
            maskHidex();
            $('.area-text').text(citys);
            return false;
        }

    });
    
    body.on("click", ".district li", function () {
        pageNum = 1;
        positionGetMerchantList('update',provinces,citys,countries,companyTypeId);

        maskHidex();
    });
};

var provinces='',
    citys='',
    countries='',
    provincesIndex,
    cityIndex,
    liListH;


//	新增倒计时
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
        lat:'',
        lng:'',
        countDown:'',
        arr:{},
        citiesArr:[],
        city:[],
        district:[],
        current: -1,
        cityAtive:-1,
        districtAtive:-1
    },
    created:function(){
        $.ajax({
            type:"POST",
            url:api.NWBDApiGetList + "?r=" + Math.random(),
            data:{
                cityLevel:'PROVINCE',
                openid: app.getItem("open_id")
            },
            dataType: 'json',
            success:function(res){
                var citiesArrs = [];
                var res = res.data;
                for(var i=0;i<res.length;i++){
                    for(var j=0;j<res[i].cities.length;j++){
                        // console.log(res[i].cities[j])
                        citiesArrs.push(res[i].cities[j])
                    }
                }
                vm.inits(citiesArrs)

            },
            error:function(){
                app.alert('网络故障，请检查网络！');
            }
        });
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
                localStorage.setItem('num',m)
                // vm.formatDuring(m)
                vm.formaFun(m);
                if(m == api.pzTime){
                    // 	指定时间后定时器消失
                    vm.isBox = false;
                    clearInterval(tt);
                    localStorage.removeItem('status');
                    localStorage.removeItem('num');
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
                            if(result.code == 0){
                                app.alert(result.data)
                                localStorage.removeItem('status');
                                localStorage.removeItem('num');
                            }
                        },
                        error:function(){
                            app.alert('网络故障，请检查网络！');
                        }
                    });
                }
            },1000)
        },
        inits:function(data){
            this.citiesArr = data;

        },
        classActive:function(province,city){
            this.provinceClick(province);
            for(var i=0;i<this.city.length;i++){
                if(this.city[i].name == city){
                    this.cityClick(i);
                    cityIndex = i
                }
            };
            this.districtClick(0)

        },
        provinceClick:function (index) {
            var cityData = this.citiesArr[index].childCity;
            // if(cityData.length>1 && cityData[0].id){
            //     cityData.unshift({'name':'全'+this.citiesArr[index].name});
            // }
            provinces = this.citiesArr[index].name;
            this.city = cityData;
            setTimeout(function () {
                vm.ijroll('.city',0)
            },100);
            this.current = index;
            this.cityAtive = -1;
            $('.province').css({'width':'30%'});
            $('.city').animate({
                'left':'30%'
            },200);
            $('.city').css({'width':'65%'});
            $('.district').css({'left':'100%'});
        },
        cityClick:function (index) {
            var district = this.city[index].childCity;

            citys = this.city[index].name;

            if(district.length>1 && district[0].id){
                district.unshift({'name':'全'+this.city[index].name});
            };
            this.district = district;
            this.cityAtive = index;
            this.districtAtive = -1;
            if(district.length<=1){
                $('.city').css({'width':'65%'});
                $('.district').css({'left':'100%'});
                return false;
            }
            setTimeout(function () {
                vm.ijroll('.district',0)
            },100);
            $('.city').css({'width':'30%'})
            $('.district').animate({
                'left':'70%'
            },200);
        },
        districtClick:function(index){

            if(this.district[index].id){
                countries = this.district[index].name;
                $('.area-text').text(countries);
            }else {
                countries = '';
                $('.area-text').text(citys);
            }
            this.districtAtive = index;
        },
        ijroll:function (id,ijrollsY) {
            var ijrolls;
            ijrolls = new JRoll($(id)[0]);
            ijrolls.scrollTo(0, ijrollsY, 0);
            ijrolls.refresh();
        }
    },
    
    mounted(){
        
        app.verificationUserInfo();      //  判断登录去掉；
        if(!app.getItem('userInfo')){
            return;
        }
        var number1 = app.checkTime()
        if(number1 != ''){
            this.timer(number1);
        }
        

        //	有未接订单的情况
        var status = localStorage["status"];
        if(status == 1){
            this.isBox = true;
            $('.dwopa').hide();
            this.$refs.countblock.childs();
            
        }else{
            this.isBox = false;
            //	暂时隐藏
            // $('.dwopa').show();
        }

        
        // 调用组件
        this.$refs.adverblock.init();
        //	操作指南
        this.$refs.adverblock1.init1();
    }
});
