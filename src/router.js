import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/Login.vue'
import Home from './views/Home/Home.vue'
import User from './views/User/User.vue'
import Roles from './views/Roles/Role.vue'
import Rights from './views/rights/rights.vue'
import Goods from './views/Goods/Goods.vue'
import Gategories from './views/Goods/Gategories.vue'
import goodsAdd from './views/Goods/goodsAdd.vue'

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
          path: '/users',
          component: User
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/categories',
          component: Gategories
        },
        {
          path: '/goods-add',
          component: goodsAdd
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
