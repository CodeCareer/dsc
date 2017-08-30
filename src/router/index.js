import VueRouter from 'vue-router'
import routes from '@/router/routes.js'
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/vuex/store'
import { find, intersection, map, filter } from 'lodash'
const nprogress = require('@/vendor/nprogress').NProgress

Vue.use(VueRouter)

let router = new VueRouter({
  base: __dirname,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== undefined) {
    document.body.setAttribute('class', to.name)
  }

  if (to.name === 'login' && document.querySelector(nprogress.settings.parent)) nprogress.remove()
  else if (document.querySelector(nprogress.settings.parent)) nprogress.start()

  const user = store.getters.user
  const token = store.getters.token
  const permissions = store.getters.permissions
  if (process.env.STOP_PERMIT) {
    next()
  } else if (!to.meta.skipAuth && (!token || !user.name)) {
    next({
      name: 'login',
      query: {
        redirect: to.name !== 'login' ? to.fullPath : ''
      }
    })
  } else if (!to.meta.skipAuth && !permissions.length) {
    store.dispatch('getPermissions').then(() => {
      getPermitRoute(to).then(newRoute => {
        if (!newRoute) {
          next()
        } else {
          next(newRoute)
        }
      })
    })
  } else {
    getPermitRoute(to).then(newRoute => {
      if (!newRoute) {
        next()
      } else {
        next(newRoute)
      }
    })
  }
})

router.afterEach(to => {
  if (document.querySelector(nprogress.settings.parent)) nprogress.done()

  if (to.meta.title) {
    document.title = to.meta.title
  }
})

/**
 * 获取基于权限的路由地址
 * @param {Object} a route Object
 * @return {Object} a route Object
 */
function getPermitRoute(to) {
  return new Promise((resolve, reject) => {
    const permissions = store.getters.permissions
    const permitApis = map(filter(permissions, pp => pp.check && pp.apiName), p => p.apiName)
    if (to.name === 'login') resolve(null)

    if (intersection(to.meta.permit, permitApis).length) {
      resolve(null)
    } else {
      const mainRoutes = find(routes, r => r.name === 'wd')
      const firstRoute = find(mainRoutes.children, child => intersection(child.meta.permit, permitApis).length)

      if (firstRoute) {
        resolve({
          name: firstRoute.name
        })
      } else {
        resolve({
          name: 'login',
          query: {
            redirect: to.name !== 'login' ? to.fullPath : ''
          }
        })
      }
    }
  })
}

export default {
  run() {
    new Vue({
      render(h) {
        return h(App)
      },
      store,
      router
    }).$mount('#app')
  }
}

export { router }
