const joi = require('joi')



const id = joi.number().min(1).required()
const title = joi.string().min(1).max(20).required()
const content = joi.string().max(10000).required().allow('')


;(function(){
  const pagenum = joi.number().integer().min(1).required()
  const pagesize = joi.number().integer().min(1).max(100).required()
  const cate_id = joi.number().integer().min(1).required().allow('')
  const state = joi.string().valid('已发布','草稿').required().allow('')

  //? 校验规则对象 - 获取文章列表
  exports.show_article_schema = {
    query:{
      pagenum,
      pagesize,
      cate_id,
      state
    }
  }
})()



;(function(){
  const cate_id = joi.number().integer().min(1).required()
  const state = joi.string().valid('已发布','草稿').required()

  //? 校验规则对象 - 添加文章
  exports.add_article_schema = {
    body:{
      title,
      cate_id,
      content,
      state,
    }
  }

  //? 校验规则对象 - 编辑文章
  exports.edit_article_schema = {
    body:{
      title,
      cate_id,
      content,
      state,
    },
    params:{
      id
    }
  }
})()

//? 校验规则对象 - 删除文章
exports.delete_article_schema = {
  params:{
    id
  }
}

//? 校验规则对象 - 根据 id 获取文章
exports.get_article_schema = {
  params:{
    id
  }
}

