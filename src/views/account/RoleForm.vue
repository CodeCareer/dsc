<template lang="pug">
.role-form
  .box
    .box-header
      | {{title}}
    .box-content
      el-form(:model="role", :rules="rules", ref="roleForm", label-width="120px")
        el-row
          el-col(:span="12", :offset="6")
            .form-inner.center
              el-form-item(label="角色名称：", prop="name")
                el-input(:disabled='!!role.id', type="text", placeholder="请输入角色名称", v-model="role.name")
              el-form-item(label="角色昵称：", prop="nickname")
                el-input(type="text", placeholder="请输入角色昵称", v-model="role.nickname")
              el-form-item(label="备注：", prop="note")
                el-input(type="textarea", placeholder="请输入备注信息", v-model="role.note")
    .bottom-buttons
      el-button(type="primary", size="small", v-if="$permit(['roleAdd', 'roleUpdate'])", @click="submitForm") 保存
      el-button(type="gray", size="small", @click="cancel") 取消
</template>

<script>
import {
  role
} from '@/common/resource_auth.js'
import {
  merge
} from 'lodash'

export default {
  methods: {
    submitForm() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          role[this.role.id ? 'put' : 'post']({}, {
            params: this.pruneParams(this.role),
            loadingMaskTarget: '.role-form'
          }).then(res => {
            this.$message.success('保存成功！')
            this.$router.push({
              name: 'roles'
            })
          })
        }
      })
    },

    cancel() {
      this.$confirm('内容尚未保存，确定取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.back()
      }).catch(() => {})
    }
  },

  created() {
    if (this.$route.params.id !== 'add') {
      const id = this.$route.params.id

      role.get({
        params: {
          id
        },
        loadingMaskTarget: '.role-form'
      }).then(res => {
        merge(this.role, res.data.data)
        this.role.name = this.role.roleName
        this.role.nickname = this.role.roleNickname
        this.title = `编辑角色-${this.role.nickname}`

        this.updateCrumb.$emit('update-crumbs', [{
          id: 'roleForm',
          name: `编辑角色-${this.role.nickname}`
        }])
      })
    } else {
      this.updateCrumb.$emit('update-crumbs', [{
        id: 'roleForm',
        name: '新增角色'
      }])
    }
  },

  data() {
    const data = {
      title: '新增角色',
      roleList: [],
      rules: {
        name: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }, {
          pattern: /^[_0-9a-zA-Z]{3,20}$/,
          message: '最少3位字母和数字的组合',
          trigger: 'change'
        }],
        nickname: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }]
      },
      role: {
        orgId: this.$store.getters.orgId,
        id: null,
        name: null,
        nickname: null,
        note: null
      }
    }

    if (this.$route.params.id !== 'add') delete data.rules.name
    return data
  }
}
</script>

<style lang="scss">
.role-form {
  .bottom-buttons {
    margin: 0 0 20px;
  }
}
</style>
