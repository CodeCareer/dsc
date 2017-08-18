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
              el-form-item(label="资金账户：", prop="fundAccountId")
                el-select(v-model="accountDeposit.fundAccountId", placeholder="资金账户", :disabled="fundAccountIdStatus")
                  el-option(v-for="t in fundAccountIdTypes", :key="t.name", :value="t.value", :label="t.name")
              el-form-item(label="支付金额：", prop="factPayAmount")
                el-input(type="text", placeholder="请输入实际支付金额", v-model="accountDeposit.factPayAmount")
                  template(slot="prepend") ¥
                  template(slot="append") 元
              el-form-item(label="资金方向：", prop="fundDirection")
                el-select(v-model="accountDeposit.fundDirection", placeholder="请选择资金方向")
                  el-option(v-for="t in fundDirectionTypes", :key="t.name", :value="t.value", :label="t.name")
              el-form-item(label="支付日期：", prop="payDate")
                el-date-picker(placeholder='请选择支付日期', type='date', :value='date.payDate', @input="handlePayDate" :picker-options="pickerOptions")
    .bottom-buttons
      el-button(type="primary", size="small", @click="submitForm") 保存
      el-button(type="gray", size="small", @click="cancel") 取消
</template>

<script>
import {
  updateCrumb
} from '@/common/crosser.js'
import {
  fundAccountManage,
  accountDepositEdit,
  accountDepositAdd
} from '@/common/resource.js'
import {
  pruneParams
} from '@/common/util.js'
import moment from 'moment'

export default {
  methods: {
    handlePayDate(value) {
      this.accountDeposit.payDate = value ? moment(value).format('YYYYMMDD') : ''
      this.date.payDate = value ? moment(value).format('YYYY-MM-DD') : ''
    },
    submitForm() {
      this.$refs.accountDepositForm.validate((valid) => {
        if (valid) {
          if (this.$route.params.id !== 'add') {
            this.edit()
          } else {
            this.add()
          }
        }
      })
    },

    edit() {
      accountDepositEdit.post(this.accountDeposit, {
        loadingMaskTarget: '.account-deposit-form'
      }).then(res => {
        const data = res.data
        this.operationStatus(data)
      })
    },

    add() {
      accountDepositAdd.post(this.accountDeposit, {
        loadingMaskTarget: '.account-deposit-form'
      }).then(res => {
        const data = res.data
        this.operationStatus(data)
      })
    },

    cancel() {
      this.$confirm('内容尚未保存，确定取消吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },

    _fetchData() {
      fundAccountManage.post(pruneParams(this.filter), {
        loadingMaskTarget: '.account-deposit-form'
      }).then(res => {
        const data = res.data.data.rows
        for (var i in data) {
          this.fundAccountIdTypes.push({
            name: data[i].accountName,
            value: data[i].id
          })
        }
      })
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
    }
  },
  created() {
    if (this.$route.params.id !== 'add') {
      this.accountDeposit.factPayAmount = this.$route.params.factPayAmount
      this.accountDeposit.fundAccountId = this.$route.params.fundAccountId
      this.fundAccountIdTypes = [{name: this.$route.params.accountName, value: this.$route.params.fundAccountId}]
      this.accountDeposit.fundDirection = this.$route.params.fundDirection
      this.accountDeposit.id = this.$route.params.id
      this.accountDeposit.payDate = this.$route.params.payDate
      this.date.payDate = moment(this.$route.params.payDate, 'YYYYMMDD').format('YYYY-MM-DD')
      this.title = '编辑账户入金'
      this.fundAccountIdStatus = true
      updateCrumb.$emit('update-crumbs', [{
        id: 'accountDepositForm',
        name: '编辑账户入金'
      }])
    } else {
      updateCrumb.$emit('update-crumbs', [{
        id: 'accountDepositForm',
        name: '新增账户入金'
      }])
      this._fetchData()
    }
  },

  data() {
    return {
      fundAccountIdStatus: false,
      pickerOptions: '',
      title: '新增账户入金',
      fundDirectionTypes: [{
        name: '流入',
        value: 'IN'
      }, {
        name: '流出',
        value: 'OUT'
      }],
      fundAccountIdTypes: [],
      filter: {
        accountType: '',
        accountName: '',
        page: 1,
        limit: 10
      },
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
      date: {
        payDate: ''
      },
      accountDeposit: {
        factPayAmount: '',
        fundAccountId: '',
        fundDirection: '',
        payDate: '',
        id: ''
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
