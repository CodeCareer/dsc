export default [{
  path: '/',
  redirect: { name: 'productsRelease' }
}, {
  path: '/login',
  name: 'login',
  component: resolve => require(['@/views/Login.vue'], resolve),
  meta: { title: '微贷系统-登录', skipAuth: true }
}, {
  path: '/wd',
  name: 'wd',
  redirect: { name: 'productsRelease' },
  component: resolve => require(['@/views/WdLayout.vue'], resolve),
  children: [{
    path: 'products_manage',
    name: 'productsManage',
    redirect: { name: 'productsRelease' },
    component: {
      render(h) {
        return h('router-view')
      }
    },
    children: [{
      path: 'products_release',
      name: 'productsRelease',
      component: resolve => require(['@/views/product_manage/ProductsRelease.vue'], resolve),
      meta: {
        title: '微贷系统-产品发行管理',
        crumbs: [{
          name: '产品管理',
          to: { name: 'productsRelease' }
        }, {
          name: '产品发行管理',
          to: { name: 'productsRelease' }
        }]
      }
    }, {
      path: 'products_release/:id',
      name: 'productsReleaseForm',
      component: resolve => require(['@/views/product_manage/ProductsReleaseForm.vue'], resolve),
      meta: {
        title: '微贷系统-产品发行审核',
        crumbs: [{
          name: '产品管理',
          to: { name: 'productsRelease' }
        }, {
          name: '产品发行管理',
          to: { name: 'productsRelease' }
        }, {
          id: 'productsReleaseForm',
          name: '产品发行审核',
          to: { name: 'productsReleaseForm' }
        }]
      }
    }]
  }, {
    path: 'asset_manage',
    name: 'assetManage',
    redirect: { name: 'assetInfo' },
    component: {
      render(h) {
        return h('router-view')
      }
    },
    children: [{
      path: 'asste_info',
      name: 'assetInfo',
      component: resolve => require(['@/views/asset_manage/AssetInfo.vue'], resolve),
      meta: {
        title: '微贷系统-资产全部信息',
        crumbs: [{
          name: '资产管理',
          to: { name: 'assetInfo' }
        }, {
          name: '资产全部信息',
          to: { name: 'assetInfo' }
        }]
      }
    }, {
      path: 'asste_info/:productCode',
      name: 'assetInfoForm',
      component: resolve => require(['@/views/asset_manage/AssetInfoForm.vue'], resolve),
      meta: {
        title: '微贷系统-资产全部信息',
        crumbs: [{
          name: '资产管理',
          to: { name: 'assetInfo' }
        }, {
          name: '资产全部信息',
          to: { name: 'assetInfo' }
        }, {
          name: '资产全部信息详情',
          to: { name: 'assetInfoForm' }
        }]
      }
    }, {
      path: 'back_record',
      name: 'backRecord',
      component: resolve => require(['@/views/asset_manage/BackRecord.vue'], resolve),
      meta: {
        title: '微贷系统-资产回购记录',
        crumbs: [{
          name: '资产管理',
          to: { name: 'assetInfo' }
        }, {
          name: '回购记录',
          to: { name: 'backRecord' }
        }]
      }
    }, {
      path: 'fact_repay',
      name: 'factRepay',
      component: resolve => require(['@/views/asset_manage/FactRepay.vue'], resolve),
      meta: {
        title: '微贷系统-资产实际还款',
        crumbs: [{
          name: '资产管理',
          to: { name: 'assetInfo' }
        }, {
          name: '实际还款',
          to: { name: 'factRepay' }
        }]
      }
    }, {
      path: 'repay_plan',
      name: 'repayPlan',
      component: resolve => require(['@/views/asset_manage/RepayPlan.vue'], resolve),
      meta: {
        title: '微贷系统-资产还款计划',
        crumbs: [{
          name: '资产管理',
          to: { name: 'assetInfo' }
        }, {
          name: '还款计划',
          to: { name: 'repayPlan' }
        }]
      }
    }]
  }, {
    path: 'fund_manage',
    name: 'fundManage',
    redirect: { name: 'fundDepositDetail' },
    component: {
      render(h) {
        return h('router-view')
      }
    },
    children: [{
      path: 'fund_deposit_detail',
      name: 'fundDepositDetail',
      component: resolve => require(['@/views/fund_manage/FundDepositDetail.vue'], resolve),
      meta: {
        title: '微贷系统-入金明细信息',
        crumbs: [{
          name: '资金管理',
          to: { name: 'fundAccountManage' }
        }, {
          name: '入金明细信息',
          to: { name: 'fundDepositDetail' }
        }]
      }
    }, {
      path: 'account_deposit_manage',
      name: 'accountDepositManage',
      component: resolve => require(['@/views/fund_manage/AccountDepositManage.vue'], resolve),
      meta: {
        title: '微贷系统-账户入金管理',
        crumbs: [{
          name: '资金管理',
          to: { name: 'fundAccountManage' }
        }, {
          name: '账户入金管理',
          to: { name: 'accountDepositManage' }
        }]
      }
    }, {
      path: 'account_deposit/:id',
      name: 'accountDepositForm',
      component: resolve => require(['@/views/fund_manage/AccountDepositForm.vue'], resolve),
      meta: {
        title: '微贷系统-账户入金管理',
        crumbs: [{
          name: '资金管理',
          to: { name: 'fundAccountManage' }
        }, {
          name: '账户入金管理',
          to: { name: 'accountDepositManage' }
        }, {
          id: 'accountDepositForm',
          name: '新增账户入金',
          to: { name: 'accountDepositForm' }
        }]
      }
    }, {
      path: 'fund_account_manage',
      name: 'fundAccountManage',
      component: resolve => require(['@/views/fund_manage/FundAccountManage.vue'], resolve),
      meta: {
        title: '微贷系统-资金账户管理',
        crumbs: [{
          name: '资金管理',
          to: { name: 'fundAccountManage' }
        }, {
          name: '资金账户管理',
          to: { name: 'fundAccountManage' }
        }]
      }
    }, {
      path: 'fund_account_manage/:id',
      name: 'fundAccountForm',
      component: resolve => require(['@/views/fund_manage/FundAccountForm.vue'], resolve),
      meta: {
        title: '微贷系统-资金账户管理',
        crumbs: [{
          name: '资金管理',
          to: { name: 'fundAccountManage' }
        }, {
          name: '资金账户管理',
          to: { name: 'fundAccountManage' }
        }, {
          id: 'fundAccountForm',
          name: '新增资金账户',
          to: { name: 'fundAccountForm' }
        }]
      }
    }]
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
          name: '准入校验结果',
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
          name: '风险规则模板',
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
          name: '风险预警监控',
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
      path: 'car_info/:id',
      name: 'carInfoForm',
      component: resolve => require(['@/views/base_data/CarInfoForm.vue'], resolve),
      meta: {
        title: '微贷系统-基础车型信息管理',
        crumbs: [{
          name: '基础数据管理',
          to: { name: 'carInfo' }
        }, {
          name: '基础车型信息',
          to: { name: 'carInfo' }
        }, {
          id: 'carInfoForm',
          name: '新增基础车型',
          to: { name: 'carInfoForm' }
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
      path: 'accounts',
      name: 'accounts',
      component: resolve => require(['@/views/account/Accounts.vue'], resolve),
      meta: {
        title: '微贷系统-用户列表',
        crumbs: [{
          name: '用户管理',
          to: { name: 'accounts' }
        }, {
          name: '用户列表',
          to: { name: 'accounts' }
        }]
      }
    }, {
      path: 'accounts/:id',
      name: 'accountForm',
      component: resolve => require(['@/views/account/AccountForm.vue'], resolve),
      meta: {
        title: '微贷系统-用户管理',
        crumbs: [{
          name: '用户管理',
          to: { name: 'accounts' }
        }, {
          name: '用户列表',
          to: { name: 'accounts' }
        }, {
          id: 'accountForm',
          name: '新增用户',
          to: { name: 'accountForm' }
        }]
      }
    }, {
      path: 'roles',
      name: 'roles',
      component: resolve => require(['@/views/account/Roles.vue'], resolve),
      meta: {
        title: '微贷系统-角色列表',
        crumbs: [{
          name: '用户管理',
          to: { name: 'accountList' }
        }, {
          name: '角色列表',
          to: { name: 'roles' }
        }]
      }
    }, {
      path: 'roles/:id',
      name: 'roleForm',
      component: resolve => require(['@/views/account/RoleForm.vue'], resolve),
      meta: {
        title: '微贷系统-用户管理',
        crumbs: [{
          name: '用户管理',
          to: { name: 'accounts' }
        }, {
          name: '角色列表',
          to: { name: 'roles' }
        }, {
          id: 'roleForm',
          name: '新增角色',
          to: { name: 'roleForm' }
        }]
      }
    }, {
      path: 'settings',
      name: 'settings',
      component: resolve => require(['@/views/account/Settings.vue'], resolve),
      meta: {
        title: '微贷系统-个人设置',
        crumbs: [{
          name: '用户管理',
          to: { name: 'accountList' }
        }, {
          name: '个人设置',
          to: { name: 'settings' }
        }]
      }
    }]
  }]
}]
