$(document).on('click',".submit",function(){
    $.ajax({
        url: document.URL,
        data: $('.form').serialize(),
        type: "POST",
        cache: false,
        dataType: 'json',
        success: function (msg) {
            if (msg) {
                $('.success').text('修改成功');
                fade('.success');
                setTimeout(()=>{
                    window.location.href="/posts";
                },1000);
            }
        },
        error: function () {
            alert('异常');
        }
    })
});