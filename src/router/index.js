import Vue from 'vue'
import Router from 'vue-router'
import VueSession from 'vue-session'
import Login from '@/views/Login/Login'
import Index from '@/views/Index/Index'
import Final from '@/views/Final/Final'
import store from '../store/store'

Vue.use(Router)
Vue.use(VueSession)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/index',
      component: Index,
      meta: {
        // requireAuth: true
      }
    },
    {
      path: '/final/:matchId',
      component: Final,
      meta: {
        // requireAuth: true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  const WL = window.localStorage
  const userInfo = JSON.parse(WL.getItem('userInfo'))
  store.state.user = userInfo
  if (to.meta && to.meta.requireAuth) {
    if (store.state.user === null) {
      next({path: '/', component: Login})
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
