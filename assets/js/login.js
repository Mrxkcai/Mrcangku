(function (window, $) {
    var body = $("body");

    if (!app.getItem("userInfo") || !app.getItem("userInfo").id || !app.getItem("userInfo").mobile) {
        body.append(`
<div class="Mask_login">
    <dl class="login">
        <dd>
            <span></span>
            <input id="mobile" type="tel" maxlength="11" placeholder="请输入手机号"/>
        </dd>
        <dd class="clearfix">
            <span></span>
            <input id="code" type="number" maxlength="4" oninput="if(value.length>4){value=value.slice(0,4);}" placeholder="请输入验证码"/>
            <button class="btn_code">获取验证码</button>
        </dd>
        <dd>
            <button class="btn_login">登录</button>
        </dd>
    </dl>
</div>
        `);
    }

    body.on("click", ".btn_code", function () {
        var mobile = $.trim($('#mobile').val());
        if (!mobile || !/^[1][0-9]{10}$/.test(mobile)) {
            app.alert("手机号填写有误");
            return;
        }
        var btn_code = $(this);
        btn_code.css("backgroundColor", "#fec897");
        var time = 60;
        btn_code.text(time);
        btn_code.attr("disabled", true);
        var timer = setInterval(function () {
            time--;
            btn_code.text(time);
            if (time <= 0) {
                clearInterval(timer);
                btn_code.css("backgroundColor", "#f87b19");
                btn_code.text("获取验证码");
                btn_code.attr("disabled", false);
            }
        }, 1000);
        $.ajax({
            url: api.NWBDApiVerifysend + "?r=" + Math.random(),
            type: "POST",
            dataType: 'json',
            data: {
                mobile: mobile
            },
            success: function (result) {
                // console.log(JSON.stringify(result));
            },
            error: function () {
                app.alert('操作失败，请检查网络！');
            }
        });
    });

    body.on("click", ".btn_login", function () {
        var mobile = $.trim($('#mobile').val());
        if (!mobile || !/^[1][0-9]{10}$/.test(mobile)) {
            app.alert("手机号填写有误");
            return;
        }
        var code = $.trim($('#code').val());
        if (!code || !/^[0-9]{4}$/.test(code)) {
            app.alert("验证码填写有误");
            return;
        }
//      alert(app.getItem('open_id'))
        $.ajax({
            url: api.NWBDApiLogin + "?r=" + Math.random(),
            type: "POST",
            dataType: 'json',
            data: {
                mobile: mobile,
                code: code,
                openid:app.getItem('open_id')
            },
            
            success: function (result) {
                   console.log(JSON.stringify(result));
                if (result.status === "success" && result.code === 0) {
                    app.setItem("userInfo", result.data);
                    window.location.href = window.location.href.indexOf("?") === -1 ? window.location.href + '?t=' + ((new Date()).getTime()) : window.location.href + '&t=' + ((new Date()).getTime());
                } else {
                    app.alert(result.message);
                }
            },
            error: function () {
                app.alert('操作失败，请检查网络！');
            }
        });
    });

})(window, jQuery);