import axios from 'axios'
import { MessageBox, Loading } from 'element-ui'
import store from '@/vuex/store.js'
import { urlMatcher } from '@/common/util.js'
import qs from 'qs'
let loadingInstance

export const http = axios.create({
  baseURL: process.env.API_HOST || '/api/',
  withCredentials: process.env.NODE_ENV === 'production',
  timeout: 5000,
  transformRequest: [data => {
    if (data) {
      return qs.stringify(data)
    }
    return data
  }]
})

http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
http.interceptors.request.use(config => {
  config.headers.common['x-auth-token'] = store.getters.token
  config.url = urlMatcher(config.url, config.pathParams)
  if (config.params && config.params.page) {
    config.params.page = config.params.page - 1
  }

  if (config.loadingMaskTarget) {
    loadingInstance = Loading.service({
      target: config.loadingMaskTarget
    })
  }
  return config
})

http.interceptors.response.use(res => {
  if (loadingInstance) loadingInstance.close()
  const data = res.data
    // const request = res.request

  if (data.code === 200) return res
  if (data.code === 419 || data.code === 401) {
    if (res.config.skipAuth) {
      store.dispatch('logout', true)
    } else {
      MessageBox({ message: data.message || '无访问权限！', title: '提示', type: 'error' })
      store.dispatch('logout')
    }
  } else if (data.code === 400) {
    MessageBox({ message: data.message || '请求失败！', title: '提示', type: 'error' })
  } else if (data.code === 403) {
    MessageBox({ message: data.message || '您无此权限！', title: '提示', type: 'error' })
  } else if (data.code === 404) {
    MessageBox({ message: data.message || '访问错误！', title: '提示', type: 'error' })
  } else if (data.code === 500 || data.code === 502) {
    MessageBox({ message: data.message || '抱歉！服务器忙。', title: '提示', type: 'error' })
  } else {
    MessageBox({ message: data.message || '请求失败！', title: '提示', type: 'error' })
  }
  return Promise.reject(data.message)
})

const APIS = {
  login: '/usermanage/v1/login',
  logout: '/usermanage/v1/logout',
  orgId: '/usermanage/v1/org/selectOrgByName',
  accountUpdateEable: '/usermanage/v1/user/update/enabled',
  accountUpdatePwd: '/usermanage/v1/user/update/pwd',
  accountList: '/usermanage/v1/user/listExt',
  accountDetail: '/usermanage/v1/user/detailExt',
  accountUpdate: '/usermanage/v1/user/update',
  accountAdd: '/usermanage/v1/user/create',
  roleList: '/usermanage/v1/role/list2'
}

export const session = {
  post: (data, config) => http.post(APIS.login, data, config),
  delete: config => http.post(APIS.logout, config)
}

export const orgId = {
  get: config => http.get(APIS.orgId, config)
}

export const accounts = {
  get: config => http.get(APIS.accountList, config),
  post: (data, config) => http.post(APIS.accountList, data, config)
}

export const account = {
  get: config => http.get(APIS.accountDetail, config),
  put: (data, config) => http.post(APIS.accountUpdate, data, config),
  post: (data, config) => http.post(APIS.accountAdd, data, config)
}

export const accountUpdateEable = {
  post: (data, config) => http.post(APIS.accountUpdateEable, data, config)
}

export const accountUpdatePwd = {
  post: (data, config) => http.post(APIS.accountUpdatePwd, data, config)
}

export const roles = {
  get: config => http.get(APIS.roleList, config)
}
