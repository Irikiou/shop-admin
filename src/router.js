import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/Login.vue'
import Home from './views/Home/Home.vue'
import User from './views/User/User.vue'
import Roles from './views/Roles/Role.vue'
import Rights from './views/rights/rights.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      //将user路由当做home路由的children这样一个东西
      children: [
        {
          path: '/user',
          component: User
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
