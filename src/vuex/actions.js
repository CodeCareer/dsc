import { router } from '@/router'
import { session, orgId, permissionByRoleId } from '@/common/resource_auth.js'
import { flattenDeep, map } from 'lodash'

const ORG_NAME = 'xwwd2' // 机构名称
let logoutLock = false // 锁定退出逻辑，避免多次登出造成redirect不正确

export default {
  updateUser: function({ commit }, user = {}) {
    window.localStorage.user = JSON.stringify(user)
    commit('updateUser', user)
  },

  updateToken({ commit }, token = '') {
    window.localStorage.token = token
    commit('updateToken', token)
  },

  updatePermissions({ commit }, ps = []) {
    commit('updatePermissions', ps)
  },

  async getPermissions({ dispatch, state }) {
    const data = await permissionByRoleId.get({ params: { roleId: state.user.roles ? state.user.roles[0].id : '' } }).then(res => res.data)
    const ps = flattenDeep(map(data.data, p => p.functions))
    await dispatch('updatePermissions', ps)
  },

  async getUser({ dispatch }) {
    const user = await session.get().then(res => res.data)
    await dispatch('updateUser', user)
    return user
  },

  updateOrgId({ commit }, orgId = '') {
    window.localStorage.orgId = orgId
    commit('updateOrgId', orgId)
  },

  async getOrgId({ dispatch }, params = {}) {
    const data = await orgId.get(params).then(res => res.data)
    await dispatch('updateOrgId', data.data)
  },

  async login({ dispatch }, params) {
    const data = await session.post(params.user, params.config).then(res => res.data)
    await dispatch('updateToken', data.token || 'no-token')
    await dispatch('updateUser', data.data)
    await dispatch('getOrgId', { params: { orgName: ORG_NAME } })
    // await dispatch('getPermissions')
    return data
  },

  async logout({ commit }, silent) {
    if (logoutLock) return
      // await session.delete()
    window.localStorage.user = '{}'
    window.localStorage.token = ''
    window.localStorage.orgId = ''
    commit('updateUser', {})
    commit('updateToken')
    if (silent) return

    router.push({
      name: 'login',
      query: { redirect: router.history.current.name !== 'login' ? encodeURIComponent(router.history.current.fullPath) : '' }
    })

    logoutLock = true
    setTimeout(() => { logoutLock = false }, 5000)
  }
}
