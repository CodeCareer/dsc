<template lang="pug">
  section.account-list
    .box
      .box-header
        h3 筛选条件
        .buttons
          el-button(type="primary", size="small", v-if="$permit('accountAdd')", @click="addAccount()")
            i.iconfont.icon-add
            | 新增
      .filters
        el-select(placeholder="角色", v-model="filter.roleId", @change="search")
          el-option(v-for="o in roleList", :value="o.value", :label="o.name", :key="o.value")
        el-select(placeholder="状态", v-model="filter.enabled", @change="search")
          el-option(v-for="o in statusList", :value="o.value", :label="o.name", :key="o.value")
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='accountList', style='width: 100%')
        el-table-column(prop='userName', label='用户名称', width='150')
        el-table-column(prop='nickname', label='用户昵称', width='150')
        el-table-column(prop='phoneNumber', label='手机号')
        el-table-column(prop='email', label='邮箱', width='150')
        el-table-column(prop='roles', label='角色', width='120')
          template(scope="scope")
            span {{scope.row.roles | rolesStringify}}
        //- el-table-column(prop='lastLoginTime', label='上次登录时间', width='200')
          template(scope="scope")
            span {{scope.row.lastLoginTime | moment('YYYY-MM-DD HH:mm:ss')}}
        el-table-column(prop='enabled', label='状态', width='120')
          template(scope="scope")
            span(:class="scope.row.enabled | statusClass") {{scope.row.enabled | statusFormat}}
        el-table-column(label='操作', :fixed="fixed", width='80')
          template(scope="scope")
            .operations
              i.iconfont.icon-qiyong(v-if="!scope.row.enabled && $permit('accountUpdateEable')", title="启用用户", @click="startAccount(scope.row)")
              i.iconfont.icon-tingyong(v-if="scope.row.enabled && $permit('accountUpdateEable')", title="停用用户", @click.stop="stopAccount(scope.row)")
              i.iconfont.icon-edit(v-if="$permit('accountUpdate')", title="修改用户", @click.stop="editAccount(scope.row)")
              //- i.iconfont.icon-delete(v-if="$permit('accountDelete')", title="删除用户", @click.stop="deleteAccount(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.size)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find,
  map
} from 'lodash'
import {
  accounts,
  account,
  accountUpdateEable,
  roles
} from '@/common/resource_auth.js'
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
    rolesStringify(value) {
      return map(value, 'roleNickname').join('，')
    },
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
    addAccount() {
      this.$router.push({
        name: 'accountForm',
        params: {
          id: 'add'
        }
      })
    },

    editAccount(account) {
      this.$router.push({
        name: 'accountForm',
        params: {
          id: account.id
        }
      })
    },

    startAccount(account) {
      this.$confirm(`此操作将启用${account.userName}, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        accountUpdateEable.post({
          id: account.id,
          enabled: 1
        }).then(res => {
          account.enabled = 1
          this.$message.success(`用户${account.userName}已启用！`)
        })
      }).catch(() => {})
    },

    stopAccount(account) {
      this.$confirm(`此操作将停用${account.userName}, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        accountUpdateEable.post({
          id: account.id,
          enabled: 0
        }).then(res => {
          account.enabled = 0
          this.$message.success(`用户${account.userName}已停用！`)
        })
      }).catch(() => {})
    },

    deleteAccount(accountObj) {
      this.$confirm(`此操作将删除${accountObj.accountName}, 是否继续?`, '提示', {
        type: 'warning'
      }).then(() => {
        account.delete({
          id: accountObj.id
        }).then(res => {
          accountObj.enabled = 0
          this.$message.success(`账户${accountObj.accountName}已删除！`)
        })
      }).catch(() => {})
    },

    _fetchData() {
      accounts.get({
        loadingMaskTarget: '.account-list',
        params: {
          ...this.pruneParams(this.filter)
        }
      }).then(res => {
        const data = res.data.data
        this.accountList = data.content
        this.page.total = data.totalElements
      })
    }
  },

  watch: {
    $route() {
      this._fetchData()
    }
  },

  mounted() {
    merge(this.filter, this.$route.query)
    this._fetchData()

    roles.get({
      params: {
        orgId: this.$store.getters.orgId
      }
    }).then(res => {
      const roles = map(res.data.data.content, v => {
        return {
          name: v.roleNickname,
          value: v.id
        }
      })
      roles.unshift({
        name: '全部',
        value: '_all_'
      })
      this.roleList = roles
    })
  },

  data() {
    return {
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      accountList: [],
      roleList: [],
      statusList,
      filter: {
        orgId: this.$store.getters.orgId, // 需要提供
        roleId: '_all_',
        enabled: '_all_',
        page: 1,
        size: 10
      }
    }
  }
}
</script>
