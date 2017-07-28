import { router } from '@/router'
import { session } from '@/common/resource.js'

export default {
  updateUser: function({ commit }, user = {}) {
    window.localStorage.user = JSON.stringify(user)
    commit('updateUser', user)
  },

  updateToken({ commit }, token = '') {
    window.localStorage.token = token
    commit('updateToken', token)
  },

  async getUser({ commit, dispatch }) {
    const user = await session.get().then(res => res.data)
    dispatch('updateUser', user)
    return user
  },

  async login({ commit, dispatch }, user) {
    const data = await session.post(user).then(res => res.data)
    await dispatch('updateToken', data.token)
    await dispatch('getUser')
    return data
  },

  logout({ commit }, silent) {
    window.localStorage.user = '{}'
    window.localStorage.token = ''
    commit('updateUser', {})
    commit('updateToken')

    if (silent) return

    router.push({
      name: 'login'
    })
  }
}
