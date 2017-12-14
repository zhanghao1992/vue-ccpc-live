import Vue from 'vue'
import Router from 'vue-router'
import VueSession from 'vue-session'
import Login from '@/views/Login'
import Index from '@/views/Index'
import Lun from '@/views/Lun'
import Single from '@/views/Single'
import Final from '@/views/Final'
import Publish from '@/views/Publish.vue'
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
      path: '/lun/:matchId',
      component: Lun,
      meta: {
        // requireAuth: true
      }
    },
    {
      path: '/single/:matchId',
      component: Single,
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
    },
    {
      path: '/publish/:matchId/:listType',
      component: Publish,
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
