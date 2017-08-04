import { router } from '@/router'
import { session, orgId } from '@/common/resource_auth.js'
const ORG_NAME = 'xwwd2' // 机构名称

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

  updateOrgId({ commit, dispatch }, orgId = '') {
    window.localStorage.orgId = orgId
    commit('updateOrgId', orgId)
  },

  async getOrgId({ commit, dispatch }, params = {}) {
    const data = await orgId.get(params).then(res => res.data)
    await dispatch('updateOrgId', data.data)
  },

  async login({ commit, dispatch }, params) {
    const data = await session.post(params.user, params.config).then(res => res.data)
    await dispatch('updateToken', data.token || 'no-token')
    await dispatch('updateUser', data.data)
    await dispatch('getOrgId', { params: { orgName: ORG_NAME } })
    return data
  },

  async logout({ commit }, silent) {
    // await session.delete()
    window.localStorage.user = '{}'
    window.localStorage.token = ''
    window.localStorage.orgId = ''
    commit('updateUser', {})
    commit('updateToken')

    if (silent) return

    router.push({
      name: 'login'
    })
  }
}
