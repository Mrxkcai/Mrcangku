$(function () {
    "use strict";

    var body = $("body");

    var order_id = app.getQueryString("order_id");
    if (!order_id) {
        // alert("网络连接不上，请重新操作");
        window.history.go(-1);
    }

    var overall_evaluation_grade = 0;
    var service_quality_grade = 0;
    var service_attitude_grade = 0;

    body.on("click", ".overall_evaluation>ul>li,.service_quality>ul>li,.service_attitude>ul>li", function (e) {
        $(this).text("").siblings().text("");
        $(this).text("");
        for (var i = 0; i <= $(this).index(); i++) {
            $(this).siblings("li:nth-child(" + (i + 1) + ")").text("");
        }
        switch ($(this).parent().attr("data-grade")) {
            case "overall_evaluation":
                overall_evaluation_grade = $(this).index() + 1;
                break;
            case "service_quality":
                service_quality_grade = $(this).index() + 1;
                break;
            case "service_attitude":
                service_attitude_grade = $(this).index() + 1;
                break;
        }
    });

    body.on("input", "textarea", function () {
        $(".textareaLength").text("(您还可以输入 " + (500 - $(this).val().length) + " 个字)");
    });

    body.on("click", ".btn_submit_review", function () {
        var keywords = ['alert', 'javascript', 'Function', 'eval', 'return', 'break', 'undefined', 'prototype', 'NaN', 'script', 'none'];
        var text = $("textarea").val();
        if (text) {
            for (var i = 0; i < keywords.length; i++) {
                if (text.indexOf(keywords[i]) > -1) {
                    app.alert('评论内容过于铭感！');
                    return;
                }
            }
        }
        app.verificationUserInfo();
        app.loading();
        $.ajax({
            // url: api. + "?r=" + Math.random(),
            type: "POST",
            dataType: 'json',
            data: {
                commentJson: {
                    userId: app.getItem("userInfo").id,
                    evaluate: overall_evaluation_grade,
                    quality: service_quality_grade,
                    service: service_attitude_grade,
                    commentContent: text,
                    openid: app.getItem("open_id")
                },
                order_id: order_id
            },
            success: function (result) {
                // console.log(JSON.stringify(result));
                if (result.status === "success" && result.code === 0) {
                    alert("评论成功");
                    window.history.go(-1);
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
    });

    var winHeight = $(window).height();
    $(window).resize(function () {
        var thisHeight = $(this).height();
        if (winHeight - thisHeight !== 0) {
            $(".btn_submit_review").hide();
        } else {
            $(".btn_submit_review").show();
        }
    });
});