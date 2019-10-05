import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios';
import QS from 'qs'


Vue.prototype.qs = QS;
Vue.prototype.$axios = axios;
Vue.use(iView)
Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
