var router=require('koa-router')();

// get '/signin'登录页面
router.get('/signin',async (ctx,next)=>{
    await ctx.render('signin',{
        session:ctx.session,
    })
})
module.exports=router