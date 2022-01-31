const express = require('express')
const router = express.Router()
const expressJoi = require('@escook/express-joi')
const {update_userinfo_schema,update_password_schema,update_avatar_schema}  = require('../schema/user')
const userInfoHandler = require('../router_handler/userInfo')
// 获取用户信息
router.get('/userinfo',userInfoHandler.getUserInfo)
// 更新用户信息
router.post('/userinfo',expressJoi(update_userinfo_schema),userInfoHandler.updateUserInfo)
//更新密码
router.post('/password',expressJoi(update_password_schema),userInfoHandler.updatePassword)
//更新头像
router.post('/update/avatar',expressJoi(update_avatar_schema),userInfoHandler.updateAvatar)

module.exports = router