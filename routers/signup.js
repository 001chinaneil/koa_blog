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

/*
* 我们使用md5实现密码加密
  使用我们之前说的bodyParse来解析提交的数据，通过ctx.request.body得到
  我们引入了数据库的操作 findDataByName和insertData，因为之前我们在/lib/mysql.js中已经把他们写好，
  并暴露出来了。
  意思是先从数据库里面查找注册的用户名，如果找到了证明该用户名已经被注册过了，
  如果没有找到则使用insertData增加到数据库中
  ctx.body 是我们通过ajax提交之后给页面返回的数据，
  比如提交ajax成功之后msg.data=1的时候就代表用户存在，msg.data出现在后面的signup.ejs模板ajax请求中
* */