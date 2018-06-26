//删除文章
$(document).on('click',".delete_post",function(){
    $.ajax({
        url:"<%= posts[0]['id'] %>/remove",
        type:'GET',
        cache: false,
        success:function(msg){
            if (msg.data==1) {
                $('.success').text('删除文章成功');
                fade('.success');
                setTimeout(()=>{
                    //window.location.href="/posts";
                },1000);
            }else if(msg.data==2){
                $('.error').text('删除文章失败');
                fade('.error');;
                setTimeout(()=>{
                    window.location.reload();
            },1000);
            }
        }
    });
});
//删除评论
$(document).on('click',".delete_comment",function(){
    $.ajax({
        url:"<%= posts[0]['id'] %>/comment/<%= res['id'] %>/remove",
        type:'GET',
        cache: false,
        success:function(msg){
            if (msg.data==1) {
                $('.success').text('删除留言成功');
                fade('.success');
                setTimeout(()=>{
                    window.location.reload();
            },1000);
            }else if(msg.data==2){
                $('.error').text('删除留言失败');
                fade('.error');
                setTimeout(()=>{
                    window.location.reload();
                },1000)
            }
        },
        error:function(){
            alert('异常');
        }
    })
});
//提交留言评论
$(document).on('click',".submit",function () {
    $.ajax({
        url: '/'+document.URL.slice(document.URL.lastIndexOf('/')+1),
        data:$('.form').serialize(),
        type: "POST",
        cache: false,
        dataType: 'json',
        success: function (msg) {
            if (msg) {
                $('.success').text('发表留言成功');
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