function fade(data){
    if( $(data).css('display') !== 'none' ) {
        $(data).fadeOut(1500);
    }else{
        $(data).show();
        $(data).fadeOut(1500);
    }
}
//退出接口逻辑
$(document).on("click",".signout",function () {
    $.ajax({
        url: "/signout",
        type: "GET",
        cache: false,
        dataType: 'json',
        success: function (msg) {
            if (msg) {
                $('.success').text('登出成功');
                fade('.success');
                setTimeout(()=>{
                    window.location.href="/posts";
                },1000);
            }
        },
        error: function () {
            alert('异常');
        }
    });
});