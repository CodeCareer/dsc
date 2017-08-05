import axios from 'axios'
import { MessageBox, Loading } from 'element-ui'
import store from '@/vuex/store.js'
import { urlMatcher } from '@/common/util.js'
import qs from 'qs'
import mockPerssions from '@/views/account/mock-permissions.js'

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

  if (data.code === 200) {
    // mock permissions
    if (res.config.url === '/api/usermanage/v1/permission/listByRoleId' &&
      res.config.params.roleId === '88b3148de2184fc9ba5e39196c85b045') {
      res.data = mockPerssions
    }
    return res
  }
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

export const APIS = {
  login: '/usermanage/v1/login', // 登录
  logout: '/usermanage/v1/logout', // 登出
  orgId: '/usermanage/v1/org/selectOrgByName', // 获取机构id
  accountUpdateEable: '/usermanage/v1/user/update/enabled', // 账户启用暂停
  accountUpdatePwd: '/usermanage/v1/user/update/pwd', // 修改用户密码
  accountList: '/usermanage/v1/user/listExt', // 用户列表
  accountDetail: '/usermanage/v1/user/detailExt', // 用户详情
  accountUpdate: '/usermanage/v1/user/update', // 编辑保存用户
  accountAdd: '/usermanage/v1/user/create', // 添加用户
  roleUpdateEable: '/usermanage/v1/role/update/enabled', // 角色启用暂停
  roleDetail: '/usermanage/v1/role/detail', // 角色详情
  roleUpdate: '/usermanage/v1/role/update', // 编辑更新角色
  roleAdd: '/usermanage/v1/role/create', // 添加角色
  roleList: '/usermanage/v1/role/list', // 查看角色
  permissions: '/usermanage/v1/permission/listByRoleId', // 查看用户权限
  roleAddPermission: '/usermanage/v1/role/create/permission' // 编辑用户权限
}

export const session = {
  post: (data, config) => http.post(APIS.login, data, config),
  delete: config => http.post(APIS.logout, config)
}

export const orgId = {
  get: config => http.get(APIS.orgId, config)
}

export const accounts = {
  get: config => http.get(APIS.accountList, config)
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

export const role = {
  get: config => http.get(APIS.roleDetail, config),
  put: (data, config) => http.post(APIS.roleUpdate, data, config),
  post: (data, config) => http.post(APIS.roleAdd, data, config)
}

export const roleUpdateEable = {
  post: (data, config) => http.post(APIS.roleUpdateEable, data, config)
}

export const roleAddPermission = {
  post: (data, config) => http.post(APIS.roleAddPermission, data, config)
}

export const permissions = {
  get: config => http.get(APIS.permissions, config)
}
