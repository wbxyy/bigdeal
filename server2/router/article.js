const path = require('path')
const express = require('express')
const router = express()

//导入处理 formData 中间件 multer
const multer = require('multer')
const upload = multer({dest:path.join(__dirname,'../upload')})
//导入校验数据中间件 express-joi
const expressJoi = require('@escook/express-joi')

//获取路由处理函数
const articleHandler = require('../router_handler/article')

//获取校验规则对象
const {show_article_schema, add_article_schema, delete_article_schema, edit_article_schema, get_article_schema} = require('../schema/article')

//获取文章列表路由
router.get('/article',expressJoi(show_article_schema),articleHandler.getArticles)

//根据 id 获取文章路由
router.get('/article/:id',expressJoi(get_article_schema),articleHandler.getArticle)

//添加文章路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/article',upload.single('cover_img'),expressJoi(add_article_schema),articleHandler.addArticles)

//删除文章路由
router.delete('/article/:id',expressJoi(delete_article_schema),articleHandler.deleteArticle)

//编辑文章路由
router.put('/article/:id',upload.single('cover_img'),expressJoi(edit_article_schema),articleHandler.editArticle)
module.exports = router