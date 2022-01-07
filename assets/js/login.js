$(function(){

  // 切换登录和注册表单
  $('.to_register').click(function(){
    $('.register').show()
    $('.login').hide()
  })
  $('.to_login').click(function(){
    $('.register').hide()
    $('.login').show()
  })

  // 添加校验
  // 密码是6-12位，不含空格，需要包含大小写和数字
  // 用户名字母开头，5-10位
  layui.form.verify({
    pwd:function(value,item){
      if(!/^\S{6,12}$/.test(value)){
        return '密码必须6-12位'
      }
      if(!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])\S+$/.test(value)){
        return '密码必须包含大小写，数字，不能有空格'
      }
    },
    repwd:function(value,item){
      //通过选择器拿到密码框的值，然后进行比较是否一致
      let pwd = $('.register [name=password]').val()
      if(pwd !== value){
        return '两次输入的密码不一致'
      }
    },
    uname:function(value,item){
      if(!/\S{5,10}/.test(value)){
        return '用户必须5-10位'
      }
      if(!/^[A-z].*$/.test(value)){
        return '用户名必须以字母开头'
      }
    }
  })

  //为form添加submit事件，发送ajax请求
  //注册事件
  $('#register_form').on('submit',function(e){
    e.preventDefault();
    const data = {
      username:$('.register [name=username]').val(),
      password:$('.register [name=password]').val(),
    }
   
    $.ajax({
      method:'POST',
      url:'http://localhost:4000/api/reguser',
      // url:'http://localhost:4000/test',
      data:data,
      success:function(res){
        if(res.status !== 0){
          return layui.layer.msg(res.message)
        }
        return layui.layer.msg(res.message)
        
      }
    })

   
  })

  //登录事件
  $('#login_form').submit(function(e){
    e.preventDefault()
    const data = $(this).serialize()
    $.ajax({
      method:'POST',
      url:'http://localhost:4000/api/login',
      data,
      success:function(res){
        if(res.status !== 0){
          return layui.layer.msg(res.message) 
        }
        localStorage.setItem('token',res.token)
        layui.layer.msg(res.message)
      }
    })
  })

})