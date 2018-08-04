'use strict';

var voucher = function voucher() {

    //	新增倒计时
    var vm = new Vue({
        el: '#app',
        data: {
            isBox: false,
            countBlock: {
                min: '00',
                sec: '00',
                numAll: '',
                orderId: localStorage.getItem('orderId')
            },
            countDown: ''
        },
        methods: {
            //	转化时间并赋值
            formaFun: function formaFun(a) {
                var obj = app.formatDuring(a);
                this.countBlock.min = obj.min;
                this.countBlock.sec = obj.sec;
            },
            timer: function timer(m) {
                // 定时器
                var tt = setInterval(function () {
                    m++;
                    this.countDown = m;

                    localStorage.setItem('num', m);
                    vm.formaFun(m);
                    if (this.countDown == api.pzTime) {
                        // 	指定时间后定时器消失
                        vm.isBox = false;
                        clearInterval(tt);
                        vm.countDown = 0;
                        localStorage.removeItem('status');
                        localStorage.removeItem('num');
                        $('#app').removeClass('bottomP');
                        var data = {
                            order_id: vm.countBlock.orderId,
                            user_id: app.getItem('userInfo').id //	app.getItem('open_id') '9d8eb665-d810-411b-8ad1-77c341f40038'	
                        };
                        $.ajax({
                            type: "POST",
                            url: api.NWBDApiWeiXincancelOrder,
                            data: data,
                            dataType: 'json',
                            success: function success(result) {
                                console.log(result);
                                if (result.code == 0) {
                                    app.alert(result.data);
                                    localStorage.removeItem('status');
                                    localStorage.removeItem('num');
                                }
                            },
                            error: function error() {
                                alert('操作失败，请检查网络！');
                                app.closeLoading();
                            }
                        });
                    }
                }, 1000);
            },

            // get: function get() {
            //     console.log(223);
            // }

        },
        mounted: function mounted() {
            var number1 = app.checkTime();
            if (number1 != '') {
                this.timer(number1);
            }

            //	有未接订单的情况
            var status = localStorage["status"];
            if (status == 1) {
                this.isBox = true;
                $('#app').addClass('bottomP');
                this.$refs.countblock.childs();
            } else {
                this.isBox = false;
                $('#app').removeClass('bottomP');
            }

            // 调用组件
            this.$refs.adverblock.init();
            //	操作指南
            this.$refs.adverblock1.init1();
        },
        created: function created() {
            // var self = this;
            // $(window).scroll(function () {
            //     var scrollTop = $(this).scrollTop();
            //     var scrollHeight = $(document).height();
            //     var windowHeight = $(this).height();

            //     if (scrollTop + windowHeight === scrollHeight) {
            //         self.get();
            //     }
            // });
        }
    });


    var body = $('body');
    $(".voucher_list").css("height", $(window).height() + "px");
    var voucher_list_num = 1;
    var pagesize = 10;
    var ijroll;
    var ijroll_y = 0;

    ijroll = new JRoll($('.voucher_list')[0]);
    ijroll.pulldown({
        refresh: function (complete) {
            payment_order_pageNum = 1;
            ijroll_y = 0;
            complete();
            getPageData(type, "update");
        }
    });

    ijroll.scrollTo(0, ijroll_y);
    ijroll.on('touchEnd', function () {
        if (ijroll.maxScrollY >= ijroll.y) {
            ijroll_y = ijroll.maxScrollY;
            getPageData(type, "add");
        }
    });

    var createData = function (data,dataLength,type) {

    };

    var getPageData = function (datatype) {
        //  调取登陆接口；
        app.verificationUserInfo();

        var type = 1;
        var pageNum = 1;

        if(pageNum == -1){
            return;
        };

        app.loading();      //  数据加载样式；

        $.ajax({
            type:'',
            url:'' + '?v=' + Math.random(),
            
        });

    };


};
