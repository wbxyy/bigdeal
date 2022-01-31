const express = require('express')
const Joi = require('joi')
const cors = require('cors')
const app = express()
//映射静态资源路径
app.use('/upload',express.static('./upload'))
//配置cors跨域
app.use(cors())
//全局中间件封装 res.cc 函数
app.use((req,res,next)=>{
  res.cc = function(err,status=1){
    return res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 解析请求体中间件 urlencoded
app.use(express.urlencoded({extended:false}))

// 解析 jwt token 中间件 express-jwt
const expressJWT = require('express-jwt')
const {JwtSecretKey} = require('./config')
app.use(expressJWT({secret:JwtSecretKey,algorithms:['HS256']}).unless({path:/^\/api/}))



// 导入 userRouter
const userRouter = require('./router/user')
app.use('/api',userRouter)

// 导入 userInfoRouter
const userInfoRouter = require('./router/userInfo')
app.use('/my',userInfoRouter)

// 导入 articleCateRouter
const artCateRouter = require('./router/artcate')
app.use('/my/article',artCateRouter)

// 导入 articleRouter
const articleRouter = require('./router/article')
app.use('/my',articleRouter)





//全局错误处理中间件
app.use((err,req,res,next)=>{
  console.log(err);
  
  // 捕获数据验证失败的错误
  if(err instanceof Joi.ValidationError) return res.cc(err)

  // 捕获身份验证失败的错误
  if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  
  // 未知错误
  res.cc(err)
})



app.listen(4000,()=>{
  console.log('大事件后台服务器升级版已开启，listen in 4000...');
})