const express = require('express')
const expressJoi = require('@escook/express-joi')

const {login_reg_schema} = require('../schema/user')

const router = express.Router()

const userHandler = require('../router_handler/user')
console.log(userHandler);
// 登录

router.post('/login',expressJoi(login_reg_schema),userHandler.login)

// 注册
router.post('/reguser',expressJoi(login_reg_schema),userHandler.regUser)


module.exports = router