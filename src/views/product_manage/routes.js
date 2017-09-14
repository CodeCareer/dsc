export default {
  path: 'products_manage',
  name: 'productsManage',
  redirect: { name: 'productsRelease' },
  component: {
    render(h) {
      return h('router-view')
    }
  },
  meta: {
    permit: [
      'productsRelease',
      'productsAudit',
      'productRedeemPlan'
    ],
    menu: {
      icon: 'icon-layers',
      name: '产品管理'
    }
  },
  children: [{
    path: 'products_release',
    name: 'productsRelease',
    component: resolve => require(['@/views/product_manage/ProductsRelease.vue'], resolve),
    meta: {
      title: '车DAS系统-产品发行管理',
      permit: ['productsRelease', 'productsAudit'],
      menu: {
        name: '产品发行管理',
        activeIncludes: ['productsRelease', 'productsReleaseForm']
      },
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
      title: '车DAS系统-产品发行审核',
      permit: ['productsRelease'],
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
  }, {
    path: 'products_redeem_plan',
    name: 'productRedeemPlan',
    component: resolve => require(['@/views/product_manage/productRedeemPlan.vue'], resolve),
    meta: {
      title: '车DAS系统-产品回款计划',
      permit: ['productRedeemPlan'],
      menu: {
        name: '产品回款计划',
        activeIncludes: ['productRedeemPlan']
      },
      crumbs: [{
        name: '产品管理',
        to: { name: 'productsRelease' }
      }, {
        name: '产品回款计划',
        to: { name: 'productRedeemPlan' }
      }]
    }
  }]
}
