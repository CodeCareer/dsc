export default {
  path: 'asset_manage',
  name: 'assetManage',
  redirect: { name: 'assetInfo' },
  component: {
    render(h) {
      return h('router-view')
    }
  },
  meta: {
    permit: ['assetInfo', 'backRecord', 'factRepay', 'repayPlan'],
    menu: {
      icon: 'icon-assets',
      name: '资产管理'
    }
  },
  children: [{
    path: 'asste_info',
    name: 'assetInfo',
    component: resolve => require(['@/views/asset_manage/AssetInfo.vue'], resolve),
    meta: {
      title: '微贷系统-资产全部信息',
      permit: ['assetInfo'],
      menu: {
        name: '资产信息',
        activeIncludes: ['assetInfo', 'assetInfoForm']
      },
      crumbs: [{
        name: '资产管理',
        to: { name: 'assetInfo' }
      }, {
        name: '资产全部信息',
        to: { name: 'assetInfo' }
      }]
    }
  }, {
    path: 'asste_info/:outerAssetOrderNo',
    name: 'assetInfoForm',
    component: resolve => require(['@/views/asset_manage/AssetInfoForm.vue'], resolve),
    meta: {
      title: '微贷系统-资产全部信息',
      permit: ['assetInfo'],
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
      permit: ['backRecord'],
      menu: {
        name: '回购记录'
      },
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
      permit: ['factRepay'],
      menu: {
        name: '实际还款'
      },
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
      permit: ['repayPlan'],
      menu: {
        name: '还款计划',
        activeIncludes: ['repayPlan', 'repayPlanDetail']
      },
      crumbs: [{
        name: '资产管理',
        to: { name: 'assetInfo' }
      }, {
        name: '还款计划',
        to: { name: 'repayPlan' }
      }]
    }
  }, {
    path: 'repay_plan/:id',
    name: 'repayPlanDetail',
    component: resolve => require(['@/views/asset_manage/RepayPlanDetail.vue'], resolve),
    meta: {
      title: '微贷系统-资产还款计划详情',
      permit: ['repayPlan'],
      crumbs: [{
        name: '资产管理',
        to: { name: 'assetInfo' }
      }, {
        name: '还款计划',
        to: { name: 'repayPlan' }
      }, {
        name: '还款计划详情',
        to: { name: 'repayPlanDetail' }
      }]
    }
  }]
}
