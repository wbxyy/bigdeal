const joi = require('joi')

const id = joi.number().integer().min(1).required()
const name = joi.string().min(1).max(10).required()
const alias = joi.string().alphanum().min(1).max(10).required()

// 验证规则对象 - 新增分类
exports.add_cate_schema = {
  body:{
    name,
    alias
  }
}

// 验证规则对象 -  根据 id 修改分类
exports.update_cate_schema = {
  
  body:{
    name,
    alias
  },
  params:{
    id
  }
}

// 验证规则对象 - 根据 id 删除分类
exports.delete_cate_schema = {
  params:{
    id
  }
}

// 验证规则对象 -  根据 id 获取分类
exports.get_cate_schema = {
  params:{
    id
  }
}