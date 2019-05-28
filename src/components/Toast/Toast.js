import Vue from 'vue';
import Toast from './Toast.vue';

let ToastConstructor  = Vue.extend(Toast); // 返回一个“扩展实例构造器”

let myToast=(title,content,confirmButtonText,cancelButtonText,imgs)=>{

  let toastDom=new ToastConstructor({
    el:document.createElement('div') //将toast组件挂载到新创建的div上
  });

  document.body.appendChild(toastDom.$el) ;//把toast组件的dom添加到body里


  toastDom.title=title;
  toastDom.content=content;
  toastDom.confirmButtonText=confirmButtonText;
  toastDom.cancelButtonText=cancelButtonText;
  toastDom.imgs=imgs || false;

  return new Promise((resolve, reject) => {
    document.getElementById('alertbutton1').onclick=function () {
      toastDom.isShow=false;
      document.body.removeChild(toastDom.$el)
      resolve()
    };

    document.getElementById('alertbutton').onclick=function () {
      toastDom.isShow=false;
      document.body.removeChild(toastDom.$el)
      reject()
    };
  })
};

export  default myToast
