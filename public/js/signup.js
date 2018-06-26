$(document).on('click',".submit",function () {
    console.log($('.form').serialize());
    $.ajax({
        url: "/signup",
        data: $('.form').serialize(),
        type: "POST",
        cache: false,
        dataType: 'json',
        success: function (msg) {
            if (msg.data == 1) {
                $('.error').text('用户名存在');
                $('input').val('');
                fade('.error');
            }else if (msg.data == 2){
                $('.error').text('请输入重复的密码');
                fade('.error');
            }else if(msg.data == 3){
                $('.success').text('注册成功')
                fade('.success');
                setTimeout(()=>{
                    window.location.href="/signin";
            },1000);
            }
            //console.log($('.ui.error.message').text);
        },
        error: function () {
            alert('异常');
        }
    });
});