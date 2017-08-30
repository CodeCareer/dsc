import productRoutes from '@/views/product_manage/routes.js'
import assetRoutes from '@/views/asset_manage/routes.js'
import fundRoutes from '@/views/fund_manage/routes.js'
import riskRoutes from '@/views/risk_control/routes.js'
import baseDataRoutes from '@/views/base_data/routes.js'
import accountRoutes from '@/views/account/routes.js'

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
  children: [
    productRoutes,
    assetRoutes,
    fundRoutes,
    riskRoutes,
    baseDataRoutes,
    accountRoutes
  ]
}]
