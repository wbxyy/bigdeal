$(function(){
  //校验表单
  layui.form.verify({
    pwd:function(value,item){
      if(!/^\S{6,12}$/.test(value)){
        return '密码必须6-12位'
      }
      // if(!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])\S+$/.test(value)){
      //   return '密码必须包含大小写，数字，不能有空格'
      // }
    },
    newpwd:function(value){
      if(value === $('[name=oldPwd]').val()){
        return '新密码不能和旧密码相同'
      }
    },
    repwd:function(value){
      if(value !== $('[name=newPwd]').val()){
        return '两次输入的密码不一致'
      }
    }
  })

  //提交修改
  $('#passwordForm').submit(function(e){
    e.preventDefault();
    const data = $('[lay-filter=formPassword]').serialize()
    console.log(data);
    $.ajax({
      method:'post',
      url:'/my/password',
      data,
      success:function(res){
        if(res.status !==0){
          return layui.layer.msg(res.message)
        }
        layui.layer.msg(res.message)
        $('#btnReset').click()
      }
    })
  })
})