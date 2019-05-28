import Vue from 'vue';
import alert from './alert.vue';

let AlertConstructor  = Vue.extend(alert); // 返回一个“扩展实例构造器”

let myAlert=(title,content)=>{

  let alertDom=new AlertConstructor({
    el:document.createElement('div') //将toast组件挂载到新创建的div上
  });

  document.body.appendChild(alertDom.$el) ;//把toast组件的dom添加到body里

  alertDom.title=title;
  alertDom.content=content;

};

export  default myAlert
