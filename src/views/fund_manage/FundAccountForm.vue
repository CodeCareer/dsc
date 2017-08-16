<template lang="pug">
.fund-account-form
  .box
    .box-header
      | {{title}}
    .box-content
      el-form(:model="fundAccount", :rules="rules", ref="fundAccountForm", label-width="120px")
        el-row
          el-col(:span="12", :offset="6")
            .form-inner.center
              el-form-item(label="账户名称：", prop="accountName")
                el-input(type="text", placeholder="请输入账户名称", maxlength="64", v-model="fundAccount.accountName")
              el-form-item(label="账户类型：", prop="accountType")
                el-select(v-model="fundAccount.accountType", placeholder="请选择账户类型")
                  el-option(v-for="t in accountTypes", :key="t.name", :value="t.value", :label="t.name")
              el-form-item(label="备注：", prop="remark")
                el-input(type="textarea", placeholder="请输入备注", maxlength="500", v-model="fundAccount.remark")
    .bottom-buttons
      el-button(type="primary", size="small", @click="submitForm") 保存
      el-button(type="gray", size="small", @click="cancel") 取消
</template>

<script>
import {
  updateCrumb
} from '@/common/crosser.js'
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
    }
  },
  mounted() {
    if (this.$route.params.id !== 'add') {
      merge(this.fundAccount, this.$route.params)
      this.title = '编辑资金账户'
      this.fundAccountIdStatus = true
      updateCrumb.$emit('update-crumbs', [{
        id: 'fundAccountForm',
        name: '编辑资金账户'
      }])
    } else {
      updateCrumb.$emit('update-crumbs', [{
        id: 'fundAccountForm',
        name: '新增资金账户'
      }])
    }
  },

  data() {
    return {
      title: '新增资金账户',
      accountTypes: [{
        name: '花生',
        value: 'HUASHENG'
      }, {
        name: '大搜车',
        value: 'DSC'
      }],
      rules: {
        accountName: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        accountType: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }]
      },
      fundAccount: {
        accountName: '',
        accountType: '',
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
</style>
