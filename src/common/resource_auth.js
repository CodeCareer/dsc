import axios from 'axios'
import { Loading } from 'element-ui'
import msgBoxErr from '@/common/msgbox-err.js'
import store from '@/vuex/store.js'
import { urlMatcher } from '@/common/util.js'
import qs from 'qs'

const loadingInstances = {}

export const http = axios.create({
  baseURL: process.env.API_HOST + '/api/',
  // withCredentials: process.env.NODE_ENV === 'production',
  timeout: 20000,
  transformRequest: [data => {
    if (data) {
      return qs.stringify(data)
    }
    return data
  }]
})

function closeLoading(url) {
  const loadingInstance = loadingInstances[url]
  if (loadingInstance) {
    loadingInstance.close()
    delete loadingInstances[url]
  }
}

http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
http.interceptors.request.use(config => {
  config.headers.common['x-auth-token'] = store.getters.token
  config.url = urlMatcher(config.url, config.pathParams)
  // if (config.params && config.params.page) {
  //   config.params.page = config.params.page - 1
  // }

  if (config.loadingMaskTarget) {
    loadingInstances[config.url] = Loading.service({
      target: config.loadingMaskTarget
    })
  }
  return config
})

http.interceptors.response.use(res => {
  closeLoading(res.config.url)
  const data = res.data

  if (data.code === 200) {
    return res
  }
  if (data.code === 419 || data.code === 401) {
    if (res.config.skipAuth) {
      store.dispatch('logout', true)
    } else {
      msgBoxErr(data.message || '无访问权限！', data.code)
      store.dispatch('logout')
    }
  } else if (data.code === 400) {
    msgBoxErr(data.message || '请求失败！', data.code)
  } else if (data.code === 403) {
    msgBoxErr(data.message || '您无此权限！', data.code)
  } else if (data.code === 404) {
    msgBoxErr(data.message || '访问错误！', data.code)
  } else if (data.code === 500 || data.code === 502) {
    msgBoxErr(data.message || '抱歉！服务器忙。', data.code)
  } else {
    msgBoxErr(data.message || '请求失败！', data.code)
  }
  return res
  // return Promise.reject(data)
}, err => {
  err.config && closeLoading(err.config.url)
  msgBoxErr(err.message.indexOf('timeout') > -1 ? '请求超时' : '抱歉，服务器忙！', 'SERVER')
  return Promise.reject(err)
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
  accountDelete: '/usermanage/v1/user/delete', // 删除用户
  roleUpdateEable: '/usermanage/v1/role/update/enabled', // 角色启用暂停
  roleDetail: '/usermanage/v1/role/detail', // 角色详情
  roleUpdate: '/usermanage/v1/role/update', // 编辑更新角色
  roleAdd: '/usermanage/v1/role/create', // 添加角色
  roleDelete: '/usermanage/v1/role/delete', // 删除角色
  roleList: '/usermanage/v1/role/list', // 查看角色
  permissionByRoleId: '/usermanage/v1/permission/listByRoleId', // 查看用户权限
  permissionList: '/usermanage/v1/permission/list', // 查看所有权限
  permissionAdd: '/usermanage/v1/permission/create', // 创建权限
  permissionDetail: '/usermanage/v1/permission/detail', // 权限详情
  permissionUpdateEable: '/usermanage/v1/permission/update/enabled', // 启用暂停权限
  permissionUpdate: '/usermanage/v1/permission/update', // 编辑权限
  permissionDelete: '/usermanage/v1/permission/delete', // 删除权限
  groupList: '/usermanage/v1/group/list', // 查看所有分组
  groupAdd: '/usermanage/v1/group/create', // 创建分组
  groupDetail: '/usermanage/v1/group/detail', // 分组详情
  groupUpdateEable: '/usermanage/v1/group/update/enabled', // 启用暂停分组
  groupUpdate: '/usermanage/v1/group/update', // 编辑分组
  roleAddPermission: '/usermanage/v1/role/create/permission' // 角色授予权限
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
  post: (data, config) => http.post(APIS.accountAdd, data, config),
  delete: (data, config) => http.post(APIS.accountDelete, data, config)
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
  post: (data, config) => http.post(APIS.roleAdd, data, config),
  delete: (data, config) => http.post(APIS.roleDelete, data, config)
}

export const roleUpdateEable = {
  post: (data, config) => http.post(APIS.roleUpdateEable, data, config)
}

export const permissions = {
  get: config => http.get(APIS.permissionList, config)
}

export const permission = {
  get: config => http.get(APIS.permissionDetail, config),
  put: (data, config) => http.post(APIS.permissionUpdate, data, config),
  post: (data, config) => http.post(APIS.permissionAdd, data, config),
  delete: (data, config) => http.post(APIS.permissionDelete, data, config)
}

export const permissionUpdateEable = {
  post: (data, config) => http.post(APIS.permissionUpdateEable, data, config)
}

export const groups = {
  get: config => http.get(APIS.groupList, config)
}

export const group = {
  get: config => http.get(APIS.groupDetail, config),
  put: (data, config) => http.post(APIS.groupUpdate, data, config),
  post: (data, config) => http.post(APIS.groupAdd, data, config),
  delete: (data, config) => http.post(APIS.groupDelete, data, config)
}

export const groupUpdateEable = {
  post: (data, config) => http.post(APIS.groupUpdateEable, data, config)
}

export const roleAddPermission = {
  post: (data, config) => http.post(APIS.roleAddPermission, data, config)
}

export const permissionByRoleId = {
  get: config => http.get(APIS.permissionByRoleId, config)
}
