import Vue from 'vue'
import App from './App.vue'
import _global_ from './global'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'

Vue.config.productionTip = false
Vue.prototype.GLOBAL = _global_

if (navigator.userAgent.includes('Html5Plus')) {
  Vue.prototype.GLOBAL.ifAPP = true
}

new Vue({
  render: (h) => h(App)
}).$mount('#app')
