export default {
  path: 'account',
  name: 'account',
  redirect: { name: 'accountList' },
  component: {
    render(h) {
      return h('router-view')
    }
  },
  meta: {
    permit: [
      'accountUpdateEable', 'accountUpdatePwd', 'accountList',
      'accountDetail', 'accountUpdate', 'accountAdd', 'accountDelete',
      'roleUpdateEable', 'roleDetail', 'roleUpdate', 'roleAdd', 'roleDelete',
      'roleList'
    ],
    menu: {
      icon: 'icon-users',
      name: '用户管理'
    }
  },
  children: [{
    path: 'accounts',
    name: 'accounts',
    component: resolve => require(['@/views/account/Accounts.vue'], resolve),
    meta: {
      title: '车DAS系统-用户列表',
      permit: [
        'accountList', 'accountUpdateEable', 'accountUpdate',
        'accountAdd', 'accountDelete'
      ],
      menu: {
        name: '用户列表',
        activeIncludes: ['accounts', 'accountForm']
      },
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
      title: '车DAS系统-用户管理',
      permit: ['accountUpdate', 'accountDetail', 'accountAdd'],
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
      title: '车DAS系统-角色列表',
      permit: [
        'roleUpdateEable', 'roleDetail', 'roleUpdate',
        'roleAdd', 'roleDelete', 'roleList'
      ],
      menu: {
        name: '角色列表',
        activeIncludes: ['roles', 'roleForm']
      },
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
      title: '车DAS系统-用户管理',
      permit: ['roleDetail', 'roleUpdate', 'roleAdd'],
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
    path: 'permissions', // 权限展示不开放
    name: 'permissions',
    component: resolve => require(['@/views/account/Permissions.vue'], resolve),
    meta: {
      title: '车DAS系统-角色列表',
      crumbs: [{
        name: '用户管理',
        to: { name: 'accountList' }
      }, {
        name: '角色列表',
        to: { name: 'permissions' }
      }]
    }
  }, {
    path: 'permissions/:id',
    name: 'permissionForm',
    component: resolve => require(['@/views/account/PermissionForm.vue'], resolve),
    meta: {
      title: '车DAS系统-用户管理',
      crumbs: [{
        name: '用户管理',
        to: { name: 'accounts' }
      }, {
        name: '角色列表',
        to: { name: 'permissions' }
      }, {
        id: 'permissionForm',
        name: '新增角色',
        to: { name: 'permissionForm' }
      }]
    }
  }, {
    path: 'settings',
    name: 'settings',
    component: resolve => require(['@/views/account/Settings.vue'], resolve),
    meta: {
      title: '车DAS系统-个人设置',
      permit: ['accountDetail', 'accountUpdatePwd'],
      menu: {
        name: '个人设置'
      },
      crumbs: [{
        name: '用户管理',
        to: { name: 'accountList' }
      }, {
        name: '个人设置',
        to: { name: 'settings' }
      }]
    }
  }]
}
