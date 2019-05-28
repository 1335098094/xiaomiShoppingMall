// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
import VueInfiniteScroll from 'vue-infinite-scroll'
import VueCookies from 'vue-cookies'
import {currency} from './util/currency'
import '@/permission'
import alert from '@/components/alert/alert'
import toast from '@/components/Toast/Toast'
import Vue from 'vue'
Vue.prototype.$alert=alert;
Vue.prototype.$toast=toast;

Vue.filter('currency',currency);
Vue.use(VueInfiniteScroll);
Vue.config.productionTip = false;

Vue.use(VueLazyLoad,{
  loading: 'static/loading-svg/loading-spokes.svg',
});

Vue.use(VueCookies);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
