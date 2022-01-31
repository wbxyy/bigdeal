const {db,query} = require('../db/index')
// 获取文章类别的处理函数
exports.getArtcateCates = async(req,res)=>{
  {
    const sql = 'select * from ev_article_cate where is_delete = 0 order by id asc'
    const results = await query(sql)
    res.send({
      status:0,
      message:'获取文章分类列表成功',
      data:results
    })
  }
}
// 新增文章类别的处理函数
exports.addArtcateCate = async(req,res)=>{
  // 判断文章类别的名称和别名是否重复
  {
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    const results = await query(sql,[req.body.name,req.body.alias])
    if(results.length === 2) return res.cc('分类名称被占用、分类别名被占用')
    if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称被占用、分类别名被占用')
    if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用')
    if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用')
    
  }
  {
    const sql = 'insert into ev_article_cate set ?'
    const results = await query(sql, [req.body])
    if(results.affectedRows !==1) return res.cc('新增文章分类失败')
    res.cc('新增文章分类成功',0)
  }
}
// 根据 id 修改文章分类的处理函数
exports.updateCateById = async(req,res)=>{
   // 判断文章类别的名称和别名是否重复
  {
    const sql = 'select * from ev_article_cate where id <> ? and (name=? or alias=?)'
    const results = await query(sql,[req.params.id,req.body.name,req.body.alias])
    if(results.length === 2) return res.cc('分类名称被占用、分类别名被占用')
    if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称被占用、分类别名被占用')
    if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用')
    if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用')
    
  }
  {
    const sql = 'update ev_article_cate set ? where id = ?'
    const results = await query(sql, [req.body,req.params.id])
    if(results.affectedRows !== 1) return res.cc('更新文章分类失败')
    res.cc('更新文章分类成功',0)
  }
}
// 根据 id 删除文章分类的处理函数
exports.deleteCateById = async(req,res)=>{
  {
    const sql = 'update ev_article_cate set is_delete = 1 where id = ?'
    const results = await query(sql, req.params.id)
    if(results.affectedRows !== 1) return res.cc('删除文章分类失败')
    res.cc('删除文章分类成功',0)
  }
}
// 根据 id 获取文章分类的处理函数
exports.getArtCateById = async(req,res)=>{
  {
    const sql = 'select * from ev_article_cate where id = ?'
    const results = await query(sql, req.params.id)
    if(results.length !== 1) return res.cc('获取文章分类失败')
    res.send({
      status:0,
      message:'获取文章分类 成功',
      data:results[0]
    })
  }
}