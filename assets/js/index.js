$(function(){
  getUserInfo()

  $('.logout').click(function(){
    layui.layer.confirm('你确定要退出登录吗?',{icon:3,title:'提示'},function(index){
      localStorage.removeItem('token')
      location.href = './login.html'
      layui.layer.close(index)
    })
  })
})

function getUserInfo(){
  $.ajax({
    method:'get',
    url:'/my/userinfo',
    // headers已经用$.ajaxPrefilter添加，需要手动引入哦
    // headers:{
    //   "Authorization": localStorage.getItem('token') || ''
    // },
    success:function(res){
      if(res.status !== 0){
        return layui.layer.msg(res.message)
      }
      renderAvatar(res.data)
    }
  })
}

//渲染用户头像区
function renderAvatar(userInfo){
  // 找出用户头像区，里面的span显示昵称或者用户名
  // 如果有用户头像就显示，没有则显示文字头像，用首字母
  const name = userInfo.nickname || userInfo.username
  $('#welcome').html(`欢迎你&nbsp;&nbsp;${name}`)
  
  if(userInfo.user_pic){
    $('.user_info img').prop('src',userInfo.user_pic).show()
    $('.user_info .text_avatar').hide()
  }else{
    $('.user_info img').hide()
    $('.user_info .text_avatar').html(name[0].toUpperCase()).show()
  }
}

