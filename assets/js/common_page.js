(function ($, common_page) {
    "use strict";
    var body = $('body');
    body.append(`
<div class="commom_page">
    <div class="commom_page_close">×</div>
    <div class="commom_page_content">
    </div>
</div>
    `);
    common_page.init = function () {
        $(".commom_page").css("height", $(window).height() + "px").stop().animate({"left": "0"}, 200, "linear");

        //关闭页面
        body.on('click', '.commom_page_close', function () {
            $(".commom_page").stop().animate({"left": "100%"}, 200, "linear");
        });
    };
})($, window.common_page = {});