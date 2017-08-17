<template lang="pug">
.setting
  .box
    .box-header
      | 个人信息
    .box-content
      el-row
        el-col(:span="12", :offset="6")
          .form-inner.center
            table
              tr
                th 用户名称：
                td {{account.userName}}
              tr
                th 用户昵称：
                td {{account.nickname}}
              tr
                th 用户邮箱：
                td {{account.email}}
              tr
                th 手机号：
                td {{account.phoneNumber}}
              tr
                th 角色：
                td {{account.roleName}}
              tr
                th 密码：
                td
                  span.setting-span 用于保护账号信息和登录安全
                    a.iconfont.icon-edit.ml5(@click="passwordDialogVisible = true")
  el-dialog(v-model="passwordDialogVisible", title="修改密码", @open="onDialogOpen")
    el-form(:model='user', :rules="rules", ref="passwordForm", :label-width='formLabelWidth')
      el-form-item(prop="oldpwd", label='旧密码：')
        el-input(type="password", v-model='user.oldpwd', auto-complete='off', placeholder='请输入旧密码')
      el-form-item(prop="pwd", label='新密码：')
        el-input(type="password", v-model='user.pwd', auto-complete='off', placeholder='请输入新密码')
      el-form-item(prop="cfpwd", label='确认新密码：')
        el-input(type="password", v-model='user.cfpwd', auto-complete='off', placeholder='请再次输入新密码')
    .dialog-footer(slot="footer")
      el-button(type="primary", size="small", @click='submitPassword') 确定
      el-button(type='gray', size="small", @click='passwordDialogVisible = false') 取消
</template>

<script>
import {
  account,
  accountUpdatePwd
} from '@/common/resource_auth.js'
import {
  validateEqual
} from '@/common/validator.js'
import {
  map,
  merge
} from 'lodash'

export default {
  methods: {
    // ...mapActions(['updateUser']),
    submitPassword() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          accountUpdatePwd.post(this.user).then(res => {
            this.$message.success('密码更改成功！')
            this.passwordDialogVisible = false
              // this.updateUser(merge({}, this.$store.getters.user, this.account))
          })
        }
      })
    },
    onDialogOpen() {
      this.$nextTick(() => this.$refs.passwordForm.resetFields())
    }
  },

  created() {
    account.get({
      params: {
        id: this.user.id
      },
      loadingMaskTarget: '.setting'
    }).then(res => {
      merge(this.account, res.data.data)
      this.account.roleName = map(this.account.roles, 'roleNickname').join('，')
    })
  },

  data() {
    return {
      account: {
        userName: '',
        phoneNumber: '',
        nickname: '',
        email: '',
        roleName: ''
      },
      formLabelWidth: '120px',
      passwordDialogVisible: false,
      user: {
        id: this.$store.getters.user.id,
        oldpwd: '',
        pwd: '',
        cfpwd: ''
      },
      rules: {
        oldpwd: [{
          required: true,
          message: '请输入旧密码',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        }],
        cfpwd: [{
          required: true,
          message: '请再次输入新密码',
          trigger: 'blur'
        }, {
          validator: validateEqual.bind(this),
          compare: 'user.pwd',
          compareName: '密码',
          trigger: 'blur'
        }]
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/_vars.scss';
.setting {
  a {
    display: inline-block;
  }
  .form-inner {
    th,
    td {
      padding: 15px!important;
    }
    table {
      margin: 20px 0;
    }
  }
  .content-line {
    th {
      font-weight: normal;
      width: 100px;
    }
    th,
    td {
      text-align: left;
      padding: 10px;
    }
    padding: 15px;
    .icon-edit {
      color: #c9cdd1;
      cursor: pointer;
      &:hover {
        color: $color-blue;
      }
    }
    table {}
  }
}
</style>
