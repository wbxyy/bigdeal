// 引入express
const express = require('express')
// 引入文件操作
const {getDb,saveDb} = require('./db')
// 引入JwtToken
const {getToken,setToken} = require('./jwt')


const app = express()

//express Content-Type中间件
// app.use(express.json())
app.use(express.urlencoded())

//express的中间件函数
// 没有限制的中间件函数
app.use(function(request,response,next){
  response.setHeader('Access-Control-Allow-Origin','*')
  response.setHeader('Access-Control-Allow-Headers','*')
  next()
})

//有路由限制的中间件函数
// app.use('/',function(request,response,next){
//   next()
// })

//请求方法+路由限制的中间件函数
// app.all('/',(request,response)=>{
  
// })

//注册
app.post('/api/reguser',async (request,response)=>{
  try{
    // 分析比写代码更重要
    // 从db中取出用户数据，判断是否重复
    const db = await getDb()
    const user = db.user.find(item => item.username === request.body.username)
    if(user){
      return response.status(200).json({
        status:1,
        message:'用户名重复'
      })
    }
    //封装成json对象存储到db中
    //新userID
    const id = db.user.length ? db.user[db.user.length-1].id+1 : 1
    const item = {
      id,
      username:'',
      nickname:'',
      "email":'',
      "user_pic":''
    }
    Object.assign(item,request.body)
    db.user.push(item)

    // 存储db
    await saveDb(db)

    // 发送响应
    response.status(200).json({
      status:0,
      message:'注册成功'
    })
   
  }catch(e){
    console.log(e.message);
    response.status(500).json({
      error:e.message
    })
  }
})

//登录
app.post('/api/login',async (request,response)=>{
  // 分析比写代码更重要
  // 获取请求体中的用户名和密码
  // 从db中取出用户数据，判断密码是否正确
  const db = await getDb()
  const user = db.user.find(item=>item.username === request.body.username)
  if(!user){
    return response.json({
      status:1,
      message:'要登录的用户不存在'
    }) 
  }
  if(user.password !== request.body.password){
    return response.json({
      status:1,
      message:'密码错误'
    }) 
  }

  // 生成一个 token 并返回
  const token = await setToken(user.username,user.id)
  response.json({
    "status":0,
    "message":"登录成功",
    "token": token
  })
  
})

//获取用户基本信息
app.get('/my/userinfo',async (req,res)=>{
  try{
    console.log(req.header('Authorization'));

    // 解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    if(!info){
      return res.status(200).json({
        status:1,
        message:'token中没有info'
      })
    }
    
    // 处理
    const db = await getDb()
    const user = db.user.find(item=>item.username===info.user_name && item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'token中的info不适配'
      })
    }
    //响应
    res.status(200).json({
      status:0,
      message:'获取用户基本信息成功',
      data:user
    })
  }catch(e){
    res.status(200).json({
      status:1,
      message:e.message
    })
  }
})

app.all('/test',(request,response)=>{
  response.setHeader('Access-Control-Allow-Origin','*')
  console.log('TEST');
  let data = {
    message:'hello'
  }
  response.json(data)
})

app.listen(4000,()=>{
  console.log('大事件后台服务器已启动，正在监听4000.....');
})

