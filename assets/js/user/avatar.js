$(function(){
  // 初始化截图操作区默认图片为当前头像的base64
  // const $img = window.parent.document.querySelector('.user_info img')
  // $('#avatar').attr('src',$img.src)

  // 初始化截图操作区默认图片为静态资源图片


  // 初始化cropper
  // 2.配置选项
  const options = {
    //纵横比
    aspectRatio: 1/1,
    //指定预览区域(类名):
    preview:'.preview',
    viewMode:2,
    zoomable:false
  }
  // 3.创建裁剪区域
  $('#avatar').cropper(options) 

  // 上传框change事件
  $('.btn_upload').click(function(){
    $('[type=file]').click()
  })


  // 触发上传按钮cilck事件
  $('[type=file]').change(function(e){
    if(e.target.files.length<1){
      return layui.layer.msg('请选择文件')
    }

    const file = e.target.files[0]  

    //生成图片url

    const imgURL = URL.createObjectURL(file)
    //重置cropper为选中的图片
    $('#avatar').cropper('destroy').attr('src',imgURL).cropper(options)
  })

  //确定上传绑定click事件
  $('.btn_confirm').click(function(){
    const dataURL = $('#avatar').cropper('getCroppedCanvas',{
      //创建一个canvas画布
      width:100,
      height:100
    }).toDataURL('img/png')

    $.ajax({
      method:'post',
      url:'/my/update/avatar',
      data:{
        avatar:dataURL
      },
      success:function(res){
        if(res.status !== 0){
          return layui.layer.msg(res.message)
        }
        layui.layer.msg(res.message)
        window.parent.getUserInfo()
      }
    })
  })
  

})