const joi = require('joi')

const username = joi.string().alphanum().min(1).max(20).required()
const password = joi.string().pattern(/^[\S]{6,12}/).required()
//const id = joi.number().integer().min(1).required()
const email = joi.string().email().required()
const nickname = joi.string().min(1).max(20).required()
const avatar = joi.string().dataUri().required()


exports.login_reg_schema = {
  body:{
    username,
    password
  }
}

exports.update_userinfo_schema = {
  body:{
    email,
    nickname
  }
}

exports.update_password_schema = {
  body:{
    oldPwd:password,
    newPwd:joi.not(joi.ref('oldPwd')).concat(password),
  }
}

exports.update_avatar_schema = {
  body:{
    avatar
  }
}

