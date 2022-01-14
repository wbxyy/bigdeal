//分析比写代码更重要
//文章列表页所需要的第三方插件：jquery,layui
//文章列表页所需配置：jq-ajaxPrefilter

// 所需接口：获取文章列表接口、获取文章类别接口

//文章列表页的组成：筛选区、列表区、分页区
// 请求文章列表的请求参数：页行数 pagesize / 页码 pagenum / 文章状态 status / 文章类别 cate_id

// 筛选区
// 表单结构，由 2 个下拉框，配 1 个提交按钮
// 注意：使用模板引擎渲染下拉框时，需要通过 layui.form.render() 触发重新渲染
// 2 个下拉框提供的请求配置参数：status,cate_id
// 提交按钮阻止默认提交事件，请求获取文章列表接口，在回调函数中生成tbody，渲染到列表区

// 列表区
// 修改表头的文本，表头的宽度（第一列自适应，其他固定宽度）
// 使用 script 标签提供 tbody 的文档模板

// 分页区
// 在 body 中设置挂载点，通过 layui.laypage.render() 渲染分页区
// 配置对象传入：total,pagesize,current
const q = {
  pagenum:1,
  pagesize:2,
  state:'',
  cate_id:''
}

function dateFormat(timestamp){
  const date = new Date(timestamp)
  const yyyy = date.getFullYear()
  const MM = padZero(date.getMonth()+1)
  const dd = padZero(date.getDate())
  const hh = padZero(date.getHours())
  const mm = padZero(date.getMinutes())
  const ss = padZero(date.getSeconds())

  function padZero(value){
    return value > 9 ? value : '0' + value
  }

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`
}

template.defaults.imports.dateFormat = dateFormat



//获取文章列表
function getArticleList(){
  $.ajax({
    method:'get',
    url:'/my/article',
    data:q,
    success:function(res){
      if(res.status !== 0){
        return layui.layer.msg(res.message)
      }
      layui.layer.msg(res.message)
      const htmlstr = template('tmp_tbody',res)
      $('tbody').html(htmlstr)

      //渲染分页栏
      renderPagination(res.total)
    }
  })
}

//获取文章类别
function getArticleCate(){
  $.ajax({
    method:'get',
    url:'/my/article/cates',
    success:function(res){
      if(res.status !== 0){
        return layui.layer.msg(res.message)
      }
      layui.layer.msg(res.message)
      const htmlstr = template('tmp_select',res)
      $('[name=cate_id]').html(htmlstr)
      layui.form.render()
    }
  })
}

//渲染分页栏
function renderPagination(total){
  layui.laypage.render({
    elem: 'pagination', //注意，这里的 test1 是 ID，不用加 # 号
    count: total, //数据总数，从服务端得到
    curr: q.pagenum,
    limit: q.pagesize,
    limits:[2,5,10,15],
    layout:['count','limit','prev','page','next','skip'],
    
    jump:function(obj,first){
      q.pagenum = obj.curr
      q.pagesize = obj.limit
      if(!first){
        getArticleList()
      }
    }
  });
}

//页面初始化
$(function(){
  getArticleList()
  getArticleCate()
})

//筛选事件
$(function(){
  $('#search_form').submit(function(e){
    e.preventDefault();
    q.state = $('[name=state]').val()
    q.cate_id = $('[name=cate_id]').val()
    q.pagenum = 1
    getArticleList()
  })
})

//根据id删除文章
$(function(){
  $('body').on('click','.del_btn',function(){
    const id = $(this).attr('data-id')
    //获取当前页还剩多少条数据
    const len = $('.del_btn').length
    layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method:'delete',
        url:`/my/article/${id}`,
        success:function(res){
          if(res.status !== 0){
            return layui.layer.msg(res.message)
          }
          layui.layer.msg(res.message)

          //删除后要判断当前页码是否还有元素，如果没有则页码-1
          if(len === 1){
            q.pagenum  = q.pagenum > 1 ? q.pagenum - 1 : 1  
          }
          getArticleList()
          layer.close(index);
        }
      })
    });
  })
})

//点击编辑按钮跳转到编辑页并携带id
$(function(){
  $('body').on('click','.edit_btn',function(){
    const id = $(this).attr('data-id')
    //http://localhost:8080/article/art_publish/id
    console.log(location.href);
    const match = /(?<host>https?:\/\/.+?)\//g.exec(location.href)
    let host = match.groups.host
    let url = `${host}/article/art_edit.html?id=${id}`

    //分析比写代码更重要
    // 使用window.parent获取父窗口
    // 在父窗口中获取iframe实例，然后修改iframe的src属性
    console.log(url);

    window.parent.document.querySelector('[name=fm]').src = url
  })
})





