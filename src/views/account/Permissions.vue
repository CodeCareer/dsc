<template lang="pug">
  section.permission-list
    .box
      .box-header
        h3 筛选条件
        .buttons
          el-button(type="primary", size="small", @click="addPermission()", v-if="$permit('permissionAdd')")
            i.iconfont.icon-add
            | 新增
      .filters
        el-select(placeholder="状态", v-model="filter.enabled", @change="search")
          el-option(v-for="o in statusList", :value="o.value", :label="o.name", :key="o.value")
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='permissionList', style='width: 100%')
        el-table-column(prop='permissionName', label='权限名称', width='200')
        el-table-column(prop='permissionNickname', label='权限昵称', width='200')
        el-table-column(prop='note', label='备注')
        el-table-column(prop='enabled', label='状态', width='120')
          template(scope="scope")
            span(:class="scope.row.enabled | statusClass") {{scope.row.enabled | statusFormat}}
        el-table-column(label='操作', width="100", v-if="$permit(['permissionUpdateEable', 'permissionUpdate'])")
          template(scope="scope")
            .operations
              i.iconfont.icon-qiyong(v-if="!scope.row.enabled && $permit('permissionUpdateEable')", title="启用权限", @click="startPermission(scope.row)")
              i.iconfont.icon-tingyong(v-if="scope.row.enabled && $permit('permissionUpdateEable')", title="停用权限", @click.stop="stopPermission(scope.row)")
              i.iconfont.icon-edit(v-if="$permit('permissionUpdate')", title="修改权限", @click.stop="editPermission(scope.row)")
              //- i.iconfont.icon-quanxian(v-if="$permit('permissionDelete')", title="删除权限", @click.stop="deletePermission(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.size)", layout='total, prev, pager, next, jumper, ->, sizes', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'
import {
  permissionUpdateEable,
  permissions,
  permission
} from '@/common/resource_auth.js'
import {
  pruneParams
} from '@/common/util.js'
import {
  tableListMixins
} from '@/common/mixins.js'

const statusList = [{
  name: '全部',
  value: '_all_'
}, {
  name: '已启用',
  value: 1
}, {
  name: '已停用',
  value: 0
}]

export default {
  mixins: [tableListMixins],
  filters: {
    statusClass(value) {
      const classMap = {
        '1': 'color-green',
        '0': 'color-red'
      }
      return classMap[+value] || ''
    },
    statusFormat(value) {
      const status = find(statusList, s => s.value === +value)
      return status ? status.name : '未知状态'
    }
  },

  methods: {
    addPermission() {
      this.$router.push({
        name: 'permissionForm',
        params: {
          id: 'add'
        }
      })
    },

    editPermission(permission) {
      this.$router.push({
        name: 'permissionForm',
        params: {
          id: permission.id
        }
      })
    },

    startPermission(permission) {
      this.$confirm(`此操作将启用${permission.permissionName}, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        permissionUpdateEable.post({
          id: permission.id,
          enabled: 1
        }).then(res => {
          permission.enabled = 1
          this.$message.success(`权限${permission.permissionName}已启用！`)
        })
      }).catch(() => {})
    },

    stopPermission(permission) {
      this.$confirm(`此操作将停用${permission.permissionName}, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        permissionUpdateEable.post({
          id: permission.id,
          enabled: 0
        }).then(res => {
          permission.enabled = 0
          this.$message.success(`权限${permission.permissionName}已停用！`)
        })
      }).catch(() => {})
    },

    deletePermission(permissionObj) {
      this.$confirm(`此操作将删除${permissionObj.permissionName}, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        permission.delete({
          id: permissionObj.id
        }).then(res => {
          permissionObj.enabled = 0
          this.$message.success(`权限${permissionObj.permissionName}已删除！`)
        })
      }).catch(() => {})
    },

    _fetchData() {
      permissions.get({
        loadingMaskTarget: '.permission-list',
        params: {
          ...pruneParams(this.filter)
        }
      }).then(res => {
        const data = res.data.data
        this.permissionList = data.content
        this.page.total = data.totalElements
      })
    }
  },

  watch: {
    $route() {
      this._fetchData()
    }
  },

  created() {
    merge(this.filter, this.$route.query)
    this._fetchData()
  },

  data() {
    return {
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      permissionList: [],
      statusList,
      filter: {
        // orgId: this.$store.getters.orgId, // 需要提供
        // permissionId: '_all_',
        enabled: '_all_',
        page: 1,
        size: 10
      }
    }
  }
}
</script>
