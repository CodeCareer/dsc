export default [{
  path: '/',
  redirect: '/wd/products'
}, {
  path: '/login',
  name: 'login',
  component: resolve => require(['@/views/Login.vue'], resolve),
  meta: { title: '微贷系统-登录', skipAuth: true }
}, {
  path: '/wd',
  name: 'wd',
  redirect: 'wd/products',
  component: resolve => require(['@/views/WdLayout.vue'], resolve),
  children: [{
    path: 'products',
    name: 'products',
    component: resolve => require(['@/views/product_manage/Products.vue'], resolve),
    meta: {
      title: '微贷系统-产品发行管理',
      crumbs: [{
        name: '产品管理',
        to: { name: 'wd' }
      }, {
        name: '产品发行管理',
        to: { name: 'products' }
      }]
    }
  }, {
    path: 'risk_control',
    name: 'riskControl',
    redirect: { name: 'accessControl' },
    component: {
      render(h) {
        return h('router-view')
      }
    },
    children: [{
      path: 'access_control',
      name: 'accessControl',
      component: resolve => require(['@/views/risk_control/AccessControl.vue'], resolve),
      meta: {
        title: '微贷系统-风控准入管理',
        crumbs: [{
          name: '风控管理',
          to: { name: 'accessControl' }
        }, {
          name: '风控准入管理',
          to: { name: 'accessControl' }
        }]
      }
    }, {
      path: 'pre_warning',
      name: 'preWarning',
      component: resolve => require(['@/views/risk_control/PreWarning.vue'], resolve),
      meta: {
        title: '微贷系统-风控预警管理',
        crumbs: [{
          name: '风控管理',
          to: { name: 'accessControl' }
        }, {
          name: '风控预警管理',
          to: { name: 'preWarning' }
        }]
      }
    }, {
      path: 'pre_warning_info',
      name: 'preWarningInfo',
      component: resolve => require(['@/views/risk_control/PreWarningInfo.vue'], resolve),
      meta: {
        title: '微贷系统-预警信息管理',
        crumbs: [{
          name: '风控管理',
          to: { name: 'accessControl' }
        }, {
          name: '预警信息管理',
          to: { name: 'preWarningInfo' }
        }]
      }
    }]
  }, {
    path: 'base_data',
    name: 'baseData',
    redirect: { name: 'carInfo' },
    component: {
      render(h) {
        return h('router-view')
      }
    },
    children: [{
      path: 'car_info',
      name: 'carInfo',
      component: resolve => require(['@/views/base_data/CarInfo.vue'], resolve),
      meta: {
        title: '微贷系统-基础车型信息管理',
        crumbs: [{
          name: '基础数据管理',
          to: { name: 'carInfo' }
        }, {
          name: '基础车型信息',
          to: { name: 'carInfo' }
        }]
      }
    }, {
      path: 'car_match',
      name: 'carMatch',
      component: resolve => require(['@/views/base_data/CarMatch.vue'], resolve),
      meta: {
        title: '微贷系统-车型匹配管理',
        crumbs: [{
          name: '基础数据管理',
          to: { name: 'carInfo' }
        }, {
          name: '车型匹配管理',
          to: { name: 'carMatch' }
        }]
      }
    }, {
      path: 'car_gps',
      name: 'carGps',
      component: resolve => require(['@/views/base_data/CarGps.vue'], resolve),
      meta: {
        title: '微贷系统-GPS数据查询',
        crumbs: [{
          name: '基础数据管理',
          to: { name: 'carInfo' }
        }, {
          name: 'GPS数据查询',
          to: { name: 'carGps' }
        }]
      }
    }]
  }, {
    path: 'account',
    name: 'account',
    redirect: { name: 'accountList' },
    component: {
      render(h) {
        return h('router-view')
      }
    },
    children: [{
      path: 'account_list',
      name: 'accountList',
      component: resolve => require(['@/views/account/AccountList.vue'], resolve),
      meta: {
        title: '微贷系统-用户列表',
        crumbs: [{
          name: '用户管理',
          to: { name: 'accountList' }
        }, {
          name: '用户列表',
          to: { name: 'accountList' }
        }]
      }
    }, {
      path: 'authority_manage',
      name: 'authorityManage',
      component: resolve => require(['@/views/account/AuthorityManage.vue'], resolve),
      meta: {
        title: '微贷系统-用户列表',
        crumbs: [{
          name: '用户管理',
          to: { name: 'accountList' }
        }, {
          name: '用户列表',
          to: { name: 'authorityManage' }
        }]
      }
    }, {
      path: 'settings',
      name: 'settings',
      component: resolve => require(['@/views/account/Settings.vue'], resolve),
      meta: {
        title: '微贷系统-用户列表',
        crumbs: [{
          name: '用户管理',
          to: { name: 'accountList' }
        }, {
          name: '用户列表',
          to: { name: 'settings' }
        }]
      }
    }]
  }]
}]
