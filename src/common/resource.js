import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/vuex/store.js'
import { urlMatcher } from '@/common/util.js'

export const http = axios.create({
  baseURL: '/api/',
  timeout: 1000
})

http.interceptors.request.use(config => {
  config.headers.common['Authorization'] = store.getters.token
  if (config.pathParams) {
    config.url = urlMatcher(config.url, config.pathParams)
  }
  return config
})

http.interceptors.response.use(res => res, err => {
  const res = err.response
  const request = res.request
  if (res.status === 419 || res.status === 401) {
    if (request.config.skipAuth) {
      store.dispatch('logout', true)
    } else {
      MessageBox(res.data.msg || '无访问权限！', '提示')
      store.dispatch('logout')
    }
  } else if (res.status === 400) {
    MessageBox(res.data.msg || '请求失败！', '提示')
  } else if (res.status === 403) {
    MessageBox(res.data.msg || '您无此权限！', '提示')
  } else if (res.status === 404) {
    MessageBox(res.data.msg || '访问错误！', '提示')
  } else if (res.status === 500 || res.status === 502) {
    MessageBox(res.data.msg || '抱歉！服务器忙。', '提示')
  }
  return Promise.reject(err)
})

const APIS = {
  session: '/session',
  carInfo: '/thirdpartydata/vehiclemanage/v1/vehicle'
}

export const session = {
  get: (config) => http.get(APIS.session, config),
  post: (config) => http.post(APIS.session, config)
}

export const carInfo = {
  get: config => http.get(APIS.carInfo, config)
}
