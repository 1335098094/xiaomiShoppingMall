import router from './router'
import store from './store'
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import alert from '@/components/alert/alert'
import axios from 'axios'
Vue.prototype.$alert=alert;
Vue.use(VueCookies);
const whiteList = ['/'];// 不重定向白名单
router.beforeEach((to, from, next) => {
  if($cookies.get('userId')){
    if (store.state.user.userId==='') {
      store.commit('SET_USERID',$cookies.get('userId'));
      store.commit('SET_NAME', $cookies.get('userName'));
      axios.get("/api-dev/users/getCartCount").then(res=>{
        var res = res.data;
        store.commit("SET_COUNT",res.result);
      });
    }
    next()
  }else {
    if (store.state.user.userId === '') {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        alert('提示', '暂未登录，请先登录');
        next({path: '/'})
      }
    } else {
      next()
    }
  }

});

// router.afterEach(() => {
//   // NProgress.done() // 结束Progress
// });
