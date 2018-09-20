$(function(){
    //  -fastclick 用法
    FastClick.attach(document.body);

    var vm = new Vue({
        el:'#app',
        data:{
            btnS:true,
            url2:url.addre + '/third/commission/cash',
            userId:'',
            userType:getUrlParam('userType'),        //-用户类型    类型链接里一定会有所以直接取
            commissionType:'',   //  -体现类型
            pageNum:'1',
            pageSize:'10',
            list:[],
            tx:'0',
            b3:false
        },
        methods:{
            init(){
                //-页面高度
                $('#app').css({'min-height':$(window).height()});
                $('.sec2').removeClass('high');
                var that = this;
                if(getUrlParam('userid')){
                    that.userId = getUrlParam('userid')
                }else if(!getUrlParam('userid') && !app.getItem("userInfo")){
                    that.userId = '';
                }else if(!getUrlParam('userid') && app.getItem("userInfo")){
                    that.userId = app.getItem("userInfo").id
                }else{}

                that.fun1(0);

                //-由链接获取数据
                if(getUrlParam('userid')){
                    that.userId = getUrlParam('userid')
                }else if(!getUrlParam('userid') && !app.getItem("userInfo")){
                    that.userId = '';
                }else if(!getUrlParam('userid') && app.getItem("userInfo")){
                    that.userId = app.getItem("userInfo").id
                };

                
            },
            //-切换
            qh(n){
                var that = this;    
                $('.par1>div').eq(n).addClass('Ac').siblings('div').removeClass('Ac');
                that.list = [];
                if(n == 1){
                    that.btnS = false;  
                    $('.sec2').addClass('high');
                }else if(n == 2){
                    that.btnS = false; 
                    $('.sec2').addClass('high');
                }
                else if(n == 0){
                    that.btnS = true;  
                    $('.sec2').removeClass('high');
                };

            },
            btn2(){
                var that = this;
                //-按钮变灰
                $.ajax({
                    url:that.url2,
                    type:'post',
                    data:{
                        userId:that.userId,
                        userType:that.userType
                        // userId:'cd92936c-c60a-4f86-b989-7a2e6f7c2759',
                        // userType:0
                    },
                    success:function(res){
                        console.log(res)
                        if(res.status == 'success' && res.code == 0){
                            //-刷新页面
                            $('.btn2').hide();
                            that.b3 = true;
                            $('.par1>div:nth-child(1)').trigger('click');
                        }else{
                            app.alert(res.message)
                        }
                    },
                    error:function(){
                        // app.alert('网络故障，请检查网络');
                    }
                });
                
            },
            //存放数据
            fun1(n){
                var that = this;

            }

            

        },
        mounted(){
            var that = this;
            that.init();
        }
    });


    var body = $('body');
    
    //  必须给这个样式，防止下拉的时候出现bug;
    $(".sec2").css("height", $('.u0').height() + "px");
    var userid;
    if(getUrlParam('userid')){
        userid = getUrlParam('userid')
    }else if(!getUrlParam('userid') && !app.getItem("userInfo")){
        userid = '';
    }else if(!getUrlParam('userid') && app.getItem("userInfo")){
        userid = app.getItem("userInfo").id
    }else{}


    //-实力化对象
    var voucher_list_num = 1;
    var pagesize = 5;
    var ijroll;
    var ijroll_y = 0;
    var t = 0;
    var arr;

    //- 点击请求
    $('.new_div').on('click',function(){
        var index = $(this).index();
        t = index;
        ijroll.refresh();
        ijroll.scrollTo(0, 0);
        voucher_list_num = 1;
        if(t == 0){
            pagesize = 5;
            getPageData("update");
        }else if(t == 1 ){
            pagesize = 8;
            getPageData("update");
        }else if(t == 2){
            pagesize = 8;
            getPageData("update");
        }else{};
        
        
        
        
    });

    ijroll = new JRoll($('.sec2')[0]);
    ijroll.pulldown({
        refresh: function (complete) {
            voucher_list_num = 1;
            ijroll_y = 0;
            complete();
            //  更新列表方法
            getPageData("update");
        }
    });

    ijroll.scrollTo(0, ijroll_y);
    ijroll.on('touchEnd', function () {
        if (ijroll.maxScrollY >= ijroll.y + 5) {
            ijroll_y = ijroll.maxScrollY;
            //  加载列表方法
            getPageData("add");
        }
    });

   
    var createData = function(data,datatype){
        var str = "";
        for(var i = 0;i < data.length; i ++){
            str += `
                <li>
                    <div class="leftImg">

                    </div>
                    <div class="rightDiv"> 
                        <div class="p1">
                            <p>${data[i].relationmobile}</p>
                            <p>${data[i].createDate}</p>
                        </div>
                        <div class="p2">
                                + ${data[i].commission}
                        </div>
                    </div>
                </li>
            `;
        };
        
        return str;


    };

    // console.log(url.addre)
    var getPageData = function(datatype){
       console.log(voucher_list_num)
        var pageNum = 1;
        pageNum = voucher_list_num;

        if(pageNum == -1){
            if($('.sec2 ul li').length >= pagesize){
                $('.voucher_list ul').append('<p class="no_more">没有更多了~</p>')
            };
            return;
        };

        $.ajax({
            type:'POST',
            url:url.addre + '/third/commission/List?v=' + Math.random(),
            data:{
                userId:userid,
                userType:getUrlParam('userType'),
                // userId:'cd92936c-c60a-4f86-b989-7a2e6f7c2759',
                // userType:0,
                commissionType:t,
                pageNum:voucher_list_num,
                pageSize:pagesize
            },
            async:true,
            success(res){
                console.log(res)
               if(res.data.list.length == 0){
                    $('.btn2').hide();
                    vm.b3 = true;
               }else{
                    for(var i = 0;i < res.data.list.length; i ++){
                        res.data.list[i].createDate = getTime(res.data.list[i].createDate,5);
                        res.data.list[i].relationmobile = res.data.list[i].relationmobile.substr(0,3)+"****"+res.data.list[i].relationmobile.substr(7);
                    };
                    $('.btn2').show();
                    vm.b3 = false;
               };
                
                
                $('.btn1 span').text(res.data.cash);
                if(res.code == 0 && res.status == 'success'){
                    if(pagesize == 5){
                        // arr = [
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        // ];
                        arr = res.data.list;
                    }else if(pagesize == 8){
                        // arr = [
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        // ];
                        arr = res.data.list;
                    };
                    // console.log(arr)
                    var str = createData(arr);
                    if(datatype == 'update'){
                        $('.u0').html(str);
                    }else if(datatype == 'add'){
                        $('.u0').append(str);
                    };

                    //  请求成功后对分页进行一次更新
                    if(arr.length >= pagesize){
                        voucher_list_num++;
                    }else if(res.data.list.length < pagesize){
                        voucher_list_num = -1;
                    };
                    console.log(voucher_list_num)
                    ijroll.refresh();
                    }else{
                        app.alert(res.message)
                    };
            },
            error:function(){
                // app.alert('网络故障，请检查网络');
            }
        });
    };


    



    getPageData("update");
});