var router=require('koa-router')();
// 处理数据库（之前已经写好，在mysql.js）
var userModel=require('../lib/mysql.js');
// 时间中间件
var moment=require('moment');

// get '/'页面
router.get('/',async (ctx,next)=>{
    ctx.redirect('/posts');
});
// get '/posts'页面
router.get('/posts',async (ctx,next)=>{

    // 这里我们先通过查找有没有类似/posts?author=XXX 的连接跳转，如果有就执行下面这句话，把用户名取下来，由于用户名存在中文，所以我们进行解码
    if (ctx.request.querystring) {
    console.log('ctx.request.querystring',decodeURIComponent(ctx.request.querystring.split('=')[1]))
    await userModel.findDataByUser(decodeURIComponent(ctx.request.querystring.split('=')[1]))
        .then(result=>{
        res=JSON.parse(JSON.stringify(result))
        console.log(res)
});
    await ctx.render('posts',{
        session:ctx.session,
        posts:res
    });
}else{
    // 如果连接是正常的 如 /posts 则我们获取的是全部文章的列表，所以通过findAllPost查找全部文章并向模板传递数据posts， posts的值为res
    await userModel.findAllPost()
        .then(result=>{
        console.log(result);
    res=JSON.parse(JSON.stringify(result));
    console.log('post',res);
});
    await ctx.render('posts',{
        session:ctx.session,
        posts:res
    });
}
});

// get '/create'
router.get('/create',async (ctx,next)=>{
    await ctx.render('create',{
        session:ctx.session,
    });
});

// psot '/create'
router.post('/create',async (ctx,next)=>{

    console.log(ctx.session.user);
var title=ctx.request.body.title;
var content=ctx.request.body.content;
var id=ctx.session.id;
var name=ctx.session.user;
var time=moment().format('YYYY-MM-DD HH:mm');
console.log([name,title,content,id,time]);
// 这里我们向数据库插入用户名、标题、内容、发表文章用户的id、时间，成功返回true，失败为false
await userModel.insertPost([name,title,content,id,time])
    .then(()=>{
    ctx.body='true';
}).catch(()=>{
    ctx.body='false';
});
});

//单篇文章
router.get('/posts/:postId',async (ctx,next)=>{
    console.log(ctx.params.postId);
    // 通过文章id查找返回数据，然后增加pv 浏览 +1
    await userModel.findDataById(ctx.params.postId)
        .then(result=>{
        res=JSON.parse(JSON.stringify(result));
        res_pv=parseInt(JSON.parse(JSON.stringify(result))[0]['pv']);
        res_pv+=1;
    console.log(res);
});

// 渲染模板，并传递三个数据
await ctx.render('sPost',{
    session:ctx.session,
    posts:res
})
});

//发表评论
router.post('/:postId',async (ctx,next)=>{
    var name=ctx.session.user;
    var content=ctx.request.body.content;
    var postId=ctx.params.postId;

    // 插入评论的用户名，内容和文章id
    await userModel.insertComment([name,content,postId]);
    // 先通过文章id查找，然后评论数+1
    await userModel.findDataById(postId)
        .then(result=>{
        res_comments=parseInt(JSON.parse(JSON.stringify(result))[0]['comments']);
        res_comments+=1;
    });
    // 更新评论数 res_comments
    await userModel.updatePostComment([res_comments,postId])
        .then(()=>{
        ctx.body='true';
    }).catch(()=>{
        ctx.body='false';
    });
});

//删除评论
router.get('/posts/:postId/comment/:commentId/remove',async (ctx,next)=>{

    var postId=ctx.params.postId
    var commentId=ctx.params.commentId
    await userModel.findDataById(postId)
        .then(result=>{
        res_comments=parseInt(JSON.parse(JSON.stringify(result))[0]['comments'])
        console.log('res',res_comments)
    res_comments-=1
console.log(res_comments)
})
await userModel.updatePostComment([res_comments,postId])
await userModel.deleteComment(commentId)
    .then(()=>{
    ctx.body={
    data:1
}
}).catch(()=>{
    ctx.body={
    data:2
}
})
});

//删除文章
router.get('/posts/:postId/remove',async (ctx,next)=>{

    var postId=ctx.params.postId;

    await userModel.deleteAllPostComment(postId);
    await userModel.deletePost(postId)
        .then(()=>{
        ctx.body={
        data:1
    }
}).catch(()=>{
    ctx.body={
    data:2
}
});

});

// get '/posts/:postId/edit'
router.get('/posts/:postId/edit',async (ctx,next)=>{
    var name=ctx.session.user;
    var postId=ctx.params.postId;

    await userModel.findDataById(postId)
        .then(result=>{
        res=JSON.parse(JSON.stringify(result));
        console.log('修改文章',res);
});
await ctx.render('edit',{
    session:ctx.session,
    posts:res
});
});
// post '/posts/:postId/edit'
router.post('/posts/:postId/edit',async (ctx,next)=>{
    var title=ctx.request.body.title;
    var content=ctx.request.body.content;
    var id=ctx.session.id;
    var postId=ctx.params.postId;

    await userModel.updatePost([title,content,postId])
        .then(()=>{
        ctx.body='true';
}).catch(()=>{
    ctx.body='false';
});
});

module.exports=router;