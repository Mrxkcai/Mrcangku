'use strict';

$(function () {
    //  -fastclick 用法
    FastClick.attach(document.body);

    var vm = new Vue({
        el: '#app',
        data: {
            btnS: true,
            url2: url.addre + '/third/commission/cash',
            userId: '',
            userType: getUrlParam('userType'), //-用户类型    类型链接里一定会有所以直接取
            commissionType: '', //  -体现类型
            pageNum: '1',
            pageSize: '10',
            list: [],
            tx: '0',
            b3: false,
            show: false
        },
        methods: {
            init: function init() {
                //-页面高度
                $('#app').css({
                    'min-height': $(window).height()
                });
                $('.sec2').removeClass('high');
                var that = this;
                if (getUrlParam('userid')) {
                    that.userId = getUrlParam('userid');
                } else if (!getUrlParam('userid') && !app.getItem("userInfo")) {
                    that.userId = '';
                } else if (!getUrlParam('userid') && app.getItem("userInfo")) {
                    that.userId = app.getItem("userInfo").id;
                } else {}

                that.fun1(0);

                //-由链接获取数据
                // if(getUrlParam('userid')){
                //     that.userId = getUrlParam('userid')
                // }else if(!getUrlParam('userid') && !app.getItem("userInfo")){
                //     that.userId = '';
                // }else if(!getUrlParam('userid') && app.getItem("userInfo")){
                //     that.userId = app.getItem("userInfo").id
                // };

            },

            //-切换
            qh: function qh(n) {
                var that = this;
                $('.par1>div').eq(n).addClass('Ac').siblings('div').removeClass('Ac');
                that.list = [];
                if (n == 1) {
                    that.btnS = false;
                    $('.sec2').addClass('high');
                } else if (n == 2) {
                    that.btnS = false;
                    $('.sec2').addClass('high');
                } else if (n == 0) {
                    that.btnS = true;
                    $('.sec2').removeClass('high');
                };
            },

            //-提现
            btn2: function btn2() {
                var that = this;
                if (getUrlParam('userType') == 2) {
                    //-公众号进入的
                    // that.show = true;

                } else {
                    //-按钮变灰
                    $.ajax({
                        url: that.url2,
                        type: 'post',
                        data: {
                            userId: that.userId,
                            userType: that.userType
                            // userId:'cd92936c-c60a-4f86-b989-7a2e6f7c2759',
                            // userType:0
                        },
                        success: function success(res) {
                            console.log(res);
                            if (res.status == 'success' && res.code == 0) {
                                //-刷新页面
                                $('.btn2').hide();
                                that.b3 = true;
                                $('.par1>div:nth-child(1)').trigger('click');
                            } else {
                                // app.alert(res.message)
                            }
                        },
                        error: function error() {
                            // app.alert('网络故障，请检查网络');
                        }
                    });
                };
            },

            //存放数据
            fun1: function fun1(n) {
                var that = this;
            },
            close_: function close_() {
                var that = this;
                that.show = false;
            }
        },
        mounted: function mounted() {
            var that = this;
            that.init();
            // that.btn2();
        }
    });

    var body = $('body');

    //  必须给这个样式，防止下拉的时候出现bug;
    $(".sec2").css("height", $('.u0').height() + "px");
    var userid;
    if (getUrlParam('userid')) {
        userid = getUrlParam('userid');
    } else if (!getUrlParam('userid') && !app.getItem("userInfo")) {
        userid = '';
    } else if (!getUrlParam('userid') && app.getItem("userInfo")) {
        userid = app.getItem("userInfo").id;
    } else {}

    //-实力化对象
    var voucher_list_num = 1;
    var pagesize = 5;
    var ijroll;
    var ijroll_y = 0;
    var t = "USABLE";
    var arr;

    //- tab切换
    $('.new_div').on('click', function () {
        var index = $(this).index();
        if (index == 0) {
            t = "USABLE";
        } else if (index == 1) {
            t = "WITHDRAW";
        } else {
            t = "FINISHED";
        };
        ijroll.refresh();
        ijroll.scrollTo(0, 0);
        voucher_list_num = 1;
        if (t == "USABLE") {
            pagesize = 5;
            getPageData("update");
        } else if (t == "WITHDRAW") {
            pagesize = 8;
            getPageData("update");
        } else if (t == "FINISHED") {
            pagesize = 8;
            getPageData("update");
        } else {};
    });

    ijroll = new JRoll($('.sec2')[0]);
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

    // 
    var createData = function createData(data, datatype) {
        var str = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].commissionType == "SHARE") {
                str += '\n                <li>\n                    <div class="leftImg shares">\n                    </div> \n                    <div class="rightDiv"> \n                        <p>\u5206\u4EAB\u5956\u52B1</p>\n                        <div class="p1">\n                            <p>' + data[i].createDate + '</p>\n                        </div>\n                        <div class="p2">\n                                + ' + data[i].commissionAmount + '\n                        </div>\n                    </div>\n                </li>\n            ';
            } else if (data[i].commissionType == "SHARE_REGISTRY") {
                str += '\n                <li>\n                    <div class="leftImg shares_r">\n                    </div>\n                    <div class="rightDiv">\n                         <p>\u597D\u53CB\u52A9\u529B\u5956\u52B1</p> \n                         <div class="p1 p3">\n                            <p>' + data[i].commissionResource + '</p>\n                            <p>' + data[i].createDate + '</p>\n                        </div>\n                        <div class="p2">\n                                + ' + data[i].commissionAmount + '\n                        </div>\n                    </div>\n                </li>\n            ';
            } else if (data[i].commissionType == "haier") {
                str += '\n                    <li>\n                        <div class="leftImg haier">\n                        </div>\n                        <div class="rightDiv">\n                             <p>\u6CE8\u518C\u5956\u52B1</p> \n                             <div class="p1 p3">\n                                <p>' + data[i].commissionResource + '</p>\n                                <p>' + data[i].createDate + '</p>\n                            </div>\n                            <div class="p2">\n                                    + ' + data[i].commissionAmount + '\n                            </div>\n                        </div>\n                    </li>\n                ';
            }
        };
        return str;
    };

    var storage = window.localStorage;
    var getPageData = function getPageData(datatype) {
        var pageNum = 1;
        pageNum = voucher_list_num;

        if (pageNum == -1) {
            if ($('.sec2 ul li').length >= pagesize) {
                $('.voucher_list ul').append('<p class="no_more">没有更多了~</p>');
            };
            return;
        };

        $.ajax({
            type: 'POST',
            url: api.NWBDApiWeiXinShareHaifs,
            data: {
                customerId: app.getItem('userInfo').id,
                commissionType: t,
                pageNum: voucher_list_num,
                pageSize: pagesize,
                openid: app.getItem("open_id")
            },
            async: true,
            success: function success(res) {
                var dataList = res.data.pageable.list;
                console.log(dataList.createDate);
                if (dataList.length == 0) {
                    $('.btn2').hide();
                    vm.b3 = true;
                } else {
                    for (var i = 0; i < dataList.length; i++) {
                        // dataList[i].createDate = getTime(dataList[i].createDate, 5);
                        dataList[i].createDate.replace(/\-/g, '/');
                        if (dataList[i].commissionType != "SHARE") {
                            dataList[i].commissionResource = dataList[i].commissionResource.substr(0, 3) + "****" + dataList[i].commissionResource.substr(7);
                        }
                    };
                    $('.btn2').show();
                    vm.b3 = false;
                };

                $('.btn1 span').text(res.data.totalCommission);
                storage.setItem("total", res.data.totalCommission);

                if (res.code == 0 && res.status == 'success') {
                    if (pagesize == 5) {
                        // arr = [
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        //     {'tel':'18334794858'},
                        // ];
                        arr = dataList;
                    } else if (pagesize == 8) {
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
                        arr = dataList;
                    };
                    // console.log(arr)
                    var str = createData(arr);
                    if (datatype == 'update') {
                        $('.u0').html(str);
                    } else if (datatype == 'add') {
                        $('.u0').append(str);
                    };

                    //  请求成功后对分页进行一次更新
                    if (arr.length >= pagesize) {
                        voucher_list_num++;
                    } else if (res.data.pageable.list.length < pagesize) {
                        voucher_list_num = -1;
                    };
                    ijroll.refresh();
                } else {
                    app.alert(res.message);
                };
            },

            error: function error() {
                // app.alert('网络故障，请检查网络');
            }
        });
    };
    // 提现
    $('#btn2').click(function () {
        // 判断是否是否注册嗨付
        $.ajax({
            url: url.addre + '/h5/thirdparty/haier/isRegister',
            type: 'POST',
            data: {
                mobile: app.getItem('userInfo').mobile
            }
        }).done(function (res) {
            if (res.data == false) {
                $('.drawCash-dialog').addClass('show');
                if ($('.drawCash-dialog-bd h1').length <= 0) {
                    var items = '<h1>' + storage.total + '<span>' + '元' + '</span>' + '</h1>';
                    $('.drawCash-dialog-bd').prepend(items);
                }
            } else {
                bank();
            }
        }).fail(function () {
            console.log("error");
        });

        $(this).hide();
        $(this).next().show();
    });

    $('.ui-dialog-close').click(function (event) {
        $('.drawCash-dialog').removeClass('show');
        $('.btn3').hide();
        $('.btn2').show();
    });

    // 跳转嗨付注册页
    body.on('click', '.tx', function (event) {
        event.preventDefault();
        document.write("<script src='https://s22.cnzz.com/z_stat.php?id=1274913728&web_id=1274913728' language='JavaScript'><\/script>");
        window.location.href = "https://wxcs.nuoweibd.com/statics/wxcs.nuoweibd.com/h5/Views/Haif/Haif.html?userType=2&source=501";
    });

    // 点击提现
    $('.zjtx').click(function (event) {
        $.ajax({
            url: api.NWBDApiWeiXinShareBank,
            type: 'GET',
            data: {
                userId: app.getItem('userInfo').id,
                openid: app.getItem("open_id")
            }
        }).done(function (res) {
            if (res.status == "success") {
                // 弹层，提现成功
                if (res.data.accountNo != "" && res.data.accountNo != null) {
                    $.ajax({
                        url: url.addre + '/third/commission/cash',
                        type: 'POST',
                        data: {
                            userId: app.getItem('userInfo').id,
                            userType: 2
                        }
                    }).done(function (res) {
                        if (res.status == "success") {
                            layer.alert('提现审核中');
                        }
                    }).fail(function () {
                        console.log("error");
                    });
                } else {
                    //弹层，填写银行信息，提现
                    $('.ui-dialog2').addClass('show');
                }
            }
        });
        $('.drawCash-dialog').removeClass('show');
    });
    var f1;
    var f2;
    var f3;
    // 表单验证
    $('.ui-input').blur(function (event) {
        event.stopPropagation();
        var nameVal = $.trim(this.value);
        var regName = /[~#^$@%&!*()<>:;'"{}【】  ]/;
        var num = /^\d*$/; //全数字
        var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99"; //开头2位
        // 验证用户名
        if ($(this).is('#bankname')) {
            if (nameVal == "" || nameVal.length < 4 || regName.test(nameVal)) {
                layer.msg('请输入正确银行名称', {
                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                });
                f1 = false;
            } else {
                f1 = true;
            }
        } else if ($(this).is('#name')) {
            if (nameVal == "" || regName.test(nameVal) || nameVal.length < 2) {
                layer.msg('请输入正确名称', {
                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                });
                f2 = false;
            } else {
                f2 = true;
            }
        } else if ($(this).is('#banknum')) {
            // 验证银行卡号
            if (nameVal == "" || nameVal.length < 16 || nameVal.length > 19) {
                layer.msg('银行卡号长度必须在16到19之间', {
                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                });
                f3 = false;
            } else if (!num.exec(nameVal)) {
                layer.msg('银行卡号必须全为数字', {
                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                });
                f3 = false;
            } else if (strBin.indexOf(nameVal.substring(0, 2)) == -1) {
                layer.msg('银行卡号开头2位不符合规范', {
                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                });
                f3 = false;
            } else {
                var lastNum = nameVal.substr(nameVal.length - 1, 1); //取出最后一位（与luhm进行比较）

                var first15Num = nameVal.substr(0, nameVal.length - 1); //前15或18位
                var newArr = new Array();
                for (var i = first15Num.length - 1; i > -1; i--) {
                    //前15或18位倒序存进数组
                    newArr.push(first15Num.substr(i, 1));
                }
                var arrJiShu = new Array(); //奇数位*2的积 <9
                var arrJiShu2 = new Array(); //奇数位*2的积 >9

                var arrOuShu = new Array(); //偶数位数组
                for (var j = 0; j < newArr.length; j++) {
                    if ((j + 1) % 2 == 1) {
                        //奇数位
                        if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);else arrJiShu2.push(parseInt(newArr[j]) * 2);
                    } else //偶数位
                        arrOuShu.push(newArr[j]);
                }

                var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
                var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
                for (var h = 0; h < arrJiShu2.length; h++) {
                    jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
                    jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
                }

                var sumJiShu = 0; //奇数位*2 < 9 的数组之和
                var sumOuShu = 0; //偶数位数组之和
                var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
                var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
                var sumTotal = 0;
                for (var m = 0; m < arrJiShu.length; m++) {
                    sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
                }

                for (var n = 0; n < arrOuShu.length; n++) {
                    sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
                }

                for (var p = 0; p < jishu_child1.length; p++) {
                    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
                    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
                }
                //计算总和
                sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

                //计算Luhm值
                var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
                var luhm = 10 - k;

                if (lastNum == luhm) {
                    f3 = true;
                } else {
                    layer.msg('银行卡号不正确', {
                        time: 1000 //2秒关闭（如果不配置，默认是3秒）
                    });
                    f3 = false;
                }
            }
        }
    });
    $('#save').click(function (event) {
        event.stopPropagation();
        if (f1 & f2 & f3) {
            $.ajax({
                url: api.NWBDApiWeiXinShareBank,
                type: 'POST',
                data: {
                    userId: app.getItem('userInfo').id,
                    accountNo: $("#banknum").val(),
                    accountName: $("#name").val(),
                    accountBank: $('#bankname').val(),
                    openid: app.getItem("open_id")
                }
            }).done(function (res) {
                $('#save').addClass('disabled');
                $('.ui-input').attr('disabled', 'disabled');
                $('.ui-dialog2').removeClass('show');
                // 提现
                $.ajax({
                    url: url.addre + '/third/commission/cash',
                    type: 'POST',
                    data: {
                        userId: app.getItem('userInfo').id,
                        userType: 2
                    }
                }).done(function (res) {
                    if (res.status == "success") {
                        layer.msg('绑卡成功,提现审核中', {
                            time: 1000 //2秒关闭
                        });
                        $('.new_div:eq(1)').trigger('click');
                    }
                }).fail(function () {
                    console.log("error");
                });
            }).fail(function () {
                console.log("error");
            });
        } else {
            layer.msg('请输入完整内容', {
                time: 1000 //2秒关闭
            });
        }
    });

    // 关闭遮罩层
    $('.ui-dialog2').click(function (event) {
        /* Act on the event */
        $(this).removeClass('show');
    });
    $('.ui-dialog2 .ui-dialog-cnt').click(function (event) {
        /* Act on the event */
        event.stopPropagation();
    });
    getPageData("update");
});