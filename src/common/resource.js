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
  carInfo: '/thirdPartyData/vehicleManage/vehicles',
  productsRelease: '/productManage/pageProductInfo', //产品发行管理
  productsAudit: '/productManage/auditManually', //产品发行审核
  riskZr: '/riskManage/riskRuleResults', //风控准入列表
  riskEdit: '/risk_manage/risk_rules/#{rrid}/update', //风控修改风险规则
  riskQuery: '/riskManage/riskRuleTemplates', //查询风险规则模板
  riskWarn: '/riskManage/riskRuleWarnings' //查询风险预警信息
}

export const session = {
  get: (config) => http.get(APIS.session, config),
  post: (config) => http.post(APIS.session, config)
}

export const carInfo = {
  get: config => http.get(APIS.carInfo, config)
}

export const productsRelease = {
  post: config => http.post(APIS.productsRelease, config)
}

export const productsAudit = {
  post: (config) => http.post(APIS.productsAudit, config)
}

export const riskZr = {
  get: (config) => http.get(APIS.riskZr, config)
}

export const riskEdit = {
  post: (config) => http.post(APIS.riskEdit, config)
}

export const riskQuery = {
  get: (config) => http.get(APIS.riskQuery, config)
}

export const riskWarn = {
  get: (config) => http.get(APIS.riskWarn, config)
}
