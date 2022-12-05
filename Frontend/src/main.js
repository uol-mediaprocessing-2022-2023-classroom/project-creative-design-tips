import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import MultiSelectAreasImage from 'multi-select-areas-image'

Vue.use(MultiSelectAreasImage)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  vuetify,
  render: h => h(App)
}).$mount('#app')
