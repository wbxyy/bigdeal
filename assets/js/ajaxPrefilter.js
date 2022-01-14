//这是 jq 的 ajax 前置拦截器，可以拦截 options 配置对象并作出修改
$.ajaxPrefilter(function(config){
  if(!/http:\/\//.test(config.url)){
    config.url = `http://localhost:4000` + config.url  
  }
  
  // 如果 url 中包含了 /my 则需要在请求头中添加 token
  if(config.url.indexOf('/my/') !== -1){
    config.headers = {
      "Authorization":localStorage.getItem('token') || ''
    }

    config.complete = function(xhr){
      // console.log(xhr);
      // if(xhr.responseJSON.status !== 0){
      //   localStorage.removeItem('token')
      //   location.href = '/login.html'
      // } 
    }
  }

  
})