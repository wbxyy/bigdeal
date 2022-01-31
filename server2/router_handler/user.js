const {db,query} = require('../db/index')

//导入密码加密模块
const bcrypt = require('bcryptjs')
//导入jwt生成模块
const jwt = require('jsonwebtoken')
//导入配置模块
const config = require('../config')

exports.regUser = async (req,res)=>{
  //1.数据校验（使用joi中间件完成）
  //2.用户重复
  //3.加密处理
  //4.插入数据

  //判断用户是否重复
  {
    const sql = `select * from ev_users where username = ?`
    const results = await query(sql,req.body.username)
    if(results.length > 0) return res.cc('用户名重复，请重新选择')
  }
  
  
  //将用户密码加密处理
  req.body.password = bcrypt.hashSync(req.body.password,10)
  
  //插入数据
  {
    const sql = `insert into ev_users set ?`
    const results = await query(sql,req.body)
    if(results.affectedRows !== 1) return res.cc('用户注册失败')
  }
  
  res.cc('用户注册成功',0)
  
}

exports.login = async (req,res)=>{
  //数据校验
  //查询用户
  //对比密码
  //生成token

  //查询用户数据
  let user = null
  {
    const sql = `select * from ev_users where username = ?`
    const results = await query(sql,req.body.username)
    if(results.length !== 1) return res.cc('用户名不存在')
    //比对用户密码
    let compareResult = bcrypt.compareSync(req.body.password,results[0].password)
    if(!compareResult) return res.cc('密码错误，请重新输入')
    user = {...results[0],password:'',user_pic:''}          
  }
  
  
  //生成token
  let token = jwt.sign(user,config.JwtSecretKey,{expiresIn:'10h'})
  
  res.send({
    status:0,
    message:'登录成功',
    token:`Bearer ${token}`
  })
}





