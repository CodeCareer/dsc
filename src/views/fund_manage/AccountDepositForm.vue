<template lang="pug">
.account-deposit-form
  .box
    .box-header
      | {{title}}
    .box-content
      el-form(:model="accountDeposit", :rules="rules", ref="accountDepositForm", label-width="120px")
        el-row
          el-col(:span="12", :offset="6")
            .form-inner.center
              el-form-item(label="支付金额：", prop="factPayAmount")
                el-input(type="text", placeholder="请输入实际支付金额", v-model="accountDeposit.factPayAmount")
                  template(slot="prepend") ¥
                  template(slot="append") 元
              el-form-item(label="资金账户：", prop="fundAccountId")
                el-input(type="text", placeholder="请输入资金账户ID", v-model="accountDeposit.fundAccountId")
              el-form-item(label="资金方向：", prop="fundDirection")
                el-select(v-model="accountDeposit.fundDirection", placeholder="请选择资金方向")
                  el-option(v-for="t in fundDirectionTypes", :key="t.name", :value="t.value", :label="t.name")
              el-form-item(label="支付日期：", prop="payDate")
                el-date-picker(placeholder='请选择支付日期', type='date', v-model='accountDeposit.payDate', :picker-options="pickerOptions")
    .bottom-buttons
      el-button(type="primary", size="small", @click="submitForm") 保存
      el-button(type="gray", size="small", @click="cancel") 取消
</template>

<script>
import {
  updateCrumb
} from '@/common/crosser.js'
import {
  accountDepositEdit
} from '@/common/resource.js'
// import {
//   merge
// } from 'lodash'

export default {
  methods: {
    submitForm() {
      this.$refs.accountDepositForm.validate((valid) => {
        if (valid) {
          accountDepositEdit.post(this.accountDeposit, {
            loadingMaskTarget: '.account-deposit-form'
          }).then(res => {
            const data = res.data
            this.operationStatus(data)
          })
        }
      })
    },

    cancel() {
      this.$confirm('内容尚未保存，确定取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    }
  },

  operationStatus(data) {
    if (data.resultCode === 'SUCCESS') {
      this.$message.success({
        message: data.resultMsg || '成功！'
      })
      this.$router.back()
    } else {
      this.$message.error({
        message: data.resultMsg || '失败！'
      })
    }
  },

  mounted() {
    if (this.$route.params.id !== 'add') {
      updateCrumb.$emit('update-crumbs', [{
        id: 'accountDepositForm',
        name: '编辑账户入金'
      }])
    }
  },

  data() {
    return {
      pickerOptions: '',
      title: '新增账户入金',
      fundDirectionTypes: [{
        name: '流入',
        value: 'IN'
      }, {
        name: '流出',
        value: 'OUT'
      }],
      rules: {
        factPayAmount: [{
          required: true,
          pattern: /^\d+$/,
          message: '请输入正确的金额',
          trigger: 'change'
        }],
        fundAccountId: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        fundDirection: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        payDate: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }]
      },
      accountDeposit: {
        factPayAmount: '',
        fundAccountId: '',
        fundDirection: '',
        payDate: ''
      }
    }
  }
}
</script>

<style lang="scss">
.account-deposit-form {
  .bottom-buttons {
    margin: 0 0 20px;
  }
}
</style>
