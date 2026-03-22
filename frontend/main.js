import App from './App'
import uview from 'uview-ui'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$forceUpdate = function() {}
App.mpType = 'app'

Vue.use(uview)

try {
  const app = new Vue({
    ...App
  })
  app.$mount()
} catch (error) {
  console.error('App init error:', error)
}
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(uview)
  return {
    app
  }
}
// #endif
