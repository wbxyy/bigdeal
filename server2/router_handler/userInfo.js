const {query,db} = require('../db/index')
const bcrypt = require('bcryptjs')
//获取用户基本信息的处理函数
exports.getUserInfo = async(req,res)=>{
  let user = null
  {
    const sql = 'select id,username,nickname,email,user_pic from ev_users where id = ?'
    const results = await query(sql,req.user.id)
    if(results.length !== 1) return res.cc('用户信息获取失败')
    user = results[0]
  }

  res.send({
    status:0,
    message:'用户信息获取成功',
    data:user
  })
  
}

//更新用户基本信息的处理函数
exports.updateUserInfo = async(req,res)=>{
  {
    const sql = 'update ev_users set ? where id = ?'
    const results = await query(sql,[req.body,req.user.id])
    if(results.affectedRows !== 1) return res.cc('用户信息更新失败')
  }

  res.cc('用户信息更新成功',0)

}
//更新密码的处理函数
exports.updatePassword = async(req,res)=>{
  {
    const sql = 'select * from ev_users where id = ?'
    const results = await query(sql,req.user.id)
    if(results.length !== 1) return res.cc('获取用户信息失败')
    const compareResult = bcrypt.compareSync(req.body.oldPwd,results[0].password)
    if(!compareResult) return res.cc('原密码输入有误')
  }

  const newPwd = bcrypt.hashSync(req.body.newPwd,10)

  {
    const sql = 'update ev_users set password = ? where id = ?'
    const results = await query(sql,[newPwd,req.user.id])
    if(results.affectedRows !== 1) return res.cc('用户密码更新失败')
  }

  res.cc('用户密码更新成功',0)
}
//更新用户头像的处理函数
exports.updateAvatar = async(req,res)=>{
  {
    const sql = 'update ev_users set user_pic = ? where id = ?'
    const results = await query(sql,[req.body.avatar,req.user.id])
    if(results.affectedRows !== 1) return res.cc('用户头像更新失败')
  }
  res.cc('用户头像更新成功',0)
}