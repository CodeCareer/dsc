<template lang="pug">
.fund-account-form
  .box
    .box-header
      | {{title}}
    .box-content
      el-form(:model="fundAccount", :rules="rules", ref="fundAccountForm", label-width="160px")
        el-row
          el-col(:span="12", :offset="6")
            .form-inner.center
              el-form-item(label="账户名称：", prop="accountName")
                el-input(type="text", placeholder="请输入账户名称", :maxlength="64",  v-model="fundAccount.accountName")
              el-form-item(label="账户用途：", prop="accountUsages")
                el-checkbox-group(v-model="accountUsagesArray" @change="checkboxchange(fundAccount)")
                  el-checkbox.circle.mini(v-for="t in accountUsages", :label="t.value", :key="t.value") {{t.name}}
              el-form-item(label="资产来源：", prop="assetFrom")
                el-select(v-model="fundAccount.assetFrom", placeholder="请选择资产来源")
                  el-option(v-for="t in assetFrom", :key="t.name", :value="t.value", :label="t.name")
              el-form-item(label="银行账号：", prop="bankAccount")
                el-input(type="text", placeholder="请输入银行账号", :maxlength="64",  v-model="fundAccount.bankAccount")
              el-form-item(label="银行账户名称：", prop="bankAccountName")
                el-input(type="text", placeholder="请输入银行账户名称", :maxlength="64",  v-model="fundAccount.bankAccountName")
              el-form-item(label="银行名称：", prop="bankName")
                el-input(type="text", placeholder="请输入银行名称", :maxlength="64",  v-model="fundAccount.bankName")
              el-form-item(label="是否共管账户：", prop="coManagementAccount")
                el-select(v-model="fundAccount.coManagementAccount", placeholder="请选择是否共管账户")
                  el-option(v-for="t in whether", :key="t.name", :value="t.value", :label="t.name")
              el-form-item(label="是否需要维护账户流水：", prop="needUpdateAccountSerial")
                el-select(v-model="fundAccount.needUpdateAccountSerial", placeholder="请选择是否需要维护账户流水")
                  el-option(v-for="t in whether", :key="t.name", :value="t.value", :label="t.name")
              el-form-item(label="备注：", prop="remark")
                el-input(type="textarea", placeholder="请输入备注", :maxlength="500", :autosize="{ minRows: 2, maxRows: 4}", v-model="fundAccount.remark")
    .bottom-buttons
      el-button(type="primary", size="small", @click="submitForm") 保存
      el-button(type="gray", size="small", @click="cancel") 取消
</template>

<script>
import {
  fundAccountEdit,
  fundAccountAdd
} from '@/common/resource.js'
import {
  merge
} from 'lodash'

export default {
  methods: {
    submitForm() {
      this.$refs.fundAccountForm.validate((valid) => {
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
      fundAccountEdit.post(this.fundAccount, {
        loadingMaskTarget: '.fund-account-form'
      }).then(res => {
        const data = res.data
        this.operationStatus(data)
      })
    },

    add() {
      fundAccountAdd.post(this.fundAccount, {
        loadingMaskTarget: '.fund-account-form'
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

    checkboxchange(module) {
      this.fundAccount.accountUsages = this.accountUsagesArray.join(',')
    }
  },
  created() {
    if (this.$route.params.id !== 'add') {
      merge(this.fundAccount, this.$route.params)
      this.title = '编辑资金账户'
      this.fundAccountIdStatus = true
      this.updateCrumb.$emit('update-crumbs', [{
        id: 'fundAccountForm',
        name: '编辑资金账户'
      }])
      this.accountUsagesArray = this.fundAccount.accountUsages.split(',')
    } else {
      this.updateCrumb.$emit('update-crumbs', [{
        id: 'fundAccountForm',
        name: '新增资金账户'
      }])
    }
  },

  data() {
    return {
      title: '新增资金账户',
      accountUsagesArray: [],
      assetFrom: [{
        name: '花生',
        value: 'HUASHENG'
      }, {
        name: '大搜车',
        value: 'DSC'
      }],
      accountUsages: [{
        name: '直接收取月租',
        value: 'INSTALMENT'
      }, {
        name: '尾款',
        value: 'REST'
      }, {
        name: '回购款',
        value: 'BUY_BACK'
      }, {
        name: '月供转付',
        value: 'INSTALMENT_REMITTANCE'
      }, {
        name: '月供垫付',
        value: 'INSTALMENT_ADVANCE'
      }, {
        name: '差额补足',
        value: 'MAKE_UP_THE_BALANCE'
      }, {
        name: '产品提前还款',
        value: 'PREPAYMENT'
      }],
      whether: [{
        name: '是',
        value: 'YES'
      }, {
        name: '否',
        value: 'NO'
      }],
      rules: {
        accountName: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        accountUsages: [{
          required: true,
          message: '必选项',
          trigger: 'change'
        }],
        assetFrom: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        coManagementAccount: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        needUpdateAccountSerial: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }]
      },
      fundAccount: {
        accountName: '',
        accountUsages: '',
        assetFrom: '',
        bankAccount: '',
        bankAccountName: '',
        bankName: '',
        coManagementAccount: '',
        needUpdateAccountSerial: '',
        remark: '',
        id: ''
      }
    }
  }
}
</script>

<style lang="scss">
.fund-account-form {
  .bottom-buttons {
    margin: 0 0 20px;
  }
}
.el-checkbox {
  margin-left: 15px;
}
</style>
