export default {
  path: 'risk_control',
  name: 'riskControl',
  redirect: { name: 'accessControl' },
  component: {
    render(h) {
      return h('router-view')
    }
  },
  meta: {
    permit: ['riskZr', 'riskEdit', 'riskQuery', 'riskWarn'],
    menu: {
      icon: 'icon-dunpai',
      name: '风控管理'
    }
  },
  children: [{
    path: 'pre_warning',
    name: 'preWarning',
    component: resolve => require(['@/views/risk_control/PreWarning.vue'], resolve),
    meta: {
      title: '微贷系统-风险规则模板',
      permit: ['riskEdit', 'riskQuery'],
      menu: {
        name: '风险规则模板'
      },
      crumbs: [{
        name: '风控管理',
        to: { name: 'accessControl' }
      }, {
        name: '风险规则模板',
        to: { name: 'preWarning' }
      }]
    }
  }, {
    path: 'access_control',
    name: 'accessControl',
    component: resolve => require(['@/views/risk_control/AccessControl.vue'], resolve),
    meta: {
      title: '微贷系统-准入校验结果',
      permit: ['riskZr'],
      menu: {
        name: '准入校验结果'
      },
      crumbs: [{
        name: '风控管理',
        to: { name: 'accessControl' }
      }, {
        name: '准入校验结果',
        to: { name: 'accessControl' }
      }]
    }
  }, {
    path: 'pre_warning_info',
    name: 'preWarningInfo',
    component: resolve => require(['@/views/risk_control/PreWarningInfo.vue'], resolve),
    meta: {
      title: '微贷系统-风险预警监控',
      permit: ['riskWarn'],
      menu: {
        name: '风险预警监控'
      },
      crumbs: [{
        name: '风控管理',
        to: { name: 'accessControl' }
      }, {
        name: '风险预警监控',
        to: { name: 'preWarningInfo' }
      }]
    }
  }]
}
