const {db,query}  = require('../db/index')
const path = require('path')

//? 获取文章列表处理函数
exports.getArticles = async (req,res)=>{
  //判断限定条件 state 和 cate_id 是否为空
  const {pagesize,pagenum,state,cate_id} = req.query

  //如果没有限定 state 则使用以下sql语句得到 articleList
  let articleList = null
  if(state === ''){
    const sql = `select a.id as id, a.cate_id as cate_id, a.title as title,a.pub_date as pub_date, 
    b.name as cate_name,a.cover_img as cover_img, a.content as content, a.state as state 
    from ev_articles a left join ev_article_cate b on a.cate_id = b.id where a.is_delete = 0`
    articleList = await query(sql)
  }else{
    const sql = `select a.id as id,a.cate_id as cate_id, a.title as title,a.pub_date as pub_date, 
    b.name as cate_name,a.cover_img as cover_img, a.content as content, a.state as state 
    from ev_articles a left join ev_article_cate b on a.cate_id = b.id where a.state = ? and a.is_delete = 0`
    articleList = await query(sql,state)
  }
  console.log(articleList);
  console.log(typeof cate_id);
  
  //如果没有限定 artcate 则使用如下sql语句
  let result = null
  if(cate_id === ''){
    result = articleList
  }else{
    //筛选出符合的文章类别
    result = articleList.filter(item=>item.cate_id === cate_id)
  }

  let total = result.length

  //分页
  //初始位置：(pagenum-1)*pagesize
  //终末位置：(pagenum-1)*pagesize + pagesize -1
  
  result = result.splice((pagenum-1)*pagesize,pagesize)
 
  res.send({
    status:0,
    message:'获取文章列表成功',
    data:result,
    total
  })
  
}

//? 根据 id 获取文章处理函数
exports.getArticle = async (req,res)=>{
  {
    const sql = 'select * from ev_articles where id = ?'
    const results = await query(sql,req.params.id)
    if(results.length !== 1) return res.cc('根据 id 获取文章失败')
    res.send({
      status:0,
      message:'根据 id 获取文章成功',
      data:results[0]
    })
  }
}

//? 添加文章处理函数
exports.addArticles = async (req,res)=>{
  //手动校验上传的文件
  if(!req.file || req.file.fieldname !== 'cover_img') return res.cc('请选择文章封面')
  
  //构造插入的文章对象
  const article = {
    ...req.body,  
    pub_date:new Date(),
    author_id:req.user.id,
    cover_img:path.join('/upload',req.file.filename)
  }

  {
    const sql = 'insert into ev_articles set ?'
    const results = await query(sql,article)
    if(results.affectedRows !== 1) return res.cc('发布文章失败')
    return res.cc('发布文章成功',0)
  }
}

//? 根据 id 删除文章处理函数
exports.deleteArticle = async (req,res)=>{
  {
    const sql = 'update ev_articles set is_delete = 1 where id = ?'
    const results = await query(sql,req.params.id)
    if(results.affectedRows !== 1) return res.cc('删除文章失败')
    res.cc('删除文章成功',0)
  }
}

//? 根据 id 编辑文章处理函数
exports.editArticle = async (req,res)=>{
  //手动校验上传的文件
  if(!req.file || req.file.fieldname !== 'cover_img') return res.cc('请选择文章封面')
  
  //构造插入的文章对象
  const article = {
    ...req.body,  
    cover_img:path.join('/upload',req.file.filename)
  }

  {
    const sql = 'update ev_articles set ? where id = ?'
    const results = await query(sql,[article,req.params.id])
    if(results.affectedRows !== 1) return res.cc('编辑文章失败')
    res.cc('编辑文章成功',0)
  }
}