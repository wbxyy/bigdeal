$(function(){

  //表单校验
  layui.form.verify({
    nickname:function(val,item){
      if(val.length>12 || val.length<2){
        console.log(item);
        return '昵称长度为2-12个字符'
      }
    }
  })

  //获取用户数据
  initUserInfo()

  $('#btnReset').click(function(e){
    e.preventDefault();
    initUserInfo()
  })

  //修改用户信息
  $('#mybtnSubmit').click(function(e){
    e.preventDefault();
    //获取表单数据
    let data = $('[lay-filter=formUserInfo]').serialize()
    console.log(data);
    console.log(data);
    $.ajax({
      method:'post',
      url:'/my/userinfo',
      data,
      success:function(res){
        console.log(res);
        if(res.status !== 0){
          return layui.layer.msg(res.message)
        }
        layui.layer.msg(res.message)
        initUserInfo()
        //回填表单数据
        layui.form.val('formUserInfo',res.data)
        
      }
    })
  })

  // //表单回填
  // $.ajax({
  //   method:'get',
  //   url:'/my/userinfo',
  //   success:function(res){
  //     if(res.status !== 0){
  //       return layui.layer.msg('获取用户信息失败')
  //     }
  //     console.log(res);
      
  //   }
  // })
  
})

function initUserInfo(){
  $.ajax({
    method:'get',
    url:'/my/userinfo',
    success:function(res){
      if(res.status !== 0){
        return layui.layer.msg(res.message)
      }
      //回填表单数据
      layui.form.val('formUserInfo',res.data)
      window.parent.renderAvatar(res.data)
    }
  })
}

function updateUserInfo(){
 
  
}