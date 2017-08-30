export default {
  path: 'base_data',
  name: 'baseData',
  redirect: { name: 'carInfo' },
  component: {
    render(h) {
      return h('router-view')
    }
  },
  meta: {
    permit: [
      'carInfoList', 'carInfoDetail', 'carInfoAdd',
      'carInfoUpdate', 'carGpsList', 'carMatchList',
      'carMatchUpdate'
    ],
    menu: {
      name: '三方数据',
      icon: 'icon-data'
    }
  },
  children: [{
    path: 'car_info',
    name: 'carInfo',
    component: resolve => require(['@/views/base_data/CarInfo.vue'], resolve),
    meta: {
      title: '微贷系统-基础车型信息管理',
      permit: ['carInfoList', 'carInfoDetail', 'carInfoAdd', 'carInfoUpdate'],
      menu: {
        name: '基础车型',
        activeIncludes: ['carInfo', 'carInfoForm']
      },
      crumbs: [{
        name: '三方数据',
        to: { name: 'carInfo' }
      }, {
        name: '基础车型',
        to: { name: 'carInfo' }
      }]
    }
  }, {
    path: 'car_info/:id',
    name: 'carInfoForm',
    component: resolve => require(['@/views/base_data/CarInfoForm.vue'], resolve),
    meta: {
      title: '微贷系统-基础车型信息管理',
      permit: ['carInfoDetail', 'carInfoAdd', 'carInfoUpdate'],
      crumbs: [{
        name: '三方数据',
        to: { name: 'carInfo' }
      }, {
        name: '基础车型',
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
      permit: ['carMatchList', 'carMatchUpdate'],
      menu: {
        name: '车型匹配'
      },
      crumbs: [{
        name: '三方数据',
        to: { name: 'carInfo' }
      }, {
        name: '车型匹配',
        to: { name: 'carMatch' }
      }]
    }
  }, {
    path: 'car_gps',
    name: 'carGps',
    component: resolve => require(['@/views/base_data/CarGps.vue'], resolve),
    meta: {
      title: '微贷系统-GPS数据查询',
      permit: ['carGpsList'],
      menu: {
        name: 'GPS数据'
      },
      crumbs: [{
        name: '三方数据',
        to: { name: 'carInfo' }
      }, {
        name: 'GPS数据',
        to: { name: 'carGps' }
      }]
    }
  }]
}
