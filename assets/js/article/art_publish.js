//挂载富文本
initEditor('[name=content]')
// 页面初始化
$(function(){
  getArticleCate()
})

//根据id获取文章
function getArticle(id){
  $.ajax({})
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
      const htmlstr = template('tmp-cate',res)
      $('[name=cate_id]').html(htmlstr)
      layui.form.render()
    }
  })
}

//发布文章：封面裁剪/formData构造
$(function(){
  // 初始化cropper

  // 1.获取元素
  const $img = $('#cover')
  // 2.配置选项
  const options = {
    //纵横比
    aspectRatio: 1/1,
    //指定预览区域(类名)
    preview:'.preview',
    viewMode:2
  }

  // 3.创建裁剪区域
  $img.cropper(options) 

  // 上传按钮
  $('.btn_upload').click(function(){
    $('[type=file]').click()
  })

  // 上传框change事件
  $('[type=file]').on('change',function(e){
    const files = e.target.files
    if(files.length<1){
      return layui.layer.msg('请选择文件再上传')
    }
    imgURL = URL.createObjectURL(files[0])
    
    $img.cropper('destroy').attr('src',imgURL).cropper(options)
  })

  // 文章状态state
  let state = '已发布'
 
  $('#submit2').on('click',function(){
    state = '草稿'
  })

  // 绑定表单提交事件
  $('#form_pub').on('submit',function(e){
    e.preventDefault();

    //创建FormData对象
    let fd = new FormData($(this)[0])

    //添加文章状态
    fd.append('state',state)

    //添加封面图片
    $img.cropper('getCroppedCanvas',{
      width:280,
      height:180
    }).toBlob(function(blob){
      fd.append('cover_img',blob)
      //发送新增文章请求
      addArticle(fd)
    })
  })
})

function addArticle(fd){
  $.ajax({
    method:'post',
    url:'/my/article',
    data:fd,
    //jq发送FormData时必须指定以下2个属性，让jq不对数据做任何处理
    contentType:false,
    processData:false,
    success:function(res){
      if(res.status!==0){
        return layui.layer.msg(res.message)
      }
      layui.layer.msg(res.message)
      location.href = './art_list.html'
    }
  })
}



