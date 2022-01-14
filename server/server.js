// 引入express
const express = require('express')
// 引入文件操作
const {getDb,saveDb} = require('./db')
// 引入JwtToken
const {getToken,setToken} = require('./jwt')
// formdata中间件
const multipart = require('connect-multiparty');
const multipartyMiddleware = multipart();



const app = express()

//express Content-Type中间件
// app.use(express.json())
app.use(express.urlencoded())



//express的中间件函数
// 没有限制的中间件函数
app.use(function(request,response,next){
  response.setHeader('Access-Control-Allow-Origin','*')
  response.setHeader('Access-Control-Allow-Headers','*')
  response.setHeader('Access-Control-Allow-Methods','*')
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
    // console.log(req.header('Authorization'));

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
        message:'token中的info保留的用户信息不存在'
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

app.post('/my/userinfo',async (req,res)=>{
  try{
    req.body.id = Number.parseInt(req.body.id)
    const db = await getDb()
    let user = db.user.find(item => item.id === req.body.id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'修改用户信息失败，无法找到该用户'
      })
    }
    Object.assign(user,req.body)
    await saveDb(db)
    res.status(200).json({
      status:0,
      message:'修改用户信息成功',
      data:user
    })
  }catch(err){
    res.status(200).json({
      status:1,
      message:err.message
    })
  }
})

app.post('/my/password',async (req,res)=>{
  try{
    // 解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    if(!info){
      return res.status(200).json({
        status:1,
        message:'token中没有info'
      })
    }

    //处理
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'token中的info保留的用户信息不存在'
      })
    }

    if(user.password !== req.body.oldPwd){
      return res.status(200).json({
        status:1,
        message:'原密码输入不正确'
      })
    }
    //delete req.body?.repeatPwd
    user.password = req.body.newPwd;

    await saveDb(db)
    
    //响应

    res.status(200).json({
      status:0,
      message:'修改密码成功'
    })

  }catch(err){
    res.status(200).json({
      status:1,
      message:err.message
    })
  }
})

app.post('/my/update/avatar',async (req,res)=>{
  try{
    //解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    //处理
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }
    user.user_pic = req.body.avatar
    await saveDb(db)
    //响应
    res.status(200).json({
      status:0,
      message:'更换用户头像成功'
    })
  }catch(err){
    res.status(200).json({
      error:err.message
    })
  }
})

//获取文章类别列表
app.get('/my/article/cates',async (req,res)=>{
  try{
    // 解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }
    // 处理
    const total = db.art_cates.length
    const data = db.art_cates
    //响应
    res.status(200).json({
      status:0,
      message:'获取文章列表成功',
      data,
      total
    })
  }catch(err){
    res.status(200).json({
      error:err.message
    })
  }
})

// 根据id获取文章类别
app.get('/my/article/cates/:id',async (req,res)=>{
  try{
    // 解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }
    //处理
    console.log(Number.parseInt(req.params.id));
    const artCate = db.art_cates.find(item => item.id === Number.parseInt(req.params.id))
    if(!artCate){
      return res.status(200).json({
        status:0,
        message:'获取文章失败，没有该id对应的文章'
      })
    }
    console.log(artCate);
    res.status(200).json({
      status:0,
      message:'获取文章成功',
      data:artCate
    })

  }catch(err){
    res.status(200).json({
      error:err.message
    })
  }
})

// 添加文章
app.post('/my/article/cates',async (req,res)=>{
  try{
    console.log('新增文章类型');
    // 解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }
    // 处理
    if(!req.body.name){
      return res.status(200).json({
        status:1,
        message:'The article category name is required !!'
      })
    }
    if(!req.body.alias){
      return res.status(200).json({
        status:1,
        message:'The article category alias is required !!'
      })
    }
    // 新增的id
    const arrLength = db.art_cates.length
    const id = arrLength > 0 ? db.art_cates[arrLength - 1].id + 1 : 1
    const cateItem = {
      id,
      name:req.body.name,
      alias:req.body.alias,
      is_delete:0
    }
    db.art_cates.push(cateItem)
    await saveDb(db)
    //响应
    res.status(200).json({
      status:0,
      message:'新增文章分类成功',
    })

  }catch(err){
    res.status(200).json({
      error:err.message
    })
  }
})

//根据id修改文章类别
app.put('/my/article/cates/:id',async (req,res)=>{
  try{
    //解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }

    //处理
    const art_cate = db.art_cates.find(item => item.id === Number.parseInt(req.params.id))
    if(!art_cate){
      return res.status(200).json({
        status:1,
        message:'文章类别修改失败，无法找到id对应的文章类别'
      })
    }
    req.body.id = Number.parseInt(req.body.id)
    Object.assign(art_cate,req.body)
    await saveDb(db)
    
    //响应
    res.json({
      status:0,
      message:'修改文章类别成功'
    })
  }catch(err){
    res.status(200).json({
      error:err.message
    })
  }
})

//根据id删除文章类别
app.delete('/my/article/cates/:id',async (req,res)=>{
  try{
     //解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }

    //处理
    const deleteIndex = db.art_cates.findIndex(item => item.id === Number.parseInt(req.params.id))
    if(deleteIndex===-1){
      return res.status(200).json({
        status:1,
        message:'删除失败，无法找到id对应的文章类别'
      })
    }
    db.art_cates.splice(deleteIndex,1)
    await saveDb(db)

    res.status(200).json({
      status:0,
      message:'删除文章类别成功'
    })
  }catch(err){
    res.status(200).json({
      error:err.message
    })
  }
})

// 获取文章列表
app.get('/my/article',async (req,res)=>{
  try{
    //解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }
    //处理
    const pagesize = Number.parseInt(req.query.pagesize)
    const pagenum = Number.parseInt(req.query.pagenum)
    const state = req.query.state
    const cate_id = Number.parseInt(req.query.cate_id)
    let art_list = db.art_list

    //筛选(status,cate_id) 
    art_list = art_list
    .filter(item => state? item.state === state : true)
    .filter(item => cate_id? item.cate_id === cate_id : true)

    const total = art_list.length
    
    //分页
    //起始下标：pagesize * (pagenum-1)
    //结束下标：pagesize * (pagenum-1) + pagesize -1
    const result = art_list.splice(pagesize*(pagenum-1),pagesize)
    

    //构造
    result.map(item => {
      const cate = db.art_cates.find(cate => item.cate_id === cate.id)
      return item.cate_name = cate.name
    })
 
    
    //响应
    res.status(200).json({
      status:0,
      message:'获取文章列表成功！',
      data:result,
      total
    })

  }catch(err){
    res.status(200).json({
      error:err.message
    })
  }
})

// 根据Id获取文章
app.get('/my/article/:id',async (req,res)=>{
  try{
    //解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }

    //处理
    const id = Number.parseInt(req.params.id)
    const article = db.art_list.find(item => item.id === id)
    if(!article){
      return res.status(200).json({
        status:1,
        message:'找不到id对应的文章'
      })
    }
    console.log(article);

    //响应
    res.status(200).json({
      status:0,
      message:'获取文章成功',
      data:article
    })
  }catch(err){
    res.status(200).json({
      error:err.message
    })
  }
})

// 根据id删除文章
app.delete('/my/article/:id',async (req,res)=>{
  try{
    //解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }

    //处理
    const id = Number.parseInt(req.params.id)
    const index = db.art_list.findIndex(item => item.id === id)
    if(index<0){
      return res.status(200).json({
        status:1,
        message:'找不到id指定的文章'
      })
    }
    db.art_list.splice(index,1)
    await saveDb(db)

    //响应
    res.status(200).json({
      status:0,
      message:'删除文章成功'
    })
  }catch(err){
    res.status(200).json({
      error:err.message
    })
  }
})

//添加文章
// multipartyMiddleware 是解析 FormData 的中间件
app.post('/my/article',multipartyMiddleware,async (req,res)=>{
  try{
    //解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }

    //去空 id转数字
    for(let k in req.body){
      //去除字符串前后空格
      if(typeof req.body[k] === 'string'){
        req.body[k] = req.body[k].trim()
      }
      //将id转换为number
      if(/id/g.test(k)){
        req.body[k] = Number.parseInt(req.body[k])
      }
    }

    //处理
    if(!req.body.title && !req.cate_id && !content && !state){
      return res.status(200).json({
        status:1,
        message:'提交信息不完整，title,cate_id,content,state都是必须值'
      })
    }

    //产生id
    const length = db.art_list.length
    const id = length > 0 ? db.art_list[length-1].id + 1 : 1
    //构造
    const article = {
      id,
      pub_date:+new Date(),
      ...req.files,
      ...req.body
    }
    db.art_list.push(article)
    await saveDb(db)

    //响应
    res.status(200).json({
      status:0,
      message:'新增文章成功！'
    })
  }catch(err){
    res.status(200).json({
      error:err.message
    })
  }
})

//修改文章
// multipartyMiddleware 是解析 FormData 的中间件
app.put('/my/article/:id',multipartyMiddleware,async (req,res)=>{
  try{
    //解析请求
    const token = req.header('Authorization')
    const info = await getToken(token)
    const db = await getDb()
    const user = db.user.find(item=>item.id === info.user_id)
    if(!user){
      return res.status(200).json({
        status:1,
        message:'用户认证失败'
      })
    }

    //去空 id转数字
    for(let k in req.body){
      //去除字符串前后空格
      if(typeof req.body[k] === 'string'){
        req.body[k] = req.body[k].trim()
      }
      //将id转换为number
      if(/id/g.test(k)){
        req.body[k] = Number.parseInt(req.body[k])
      }
    }

    //处理
    if(!req.body.title && !req.cate_id && !content && !state){
      return res.status(200).json({
        status:1,
        message:'提交信息不完整，title,cate_id,content,state都是必须值'
      })
    }

    //构造
    const id = Number.parseInt(req.params.id)
    const article = db.art_list.find(item => item.id === id)
    if(!article){
      return res.status(200).json({
        status:1,
        message:'无法找到id对应的文章'
      })
    }
    Object.assign(article,req.body,{
      ...req.files,
    })
    
    await saveDb(db)

    //响应
    res.status(200).json({
      status:0,
      message:'修改文章成功！'
    })
  }catch(err){
    res.status(200).json({
      error:err.message
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

