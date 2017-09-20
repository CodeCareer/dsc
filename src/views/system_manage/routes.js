export default {
  path: 'system_manage',
  name: 'systemManage',
  redirect: { name: 'systemConfig' },
  component: {
    render(h) {
      return h('router-view')
    }
  },
  meta: {
    permit: [
      'sysConfigList',
      'sysConfigUpdate'
    ],
    menu: {
      name: '系统管理',
      icon: 'icon-system'
    }
  },
  children: [{
    path: 'system_config',
    name: 'systemConfig',
    component: resolve => require(['@/views/system_manage/SystemConfig.vue'], resolve),
    meta: {
      title: '系统配置项',
      permit: ['sysConfigList', 'sysConfigUpdate'],
      menu: {
        name: '系统配置项',
        activeIncludes: ['systemConfig', 'systemConfigForm']
      },
      crumbs: [{
        name: '系统管理',
        to: { name: 'systemConfig' }
      }, {
        name: '系统配置项',
        to: { name: 'systemConfig' }
      }]
    }
  }, {
    path: 'system_config_form/:id',
    name: 'systemConfigForm',
    component: resolve => require(['@/views/system_manage/SystemConfigForm.vue'], resolve),
    meta: {
      title: '系统配置项',
      permit: ['sysConfigUpdate'],
      crumbs: [{
        name: '系统管理',
        to: { name: 'systemConfig' }
      }, {
        name: '系统配置项',
        to: { name: 'systemConfig' }
      }, {
        id: 'fundAccountForm',
        name: '修改系统配置项',
        to: { name: 'systemConfigForm' }
      }]
    }
  }]
}
