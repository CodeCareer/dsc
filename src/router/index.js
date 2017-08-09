import VueRouter from 'vue-router'
import routes from '@/router/routes.js'
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/vuex/store'
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

  // let user = store.getters.user
  // let token = store.getters.token
  // let permissions = store.getters.permissions

  // if (!to.meta.skipAuth && (!token || !user.name)) {
  //   next({
  //     name: 'login',
  //     query: {
  //       redirect: to.name !== 'login' ? to.fullPath : ''
  //     }
  //   })
  // } else if (!to.meta.skipAuth && !permissions.length) {
  //   store.dispatch('getPermissions').then(() => next())
  // }
  next()
})

router.afterEach(to => {
  if (document.querySelector(nprogress.settings.parent)) nprogress.done()

  if (to.meta.title) {
    document.title = to.meta.title
  }
})

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
