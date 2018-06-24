var router = require('koa-router')();
// 处理数据库（之前已经写好，在mysql.js）
var userModel = require('../lib/mysql.js');
// 加密
var md5 = require('md5');

//返回模板文件
router.get('/signup',async (ctx,next)=>{
    await ctx.render('signup',{
        session:ctx.session,
    });
});

// POST '/signup' 注册页 这是接口
router.post('/signup',async (ctx,next)=>{
    console.log(ctx.request.body);
    var user={
        name:ctx.request.body.name,
        pass:ctx.request.body.password,
        repeatpass:ctx.request.body.repeatpass
    }
    await userModel.findDataByName(user.name)
        .then(result=>{
        // var res=JSON.parse(JSON.stringify(reslut))
        console.log(result);

        if (result.length){
            try {
                throw Error('用户存在');
            }catch (error){
                //处理err
                console.log(error);
            }
            ctx.body = {
                data:1
            };
        }else if (user.pass!==user.repeatpass || user.pass==''){
            ctx.body={
                data:2
            };
        }else{
            ctx.body={
                data:3
            };
            console.log('注册成功');
            // ctx.session.user=ctx.request.body.name
            //把用户名和加密的密码存储到数据库中
            userModel.insertData([ctx.request.body.name,md5(ctx.request.body.password)]);
        }
    });

});


module.exports = router;