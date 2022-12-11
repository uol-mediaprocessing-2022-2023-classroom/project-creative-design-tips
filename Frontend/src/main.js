import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

require('./components/homepage.css');
require('./components/button.css');

Vue.config.productionTip = false

new Vue({
  el: '#app',
  vuetify,
  render: h => h(App)
}).$mount('#app')
