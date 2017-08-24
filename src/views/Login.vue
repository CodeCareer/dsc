<template lang="pug">
.login-page
  header
    .inner
      .logo 微贷云
  .login-warpper(@keyup.13="submitForm()")
    h2 登录
    el-form.login-form(ref="user", :model="user", :rules="rules")
      el-form-item(prop="username")
        el-input(placeholder='请输入您的用户名', v-model="user.username")
      el-form-item(prop="password")
        el-input(placeholder="请输入您的密码", v-model="user.password", type="password")
      el-form-item(prop="d_code")
        el-input(placeholder="请输入动态口令", v-model="user.d_code", type="d_code")
      //- el-form-item(prop="v_code")
        el-input(placeholder="请输入验证码", v-model="user.v_code", type="string")
          template(slot='append')
            img(:src='capthaUrl', style="height:20px;", @click="refreshCaptha()")
      el-form-item
        el-button.input(type="submit",@click="submitForm") 立即登录
  footer
    p ©2017 杭州科峰信息服务有限公司

</template>

<script>
import {
  mapActions
} from 'vuex'

export default {
  methods: {
    ...mapActions(['login']),
    submitForm() {
      this.$refs.user.validate((valid) => {
        if (valid) {
          const redirect = this.$route.query.redirect
          this.login({
            user: this.user,
            config: {
              // params: { ...this.user },
              loadingMaskTarget: '.login-form'
            }
          }).then(res => {
            this.$router.push(!redirect ? {
              name: 'productsRelease'
            } : {
              path: decodeURIComponent(redirect)
            })
          }).catch(() => {
            this.refreshCaptha()
          })
        }
      })
    },

    refreshCaptha() {
      this.capthaUrl = `/api/usermanage/v1/captcha.png?t=${Math.random()}`
    }
  },

  data() {
    return {
      capthaUrl: `/api/usermanage/v1/captcha.png?t=${Math.random()}`,
      user: {
        username: '',
        password: '',
        d_code: ''
        // v_code: ''
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        d_code: [{
          required: true,
          message: '请输入动态口令',
          trigger: 'blur'
        }, {
          pattern: /^\d{6}$/,
          message: '请正确填写动态口令',
          trigger: 'blur'
        }]
      }
    }
  }
}
</script>

<style lang="scss">
//登录页面样式
@import '../assets/scss/_vars.scss';
.login-page {
  .login-form {
    border: 1px solid $border-color;
    border-radius: 4px;
  }
  .el-input__inner {
    height: 36px;
  }
  .el-input {
    max-width: none;
  }
  header {
    height: 60px;
    width: 100%;
    color: #ffffff;
    background: #3e4b5c;
    font-size: 14px;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
    .logo {
      height: 35px;
      margin-top: 12px;
      font-size: 26px;
    }
  }
  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #f3f6f8;
    color: #717d8f;
    padding: 30px 0;
    margin-top: 30px;
    p {
      line-height: 1.3;
      text-align: center;
      font-size: 12px;
    }
  }
  width: 100%;
  height: 100vh;
  position: relative;
  .inner {
    width: 1024px;
    height: 100%;
    margin: 0 auto;
  }
  .login-warpper {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    height: 340px;
    h2 {
      font-size: 30px;
      color: #3d4351;
      height: 80px;
      line-height: 80px;
    }
    .login-form {
      border-radius: 4px;
      background: #ffffff;
      padding: 40px;
    }
    .input {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      background: #79859a;
      font-size: 17px;
      color: #fff;
      border: none;
      text-indent: 10px;
      cursor: pointer;
    }
  }
}
</style>
