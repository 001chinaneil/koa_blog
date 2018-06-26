$(document).on('click',".submit",function(){
    $.ajax({
        url: "/create",
        data: $('.form').serialize(),
        type: "POST",
        cache: false,
        dataType: 'json',
        success: function (msg) {
            if (msg) {
                $('.success').text('发表成功');
                fade('.success');
                setTimeout(()=>{
                    window.location.href="/posts";
            },1000);
            }else{
                $('.success').text('发表失败');
                fade('.success');
                setTimeout(()=>{
                    window.location.reload();
                },1000);
            }
        },
        error: function () {
            alert('异常');
        }
    });
});