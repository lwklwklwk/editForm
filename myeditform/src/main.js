import Vue from 'vue'
import App from './App.vue'
import service from './myaxios'
Vue.config.productionTip = false

Vue.prototype.$axios= service;

export default new Vue({
  render: h => h(App),
}).$mount('#app')
