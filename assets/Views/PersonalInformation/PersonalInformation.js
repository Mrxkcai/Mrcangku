$(function () {
    $("body").css("height", $(window).height() + "px");

    app.verificationUserInfo();
    $("#name").val(app.getItem("userInfo").name);
    $("#phone").val(app.getItem("userInfo").mobile);

    $("body").on("click", "button", function () {
        app.verificationUserInfo();
        app.loading();
        $.ajax({
            url: api.NWBDApiImproveCustomer + "?r=" + Math.random(),
            type: "POST",
            dataType: "json",
            data: {
                customer_id: app.getItem("userInfo").id,
                mobile: app.getItem("userInfo").mobile,
                name: $.trim($("#name").val())
            },
            success: function (result) {
                if (result.status === "success" && result.code === 0) {
                    app.setItem("userInfo", result.data);
                    alert("保存成功");
                    window.location.href = "../../index.html";
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
});