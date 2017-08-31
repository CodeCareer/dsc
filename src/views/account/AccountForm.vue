<template lang="pug">
.account-form
  .box
    .box-header
      | {{title}}
    .box-content
      el-form(:model="account", :rules="rules", ref="accountForm", label-width="120px")
        el-row
          el-col(:span="12", :offset="6")
            .form-inner.center
              el-form-item(label="用户名称：", prop="name")
                el-input(:disabled='!!account.id', type="text", placeholder="请输入用户名称", v-model="account.name")
              el-form-item(label="用户昵称：", prop="nickname")
                el-input(type="text", placeholder="请输入用户昵称", v-model="account.nickname")
              el-form-item(label="密码：", prop="nickname", v-if="$route.params.id === 'add'")
                el-input(:type="showPassword ? 'text': 'password'", placeholder="请设置密码", v-model="account.password")
                  template(slot="append")
                    a(@click="showPassword = !showPassword")
                      i.iconfont.icon-xianshimima
              el-form-item(label="手机号：", prop="phoneNumber")
                el-input(type="text", placeholder="请输入手机号", v-model="account.phoneNumber")
              el-form-item(label="联系邮箱：", prop="email")
                el-input(type="text", placeholder="请输入联系邮箱", v-model="account.email")
              el-form-item(label="角色：", prop="roleId")
                el-select(placeholder="角色", v-model="account.roleId")
                  el-option(v-for="o in roleList", :value="o.value", :label="o.name", :key="o.value")
    .bottom-buttons
      el-button(type="primary", size="small", v-if="$permit(['accountAdd', 'accountUpdate'])", @click="submitForm") 保存
      el-button(type="gray", size="small", @click="cancel") 取消
</template>

<script>
import {
  account,
  roles
} from '@/common/resource_auth.js'
import {
  merge,
  map
} from 'lodash'

export default {
  methods: {
    submitForm() {
      this.$refs.accountForm.validate((valid) => {
        if (valid) {
          account[this.account.id ? 'put' : 'post']({}, {
            params: this.pruneParams(this.account),
            loadingMaskTarget: '.account-form'
          }).then(res => {
            this.$message.success('保存成功！')
            this.$router.push({
              name: 'accounts'
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

      account.get({
        params: {
          id
        },
        loadingMaskTarget: '.account-form'
      }).then(res => {
        merge(this.account, res.data.data)
        this.account.name = this.account.userName
        this.account.roleId = this.account.roles[0].id
        delete this.account.roles
        this.title = `编辑用户-${this.account.nickname}`

        this.updateCrumb.$emit('update-crumbs', [{
          id: 'accountForm',
          name: `编辑用户-${this.account.nickname}`
        }])
      })
    } else {
      this.updateCrumb.$emit('update-crumbs', [{
        id: 'accountForm',
        name: '新增用户'
      }])
    }

    roles.get({
      params: {
        orgId: this.$store.getters.orgId,
        page: 1,
        size: 1000
      }
    }).then(res => {
      const roles = map(res.data.data.content, v => {
        return {
          name: v.roleNickname,
          value: v.id
        }
      })
      this.roleList = roles
    })
  },

  data() {
    const data = {
      title: '新增用户',
      roleList: [],
      showPassword: false,
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
        }],
        password: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }, {
          pattern: /^[_0-9a-zA-Z]{6,}$/,
          message: '密码最少设置六位数字或字母',
          trigger: 'change'
        }],
        phoneNumber: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }, {
          pattern: /^1\d{10}$/,
          message: '请正确填写手机号',
          trigger: 'change'
        }],
        email: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }, {
          type: 'email',
          message: '请正确填写邮箱',
          trigger: 'change'
        }],
        roleId: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }]
      },
      account: {
        orgId: this.$store.getters.orgId,
        id: null,
        password: '111111',
        roleId: null,
        name: null,
        nickname: null,
        email: null,
        phoneNumber: null
      }
    }

    if (this.$route.params.id !== 'add') {
      delete data.rules.password
      delete data.account.password
    }
    return data
  }
}
</script>

<style lang="scss">
.account-form {
  .bottom-buttons {
    margin: 0 0 20px;
  }
}
</style>
