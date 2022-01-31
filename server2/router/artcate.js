const express = require('express')

const router = express.Router()

const articleHandler = require('../router_handler/artcate')

const expressJoi = require('@escook/express-joi')
const {add_cate_schema,delete_cate_schema,get_cate_schema,update_cate_schema} = require('../schema/artcate')
//获取文章分类的路由
router.get('/cates',articleHandler.getArtcateCates)
//新增文章分类的路由
router.post('/cates',expressJoi(add_cate_schema),articleHandler.addArtcateCate)
//根据 id 修改文章分类的路由
router.put('/cates/:id',expressJoi(update_cate_schema),articleHandler.updateCateById)
//根据 id 删除文章分类的路由
router.delete('/cates/:id',expressJoi(delete_cate_schema),articleHandler.deleteCateById)
//根据 id 获取文章分类的路由
router.get('/cates/:id',expressJoi(get_cate_schema),articleHandler.getArtCateById)


module.exports = router