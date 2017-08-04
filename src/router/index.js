import VueRouter from 'vue-router'
import routes from '@/router/routes.js'
import Vue from 'vue'
import App from '@/App.vue'
import store from '@/vuex/store'
import nprogress from 'nprogress'

Vue.use(VueRouter)

let router = new VueRouter({
  mode: 'history',
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

  if (to.name === 'login') nprogress.remove()
  else if (document.querySelector(nprogress.settings.parent)) nprogress.start()

  let user = store.getters.user
  let token = store.getters.token
  if (!to.meta.skipAuth && (!token || !user.name)) {
    next({ name: 'login' })
  }
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
