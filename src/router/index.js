import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/view/Goodslist.vue'
import Cart from '@/view/Cart.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path:'/cart',
      name:'cart',
      component: Cart
    }
  ]
})
