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
                            userId: app.getItem('userInfo').id, //	app.getItem('open_id') '9d8eb665-d810-411b-8ad1-77c341f40038'	
                            openid: app.getItem("open_id")
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
            }

        },
        mounted: function mounted() {
            if (!app.getItem('userInfo')) {
                return;
            }
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
            var self = this;
        }
    });

    var body = $('body');
    //  必须给这个样式，防止下拉的时候出现bug;
    $(".voucher_list").css("height", $(window).height() + "px");

    var voucher_list_num = 1;
    var pagesize = 10;
    var ijroll;
    var ijroll_y = 0;

    ijroll = new JRoll($('.voucher_list')[0]);
    ijroll.pulldown({
        refresh: function refresh(complete) {
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

    console.log(ijroll);
    //  输出html结构
    var createData = function createData(data, datatype) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += '\n                <li>    \n                <div class="d_money">\n                    \n                    <span><i>\xA5</i> ' + data[i].price + '</span>\n                    <span>' + data[i].name + '</span>\n                    <p></p>\n                    <p></p>\n                </div>\n\n                <div class="w_text">\n                    <p><span>' + data[i].typeName + '</span>\u9002\u7528\u8303\u56F4\uFF1A' + data[i].introduction + '</p>\n                    <div class="d-date">\n                        \u6709\u6548\u671F\uFF1A' + app.getTime(data[i].beginDate, 4) + ' ~ ' + app.getTime(data[i].endDate, 4) + '\n                    </div>\n                </div>\n                \n            </li>\n            ';
        }

        return str;
    };

    var getPageData = function getPageData(datatype) {
        //  调取登陆接口；
        app.verificationUserInfo();

        var type = 1;
        var pageNum = 1;
        pageNum = voucher_list_num;

        if (pageNum == -1) {
            if ($('.voucher_list ul .no_more').length == 0 && $('.voucher_list ul li').length >= 10) {
                $('.voucher_list ul').append('<p class="no_more">没有更多了~</p>');
            };

            return;
        };

        app.loading(); //  数据加载样式；

        $.ajax({
            type: 'GET',
            url: api.NWBDApiWeiXincouponList + '?v=' + Math.random(),
            data: {
                userId: app.getItem("userInfo").id,
                type: type,
                pageNum: pageNum,
                pageSize: pagesize,
                openid: app.getItem("open_id")
            },
            async: true,
            success: function success(res) {
                console.log(res);
                if (res.code == 0 && res.status === "success") {

                    if (res.data.length > 0) {
                        //  输出html结构
                        var str = createData(res.data, datatype);
                        if (datatype == 'update') {
                            $('.voucher_list ul').html(str);
                        } else if (datatype == 'add') {
                            $('.voucher_list ul').append(str);
                        };

                        //  请求成功后对分页进行一次更新
                        if (res.data.length >= pagesize) {
                            voucher_list_num++;
                        } else if (res.data.length < pagesize) {
                            voucher_list_num = -1;
                        };
                    } else {
                        if (ijroll_y === 0 && pageNum === 1) {
                            $('.voucher_list ul').html("<div style='position: fixed;top:15%;left: 50%;transform: translateX(-50%);'><img src='../../images/no_data.png' style='width: 2.75rem;height: 2.8rem;' /><div style='color: #555;margin-top: 0.1rem;text-align: center;'>当前没有优惠券哦~</div></div>");
                        };
                    };
                    // 高度变化后对ijroll对象进行刷新
                    ijroll.refresh();
                    app.closeLoading();
                } else {
                    app.closeLoading();
                    app.alert(res.message);
                };
            },
            error: function error(res) {
                app.closeLoading();
                app.alert(res.message);
            }
        });
    };

    getPageData("add");
};