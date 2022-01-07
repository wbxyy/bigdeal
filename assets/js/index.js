$(function(){
  getUserInfo()
})

function getUserInfo(){
  $.ajax({
    method:'get',
    url:'http://localhost:4000/my/userinfo',
    headers:{
      "Authorization": localStorage.getItem('token') || ''
    },
    success:function(res){
       console.log(res);
    }
  })
}

