import axios from 'axios'
import { MessageBox, Loading } from 'element-ui'
import store from '@/vuex/store.js'
import { urlMatcher } from '@/common/util.js'
let loadingInstance

export const http = axios.create({
  baseURL: '/api/',
  timeout: 1000
})

http.interceptors.request.use(config => {
  config.headers.common['Authorization'] = store.getters.token
  config.url = urlMatcher(config.url, config.pathParams)
  if (config.loadingMarkTarget) {
    loadingInstance = Loading.service({
      target: config.loadingMarkTarget
    })
  }
  return config
})

http.interceptors.response.use(res => {
  if (loadingInstance) loadingInstance.close()
  return res
}, err => {
  const res = err.response
  const request = res.request
  loadingInstance.close()
  if (!res) return Promise.reject(err)

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
  productsRelease: '/productManage/pageProductInfo', //产品发行管理
  productsAudit: '/productManage/auditManually', //产品发行审核
  accountDepositManage: '/fundManage/listAccountFundDetail', //账户入金查询
  accountDepositDelete: '/fundManage/deleteAccountFundDetail', //账户入金删除
  accountDepositEdit: '/fundManage/editAccountFundDetail', //账户入金编辑
  accountDepositAudit: '/fundManage/auditAccountFundDetail', //账户入金审核
  accountDepositadd: '/fundManage/addAccountFundDetail', //账户入金新增
  riskZr: '/riskManage/riskRuleResults', //风控准入列表
  riskEdit: '/risk_manage/risk_rules/#{rrid}/update', //风控修改风险规则
  riskQuery: '/riskManage/riskRuleTemplates', //查询风险规则模板
  riskWarn: '/riskManage/riskRuleWarnings', //查询风险预警信息
  carInfos: '/thirdPartyData/vehicleManage/vehicles/:id', // 车辆信息列表获取接口
  carMatchs: '/thirdPartyData/vehicleManage/vehicleMatchs/:id' // 车辆匹配信息管理
}

export const session = {
  get: config => http.get(APIS.session, config),
  post: (data, config) => http.post(APIS.session, data, config)
}

export const carInfos = {
  get: config => http.get(APIS.carInfos, config),
  post: (data, config) => http.post(APIS.carInfos, data, config),
  put: (data, config) => http.put(APIS.carInfos, data, config),
  delete: config => http.delete(APIS.carInfos, config)
}

export const carMatchs = {
  get: config => http.get(APIS.carMatchs, config),
  put: (data, config) => http.put(APIS.carMatchs, data, config)
}

export const productsRelease = {
  post: config => http.post(APIS.productsRelease, config)
}

export const productsAudit = {
  post: (config) => http.post(APIS.productsAudit, config)
}

export const accountDepositManage = {
  post: (config) => http.post(APIS.accountDepositManage, config)
}

export const accountDepositDelete = {
  post: (config) => http.post(APIS.accountDepositDelete, config)
}

export const accountDepositEdit = {
  post: (config) => http.post(APIS.accountDepositEdit, config)
}

export const accountDepositAudit = {
  post: (config) => http.post(APIS.accountDepositAudit, config)
}

export const accountDepositadd = {
  post: (config) => http.post(APIS.accountDepositadd, config)
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
