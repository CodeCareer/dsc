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
  }]
}]
