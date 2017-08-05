<template lang="pug">
  .authority-dialog
    el-dialog(:title="title", v-model="dialogVisible",  @open="onDialogOpen", size="large")
      el-form(:model='role', :rules="rules", ref="roleForm", :label-width='formLabelWidth')
        .authority-table.bd
          table
            tr(v-for="module in permissions")
              th.bd-b.bd-r
                el-checkbox.circle.mini(@change="handleCheckAllChange($event, module)", :indeterminate="module.indeterminate" v-model="module.check") {{module.name}}
              td.bd-b
                el-checkbox-group(v-model="module.checkedList", @change="handleCheckChange(module)")
                  el-checkbox.circle.mini(v-for="o in module.functions", :label="o.id") {{o.name}}
      .dialog-footer(slot="footer")
        el-button(type="primary", size="small", @click='roleSave') 确定
        el-button(type='gray', size="small", @click='dialogVisible = false') 取消
</template>

<script>
import {
  map,
  each,
  some,
  filter,
  flattenDeep,
  every
  // includes
} from 'lodash'
import {
  permissions,
  roleAddPermission
} from '@/common/resource_auth.js'

export default {
  methods: {
    handleCheckAllChange(event, module) {
      module.checkedList = event.target.checked ? map(module.functions, 'id') : []
      module.indeterminate = false
    },

    handleCheckChange(module) {
      const checkedCount = module.checkedList.length
      module.check = checkedCount === module.functions.length
      module.indeterminate = checkedCount > 0 && checkedCount < module.functions.length
    },

    open(role) {
      this.role = role
      this.title = `角色权限设置-${role.roleName}`
      this.dialogVisible = true

      permissions.get({
        params: {
          roleId: role.id
        },
        loadingMaskTarget: '.authority-dialog'
      }).then(res => {
        each(res.data.data, p => {
          p.indeterminate = some(p.functions, f => f.check) && some(p.functions, f => !f.check)
          p.check = every(p.functions, f => f.check)
          p.checkedList = map(filter(p.functions, f => {
            return f.check
          }), f => f.id)
        })
        this.permissions = res.data.data
      })
    },

    onDialogOpen() {
      this.$nextTick(() => this.$refs.roleForm.resetFields())
    },

    roleSave() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          roleAddPermission.post({
            id: this.role.id,
            permissionIds: flattenDeep(map(this.permissions, p => p.checkedList)).join()
          }).then(res => {
            this.$message.success('权限设置成功！')
            this.dialogVisible = false
          })
        }
      })
    }
  },

  data() {
    return {
      title: '角色权限设置',
      role: {},
      permissions: [],
      rules: {},
      formLabelWidth: '120px',
      dialogVisible: false
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/_vars.scss";
.authority-table {
  width: 100%;
  font-size: 12px;
  &.bd {
    border: 1px solid $border-color;
  }
  table {
    width: 100%;
  }
  &.short-view {
    max-height: 250px;
    overflow: hidden;
  }
  .bd-b {
    th,
    td {
      border-bottom: 1px solid $border-color;
    }
  }
  tr {
    &:last-of-type {
      .bd-b {
        border-bottom: 0;
      }
    }
  }
  th,
  td {
    padding: 12px 10px;
  }
  th {
    color: #54637a;
    // font-weight: normal;
    max-width: 160px;
    // padding-left: 20px;
    text-align: left;
    .el-checkbox {
      color: #54637a;
    }
  }
}
</style>
