import axios from 'axios'
import { Loading } from 'element-ui'
import msgBoxErr from '@/common/msgbox-err.js'
import store from '@/vuex/store.js'
import { urlMatcher } from '@/common/util.js'
import qs from 'qs'

let loadingInstance

export const http = axios.create({
  baseURL: process.env.API_HOST || '/api/',
  // withCredentials: process.env.NODE_ENV === 'production',
  timeout: 20000,
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

  // 兼容统一的权限控制代码
  if (!data.resultCode && data.code === 401) {
    data.resultCode = 'INVALID_LOGIN'
    data.resultMsg = data.message
  }

  if (data.resultCode === 'SUCCESS') {
    return res
  } else if (data.resultCode === 'INVALID_LOGIN') {
    if (res.config.skipAuth) {
      store.dispatch('logout', true)
    } else {
      msgBoxErr(data.resultMsg || '无访问权限！', data.resultCode)
      store.dispatch('logout')
    }
  } else if (data.resultCode === 'BIZ_EXCEPTION') {
    msgBoxErr(data.resultMsg || '业务异常', data.resultCode)
  } else if (data.resultCode === 'FAILED') {
    msgBoxErr(data.resultMsg || '访问失败', data.resultCode)
  } else if (data.resultCode === 'SYSTEM_BUSY') {
    msgBoxErr(data.resultMsg || '系统繁忙', data.resultCode)
  } else {
    msgBoxErr(data.resultMsg || '未知错误', 'UNKNOWN')
  }
  return Promise.reject(new Error(data.resultMsg))
}, err => {
  if (loadingInstance) loadingInstance.close()
  msgBoxErr(err.message.indexOf('timeout') > -1 ? '请求超时' : '抱歉，服务器忙！', 'SERVER')
  return Promise.reject(err)
})

export const APIS = {
  productsRelease: '/productManage/pageProductInfo', //产品发行管理
  productsAudit: '/productManage/auditManually', //产品发行审核
  accountDepositManage: '/fundManage/listAccountFundDetail', //账户入金查询
  accountDepositDelete: '/fundManage/deleteAccountFundDetail', //账户入金删除
  accountDepositEdit: '/fundManage/editAccountFundDetail', //账户入金编辑
  accountDepositAudit: '/fundManage/auditAccountFundDetail', //账户入金审核
  accountDepositAdd: '/fundManage/addAccountFundDetail', //账户入金新增
  fundDeposit: '/fundManage/listCapitalDetail', //账户入金新增
  fundAccountManage: '/fundManage/listAccountInfo', //资金账户查询
  fundAccountEdit: '/fundManage/editAccountInfo', //资金账户编辑
  fundAccountAdd: '/fundManage/addAccountInfo', //资金账户新增
  fundAccountDelete: '/fundManage/deleteAccountInfo', //资金账户删除
  assetInfo: '/assetManage/listAllAssetInfo', //资产的全部信息
  backRecord: '/assetManage/listBuyBackRecord', // 查询回购记录
  factRepay: '/assetManage/listFactRepayInfo', // 查询实际还款
  repayPlan: '/assetManage/listRepayPlan', //查询还款计划
  riskZr: '/riskManage/riskRuleResults', //风控准入列表
  riskEdit: '/riskManage/riskRules/:riskRuleId/update', //风控修改风险规则
  riskQuery: '/riskManage/riskRuleTemplates', //查询风险规则模板
  riskWarn: '/riskManage/riskRuleWarnings', //查询风险预警信息
  carInfoList: '/thirdPartyData/vehicleManage/vehicles/list', // 车辆信息列表获取接口
  carInfoDetail: '/thirdPartyData/vehicleManage/vehicles/details/:id', // 车辆信息获取接口
  carInfoAdd: '/thirdPartyData/vehicleManage/vehicles/create', // 车辆信息
  carInfoUpdate: '/thirdPartyData/vehicleManage/vehicles/update', // 车辆信息
  carGpsList: '/thirdPartyData/gpsManage/geos', // 车辆GPS信息列表获取接口
  carMatchList: '/thirdPartyData/vehicleManage/vehicleMatchs/list', // 车辆匹配信息管理
  carMatchUpdate: '/thirdPartyData/vehicleManage/vehicleMatchs/update' // 车辆匹配信息管理
}

export const session = {
  get: config => http.get(APIS.session, config),
  post: (data, config) => http.post(APIS.session, data, config)
}

export const carInfos = {
  get: config => http.get(APIS.carInfoList, config)
}

export const carInfo = {
  get: config => http.get(APIS.carInfoDetail, config),
  post: (data, config) => http.post(APIS.carInfoAdd, data, config),
  put: (data, config) => http.post(APIS.carInfoUpdate, data, config)
}

export const carGps = {
  get: config => http.get(APIS.carGpsList, config)
}

export const carMatchs = {
  get: config => http.get(APIS.carMatchList, config)
}

export const carMatch = {
  put: (data, config) => http.post(APIS.carMatchUpdate, data, config)
}

export const productsRelease = {
  post: (data, config) => http.post(APIS.productsRelease, data, config)
}

export const productsAudit = {
  post: (data, config) => http.post(APIS.productsAudit, data, config)
}

export const accountDepositManage = {
  post: (data, config) => http.post(APIS.accountDepositManage, data, config)
}

export const accountDepositDelete = {
  post: (data, config) => http.post(APIS.accountDepositDelete, data, config)
}

export const accountDepositEdit = {
  post: (data, config) => http.post(APIS.accountDepositEdit, data, config)
}

export const accountDepositAudit = {
  post: (data, config) => http.post(APIS.accountDepositAudit, data, config)
}

export const accountDepositAdd = {
  post: (data, config) => http.post(APIS.accountDepositAdd, data, config)
}

export const fundDeposit = {
  post: (data, config) => http.post(APIS.fundDeposit, data, config)
}

export const fundAccountManage = {
  post: (data, config) => http.post(APIS.fundAccountManage, data, config)
}

export const fundAccountEdit = {
  post: (data, config) => http.post(APIS.fundAccountEdit, data, config)
}

export const fundAccountAdd = {
  post: (data, config) => http.post(APIS.fundAccountAdd, data, config)
}

export const fundAccountDelete = {
  post: (data, config) => http.post(APIS.fundAccountDelete, data, config)
}

export const assetInfo = {
  post: (data, config) => http.post(APIS.assetInfo, data, config)
}

export const backRecord = {
  post: (data, config) => http.post(APIS.backRecord, data, config)
}

export const factRepay = {
  post: (data, config) => http.post(APIS.factRepay, data, config)
}

export const repayPlan = {
  post: (data, config) => http.post(APIS.repayPlan, data, config)
}

export const riskZr = {
  get: (config) => http.get(APIS.riskZr, config)
}

export const riskEdit = {
  post: (data, config) => http.post(APIS.riskEdit, data, config)
}

export const riskQuery = {
  get: (config) => http.get(APIS.riskQuery, config)
}

export const riskWarn = {
  get: (config) => http.get(APIS.riskWarn, config)
}
