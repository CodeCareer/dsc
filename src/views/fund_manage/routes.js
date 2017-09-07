export default {
  path: 'fund_manage',
  name: 'fundManage',
  redirect: { name: 'fundDepositDetail' },
  component: {
    render(h) {
      return h('router-view')
    }
  },
  meta: {
    permit: [
      'fundDeposit',
      'fundAccountManage',
      'fundAccountEdit',
      'fundAccountAdd',
      'fundAccountDelete',
      'fundAccountSeria',
      'fundAccountSeriaAdd',
      'fundAccountSeriaDelete',
      'fundAccountSeriaUpload',
      'fundAutoCheckUp',
      'fundManualCheckUp'
    ],
    menu: {
      name: '资金管理',
      icon: 'icon-money'
    }
  },
  children: [{
    path: 'fund_account_manage',
    name: 'fundAccountManage',
    component: resolve => require(['@/views/fund_manage/FundAccountManage.vue'], resolve),
    meta: {
      title: '车DAS系统-资金账户管理',
      permit: ['fundAccountManage', 'fundAccountEdit', 'fundAccountAdd', 'fundAccountDelete'],
      menu: {
        name: '资金账户管理',
        activeIncludes: ['fundAccountManage', 'fundAccountForm']
      },
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
      title: '车DAS系统-资金账户管理',
      permit: ['fundAccountAdd', 'fundAccountEdit'],
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
  }, {
    path: 'fund_deposit_detail',
    name: 'fundDepositDetail',
    component: resolve => require(['@/views/fund_manage/fundDepositDetail.vue'], resolve),
    meta: {
      title: '车DAS系统-入金明细信息',
      permit: ['fundDeposit', 'fundAutoCheckUp'],
      menu: {
        name: '入金明细信息',
        activeIncludes: ['fundDepositDetail', 'fundDepositDetailForm']
      },
      crumbs: [{
        name: '资金管理',
        to: { name: 'fundAccountManage' }
      }, {
        name: '入金明细信息',
        to: { name: 'fundDepositDetail' }
      }]
    }
  }, {
    path: 'fund_deposit_detail_form/:assetId',
    name: 'fundDepositDetailForm',
    component: resolve => require(['@/views/fund_manage/fundDepositDetailForm.vue'], resolve),
    meta: {
      title: '车DAS系统-入金明细信息详情',
      permit: ['fundDeposit', 'fundManualCheckUp'],
      crumbs: [{
        name: '资金管理',
        to: { name: 'fundDepositDetail' }
      }, {
        name: '入金明细信息',
        to: { name: 'fundDepositDetail' }
      }, {
        id: 'fundDepositDetailForm',
        name: '入金明细信息详情',
        to: { name: 'fundDepositDetailForm' }
      }]
    }
  }, {
    path: 'fund_account_serial',
    name: 'fundAccountSerial',
    component: resolve => require(['@/views/fund_manage/fundAccountSerial.vue'], resolve),
    meta: {
      title: '车DAS系统-资金账户流水',
      permit: ['fundAccountSerial', 'fundAccountDelete'],
      menu: {
        name: '资金账户流水',
        activeIncludes: ['fundAccountSerial', 'fundAccountSeriaForm']
      },
      crumbs: [{
        name: '资金管理',
        to: { name: 'fundAccountManage' }
      }, {
        name: '资金账户流水',
        to: { name: 'fundAccountSerial' }
      }]
    }
  }, {
    path: 'fund_account_serial_form/:uuid',
    name: 'fundAccountSerialForm',
    component: resolve => require(['@/views/fund_manage/fundAccountSerialForm.vue'], resolve),
    meta: {
      title: '车DAS系统-资金账户流水',
      permit: ['fundAccountSerialAdd'],
      crumbs: [{
        name: '资金管理',
        to: { name: 'fundAccountManage' }
      }, {
        name: '资金账户流水',
        to: { name: 'fundAccountSerial' }
      }, {
        id: 'fundAccountSerialForm',
        name: '新增资金账户流水',
        to: { name: 'fundAccountSerialForm' }
      }]
    }
  }, {
    path: 'fund_account_serial_upload',
    name: 'fundAccountSerialUpload',
    component: resolve => require(['@/views/fund_manage/fundAccountSerialUpload.vue'], resolve),
    meta: {
      title: '车DAS系统-导入资金账户流水',
      permit: ['fundAccountSerialUpload'],
      crumbs: [{
        name: '资金管理',
        to: { name: 'fundAccountManage' }
      }, {
        name: '资金账户流水',
        to: { name: 'fundAccountSerial' }
      }, {
        id: 'fundAccountSerialUpload',
        name: '导入资金账户流水',
        to: { name: 'fundAccountSerialUpload' }
      }]
    }
  }]
}
