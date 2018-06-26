$(document).on("click",".submit",function () {
    console.log($('.form').serialize());
    $.ajax({
        url: "/signin",
        data: $('.form').serialize(),
        type: "POST",
        cache: false,
        dataType: 'json',
        success: function (msg) {
            if (!msg) {
                $('.error').text('用户名或密码错误')
                $('input').val('');
                fade('.error');
            }else{
                $('.success').text('登录成功');
                fade('.success');
                setTimeout(()=>{
                    window.location.href="/posts";
                },1000);
            }
            //console.log($('.ui.error.message').text);
        },
        error: function () {
            alert('异常');
        }
    });
});