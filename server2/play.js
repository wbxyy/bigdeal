//{a:{b:1,c:2}} => {"a.b":1,"a.c":2}
const flatObject = function getValue(obj){
  // 分析比写代码更重要
  // 通过对象遍历，对每个属性进行遍历，如果得到了对象，则递归调用，如果得到了值则返回
  // 结果得到所有对象的值

  // 通过对象遍历，对每个属性进行遍历，如果得到了对象，则记录当前的key，递归调用，如果得到了值，则返回，每次返回都做字符串拼接
  // 结果得到所有属性的.运算符表达
  
  
}

function getValue(obj){
  let arr = []
  if(typeof obj === 'object'){
    let temp
    for(let key in obj){
      arr.push(key)
      temp = getValue(obj[key])
      console.log(key);
    }
    return [...arr,...temp]
  }else{
    return []
  }
}



const obj = {
  a:{
    b:1,
    c:{
      d:1,
      e:2
    }
  }
}

let result = getValue(obj)
console.log(result);


