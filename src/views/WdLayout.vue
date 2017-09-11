<template lang="pug">
  .wd-content
    n-progress(parent=".wd-content")
    header
      span.logo
        img(src="../assets/images/logo.png")
        | 3TAN-DAS车贷资产管理系统
      .user-info.fr
        span
          i.iconfont.icon-user.icon-color
          | hi，{{user.nickname}}
        span.log-out(@click="logout()") 退出
    section.container(:style='containerStyles')
      aside
        el-menu(:unique-opened='true', :default-openeds="defaultOpeneds", :default-active="defaultActive", :router='true', ref="menus")
          template(v-for="menu in menus")
            el-submenu(v-if="menu.menus", :index="menu.index", v-show="!menu.hidden")
              template(slot='title')
                i.iconfont.icon-color(:class="menu.icon")
                | {{menu.name}}
              el-menu-item(v-for="item in menu.menus", :index='item.index', :route="item.route", :key="item.index", v-show="!item.hidden") {{item.name}}
            el-menu-item(v-else, :index='menu.index', :route="menu.route", v-show="!menu.hidden")
              i.iconfont.icon-color(:class="menu.icon")
              | {{menu.name}}
      .body(:style='containerStyles')
        el-breadcrumb
          el-breadcrumb-item(v-for="crumb in crumbs", :to="crumb.to", :key="crumb.name") {{crumb.name}}
        router-view.body-container
        footer
          p ©2017 杭州科峰信息服务有限公司
</template>

<script>
import {
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem
} from 'element-ui'
import {
  startsWith,
  each,
  every,
  merge,
  cloneDeep,
  includes,
  find
} from 'lodash'
import NProgress from '@/components/NProgress.vue'
import {
  mapGetters,
  mapActions
} from 'vuex'
import routes from '@/router/routes.js'

const headerH = 60 // header高度

export default {
  components: {
    NProgress,
    ElMenu: Menu,
    ElSubmenu: Submenu,
    ElMenuItem: MenuItem,
    ElBreadcrumb: Breadcrumb,
    ElBreadcrumbItem: BreadcrumbItem
  },

  watch: {
    '$route' (to, from) {
      this.breadcrumbRefresh()
      this.getActive(this.menus)
    }
  },

  created() {
    // 更新面包屑中的占位符
    this.breadcrumbRefresh()
    this.updateCrumb.$on('update-crumbs', crumbs => {
      each(crumbs, cr => {
        let co = find(this.crumbs, c => c.id === cr.id)
        if (co) {
          co.name = cr.name
          co.placeholder = ''
        }
      })
    })

    this.getActive(this.menus)

    window.addEventListener('resize', e => {
      this.containerStyles.minHeight = `${window.innerHeight - headerH}px`
    })
  },

  computed: {
    ...mapGetters(['user'])
  },

  data() {
    const mainRoute = find(routes, r => r.name === 'wd')
    const menus = []
    // 构造路由数据
    each(mainRoute.children, (c1, i1) => {
      if (c1.meta.menu) {
        const menu = merge(cloneDeep(c1.meta.menu), {
          index: i1 + '',
          hidden: !this.$permit(c1.meta.permit)
        })

        if (c1.children) {
          menu.menus = []
          each(c1.children, (c2, i2) => {
            if (c2.meta.menu) {
              menu.menus.push(merge(cloneDeep(c2.meta.menu), {
                index: `${i1}-${i2}`,
                route: {
                  name: c2.name
                },
                hidden: !this.$permit(c2.meta.permit)
              }))
            }
          })
        } else {
          menu.route = {
            name: c1.name
          }
        }
        menus.push(menu)
      }
    })

    const data = {
      defaultOpeneds: [],
      defaultActive: '',
      crumbs: [],
      menus,
      containerStyles: {
        minHeight: (window.innerHeight - 60) + 'px'
      }
    }

    return data
  },

  methods: {
    startsWith: startsWith,
    breadcrumbRefresh() {
      this.crumbs = this.$route.meta.crumbs
    },
    ...mapActions(['logout']),
    getActive(menus) {
      every(menus, v => {
        if (v.route && (v.route.name === this.$route.name || includes(v.activeIncludes || [], this.$route.name))) {
          this.defaultActive = v.index
          if (~v.index.indexOf('-')) {
            this.defaultOpeneds = [v.index.split('-')[0]]
          } else {
            this.defaultOpeneds = [v.index]
          }
          return false
        } else if (v.menus) {
          this.getActive(v.menus)
        }
        return true
      })
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/_vars.scss';
$header-height: 60px;
$menu-width: 180px;
$menu-height: 50px;
.wd-content {
  header {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    height: $header-height;
    line-height: $header-height;
    background: #3e4b5c;
    z-index: 999;
    .log-out {
      cursor: pointer;
      &:hover {
        color: white;
      }
    }
    span.logo {
      font-size: 26px;
      color: #fff;
      img {
        width: 42px;
        margin: 12px 10px 0 10px;
        display: inline-block;
      }
    }
    .user-info {
      span {
        padding: 0 25px;
        text-align: center;
        color: $color-unimportant;
        font-size: 13px;
        &:first-child {
          height: 15px;
          border-right: 1px solid #2a313b;
        }
      }
      i {
        font-size: 12px;
        color: #5288b9;
        padding: 0 8px;
      }
    }
  }
  .el-breadcrumb__item__inner {
    &:hover {
      color: $primary-color;
    }
  }
  .el-breadcrumb {
    padding: 20px 12px 0;
    font-size: 12px;
  }
  aside {
    position: fixed;
    z-index: 100;
    top: $header-height;
    bottom: 0;
    left: 0;
    background: #2a313b;
    width: $menu-width;
    overflow-y: auto;
    .el-menu {
      background: none;
      color: #929aa3;
      list-style: none;
    }
    .el-submenu {
      border-bottom: 1px solid #363f4b;
      &:last-child {
        border-bottom: none;
      }
    }
    .el-submenu__title,
    .el-submenu~.el-menu-item {
      font-size: 15px;
      color: #818992;
      height: $menu-height;
      line-height: $menu-height;
      padding-left: 15px!important;
      &:hover {
        background: none;
      }
      &.is-active {
        color: white;
      }
      .icon-color {
        padding-right: 10px;
        color: #4c7ca9;
      }
      .icon-date {
        display: inline-block;
        transform: scale(0.9);
      }
    }
    .el-submenu .el-menu-item {
      font-size: 13px;
      color: #818992;
      min-width: auto;
      height: $menu-height - 5px;
      line-height: $menu-height - 5px;
      padding: 0 10px 0 42px!important;
      background: #37404c;
      &.is-active {
        color: white;
      }
      &:hover {
        color: white;
        background: #37404c;
      }
    }
  }
  .container {
    position: relative;
    padding-left: $menu-width;
    top: $header-height;
    .body {
      position: relative;
      padding-bottom: 120px;
    }
    .body-container {
      padding: 12px;
    }
    footer {
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 30px 0;
      font-size: 12px;
      color: #717d8f;
      width: 100%;
      background: #f3f6f8;
      p {
        text-align: center;
      }
    }
  }
}
</style>
