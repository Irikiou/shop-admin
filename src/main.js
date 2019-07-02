import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element UI 文件库
import ElementUI from 'element-ui'
// 引入CSS样式
import 'element-ui/lib/theme-chalk/index.css'
// 为了避免被覆盖，所以把自己写的样式写在最下面
import '../src/assets/base.css'

Vue.config.productionTip = false
// 安装elementUI
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
