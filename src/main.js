import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// 引入element UI 文件库
import ElementUI from 'element-ui'
// 引入CSS样式
import 'element-ui/lib/theme-chalk/index.css'
// 为了避免被覆盖，所以把自己写的样式写在最下面
import '../src/assets/base.css'

Vue.config.productionTip = false
// 安装elementUI
Vue.use(ElementUI)
// 通过default是给axios设置一个默认的基地址URL

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 设置axios的请求拦截器

axios.interceptors.request.use(
  function(config) {
    config.headers.Authorization = localStorage.getItem('token')
    //return config不能动，这个函数中必须有这个内容
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

//把axios加到vue的原型上
Vue.prototype.$http = axios
// 引入导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }
  if (localStorage.getItem('token')) {
    next()
  } else {
    router.push('/login')
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
