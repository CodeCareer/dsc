<template lang="pug">
  section.role-list
    .box
      .box-header
        h3 筛选条件
        .buttons
          el-button(type="primary", size="small", @click="addRole()", v-if="$permit('roleAdd')")
            i.iconfont.icon-add
            | 新增
      .filters
        el-select(placeholder="状态", v-model="filter.enabled", @change="search()")
          el-option(v-for="o in statusList", :value="o.value", :label="o.name", :key="o.value")
        el-button(size="small", type="primary", @click="search()")  搜索
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='roleList', style='width: 100%')
        el-table-column(prop='roleName', label='角色名称', width='200')
        el-table-column(prop='roleNickname', label='角色昵称', width='200')
        el-table-column(prop='note', label='备注')
        el-table-column(prop='enabled', label='状态', width='120')
          template(scope="scope")
            span(:class="scope.row.enabled | statusClass") {{scope.row.enabled | statusFormat}}
        el-table-column(label='操作', width="120", v-if="$permit(['roleUpdateEable', 'roleUpdate', 'roleAddPermission'])")
          template(scope="scope")
            .operations
              i.iconfont.icon-qiyong(v-if="!scope.row.enabled && $permit('roleUpdateEable')", title="启用角色", @click="startRole(scope.row)")
              i.iconfont.icon-tingyong(v-if="scope.row.enabled && $permit('roleUpdateEable')", title="停用角色", @click.stop="stopRole(scope.row)")
              i.iconfont.icon-edit(v-if="$permit('roleDetail')", title="修改角色", @click.stop="editRole(scope.row)")
              //- i.iconfont.icon-delete(v-if="$permit('roleDelete')", title="删除角色", @click.stop="deleteRole(scope.row)")
              i.iconfont.icon-quanxian(v-if="$permit('roleAddPermission')", title="权限设置", @click.stop="editAuthority(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.size)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
    role-authority-dialog(ref="authorityDialog")
</template>

<script>
import {
  merge,
  find
} from 'lodash'
import {
  roleUpdateEable,
  roles,
  role
} from '@/common/resource_auth.js'
import {
  tableListMixins
} from '@/common/mixins.js'
import RoleAuthorityDialog from '@/views/account/RoleAuthorityDialog.vue'

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
  components: {
    RoleAuthorityDialog
  },
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
    addRole() {
      this.$router.push({
        name: 'roleForm',
        params: {
          id: 'add'
        }
      })
    },

    pageSizeChange(val) {
      this.filter.size = val
      this.search(true)
    },

    editRole(role) {
      this.$router.push({
        name: 'roleForm',
        params: {
          id: role.id
        }
      })
    },

    startRole(role) {
      this.$confirm(`此操作将启用${role.roleName}, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        roleUpdateEable.post({
          id: role.id,
          enabled: 1
        }).then(res => {
          role.enabled = 1
          this.$message.success(`角色${role.roleName}已启用！`)
        })
      }).catch(() => {})
    },

    stopRole(role) {
      this.$confirm(`此操作将停用${role.roleName}, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        roleUpdateEable.post({
          id: role.id,
          enabled: 0
        }).then(res => {
          role.enabled = 0
          this.$message.success(`角色${role.roleName}已停用！`)
        })
      }).catch(() => {})
    },

    editAuthority(role) {
      this.$refs.authorityDialog.open(role)
    },

    deleteRole(roleObj) {
      this.$confirm(`此操作将删除${roleObj.roleName}, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        role.delete({
          id: roleObj.id
        }).then(res => {
          roleObj.enabled = 0
          this.$message.success(`角色${roleObj.roleName}已删除！`)
        })
      }).catch(() => {})
    },

    _fetchData() {
      roles.get({
        loadingMaskTarget: '.role-list',
        params: {
          orgId: this.$store.getters.orgId,
          ...this.pruneParams(this.filter)
        }
      }).then(res => {
        const data = res.data.data
        this.roleList = data.content
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
      roleList: [],
      statusList,
      filter: {
        // roleId: '_all_',
        enabled: '',
        page: 1,
        size: 10
      }
    }
  }
}
</script>
