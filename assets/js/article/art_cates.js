

$(function(){
  getArticleList()
})

// 1.获取文章分类列表
function getArticleList(){
  $.ajax({
    method:'GET',
    url:'/my/article/cates',
    success:function(res){
      if(res.status !== 0){
        return layui.layer.msg(res.message)
      }
      layui.layer.msg(res.message)
      //模板解析器生成html结构
      const html = template('tbody_tmp',res)
      // 将结构append到tbody
      $('tbody').html(html)
    }
  })
}

// 2.新增文章分类
// 2.1 使用 layui.layer.open()打开 type 为 2 的页面层
// 2.2 使用 art-template 渲染页面层 add_tmp
// 2.3 页面层内有提交和重置按钮，提交按钮使用时间代理完成绑定
$(function(){
  // 分析比写代码更重要
  let index_add = -1
  $('.btn_add').click(function(){
    //使用script模板获取html结构
    index_add = layui.layer.open({
      type:1,
      title:'新增文章分类',
      content: $('#dialog_add').html(),
      area:['500px','250px']
    })
  })

  // 模态框内的新增按钮事件(事件代理)
  $('body').on('submit','#form_add',function(e){
    e.preventDefault();
    console.log('ok');
    //获取新增表单数据
    const data = $('#form_add').serialize()
    console.log(data);
    //发起新增请求
    $.ajax({
      method:'post',
      url:'/my/article/cates',
      data,
      success:function(res){
        if(res.status !==0){
          return layui.layer.msg(res.message)
        }
        layui.layer.msg(res.message)
        layui.layer.close(index_add)
        getArticleList()
      }
    })
  })
})

// 3.编辑文章分类
// 3.1 使用 layui.layer.open() 打开 type 为 2 的页面层
// 3.2 使用 art-template 渲染页面层 edit_temp
$(function(){
  let index_edit = -1
  $('tbody').on('click','.btn_edit',function(){
    //调用接口获取文章类别数据
    const id = $(this).attr('data-id')
    $.ajax({
      method:'get',
      url:`/my/article/cates/${id}`,
      success:function(res){
        if(res.status!==0){
          return layui.layer.msg(res.message)
        }
        layui.layer.msg(res.message)
        //生成模板
        const html = template('dialog_edit',res)
        index_edit = layui.layer.open({
          type:1,
          title:'编辑文章分类',
          content: html,
          area:['500px','250px']
        })
      }
    })
  })

  //代理绑定submit事件
  $('body').on('submit','#form_edit',function(e){
    e.preventDefault()
    //获取表单数据，发起请求
    const id = $('#form_edit [name=id]').val()
    $.ajax({
      method:'put',
      url:`/my/article/cates/${id}`,
      data:$(this).serialize(),
      success:function(res){
        if(res.status!==0){
          return layui.layer.msg(res.message)
        }
        layui.layer.msg(res.message)
        layui.layer.close(index_edit)
        getArticleList()
      }
    })
  })

  //重置按钮
  $('body').on('click','#edit_reset',function(e){
    e.preventDefault()
    const id = $('#form_edit [name=id]').val()
    $.ajax({
      method:'get',
      url:`/my/article/cates/${id}`,
      success:function(res){
        if(res.status!==0){
          return layui.layer.msg(res.message)
        }
        layui.layer.msg(res.message)
        layui.form.val('form_edit',res.data)
      }
    })
  })
})

// 4.删除文章分类
$(function(){
   
  $('tbody').on('click','.btn_del',function(){
    console.log(this);
    const id = $(this).attr('data-id')
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      //do something
      $.ajax({
        method:'delete',
        url:`/my/article/cates/${id}`,
        success:function(res){
          if(res.status!==0){
            return layui.layer.msg(res.message)
          }
          layui.layer.msg(res.message)
          getArticleList()
          layer.close(index);
        }
      })
    });
  })
})

