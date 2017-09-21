<template lang="pug">
.fund-account-serial-form
  .box
    .box-header
      | {{title}}
    .box-content
      el-form(:model="fundAccountSerial", :rules="rules", ref="fundAccountSerialForm", label-width="140px")
        el-row
          el-col(:span="12", :offset="6")
            .form-inner.center
              el-form-item(label="账户名称：", prop="fundAccountId")
                el-select(v-model="fundAccountSerial.fundAccountId", placeholder="请选择账户")
                  el-option(v-for="t in fundAccountList", :key="t.name", :value="t.id", :label="t.name")
              el-form-item(label="账户余额：", prop="accountBalance")
                el-input(type="text", placeholder="请输入账户余额", v-model="fundAccountSerial.accountBalance")
              el-form-item(label="发生金额：", prop="occurAmount")
                el-input(type="text", placeholder="请输入发生金额", v-model="fundAccountSerial.occurAmount")
              el-form-item(label="资金方向：", prop="fundDirection")
                el-select(v-model="fundAccountSerial.fundDirection", placeholder="请选择资金方向")
                  el-option(v-for="t in fundDirectionTypes", :key="t.name", :value="t.value", :label="t.name")
              el-form-item(label="是否识别出业务信息：", prop="needSystemOperate")
                el-select(v-model="fundAccountSerial.needSystemOperate", placeholder="请选择是否识别出业务信息")
                  el-option(v-for="t in needSystemOperateTypes", :key="t.name", :value="t.value", :label="t.name")
              el-form-item(label="发生时间：", prop="occurDatetime")
                el-date-picker(placeholder='请选择发生时间', type='datetime', format='yyyy-MM-dd HH:mm:ss', v-model='fundAccountSerial.occurDatetime' @change="handleChangeTime")
              el-form-item(label="备注：", prop="remark")
                el-input(type="textarea", placeholder="请输入备注", :maxlength="500", :autosize="{ minRows: 2, maxRows: 4}", v-model="fundAccountSerial.remark")
    .bottom-buttons
      el-button(type="primary", size="small", @click="submitForm") 保存
      el-button(type="gray", size="small", @click="cancel") 取消
</template>

<script>
import {
  dictsUpholdFundAccount,
  fundAccountSerialAdd
} from '@/common/resource.js'

export default {
  methods: {
    submitForm() {
      this.$refs.fundAccountSerialForm.validate((valid) => {
        if (valid) {
          this.add()
        }
      })
    },

    getFundAccountList() {
      dictsUpholdFundAccount.post().then(res => {
        const data = res.data
        this.fundAccountList = data.data.dicts
      })
    },

    add() {
      fundAccountSerialAdd.post(this.fundAccountSerial, {
        loadingMaskTarget: '.fund-account-serial-form'
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

    handleChangeTime(val) {
      this.fundAccountSerial.occurDatetime = val
    }
  },
  created() {
    this.getFundAccountList()
  },

  data() {
    return {
      title: '新增资金账户流水',
      fundAccountList: '',
      fundDirectionTypes: [{
        name: '入',
        value: 'IN'
      }, {
        name: '出',
        value: 'OUT'
      }],
      needSystemOperateTypes: [{
        name: '是',
        value: 'YES'
      }, {
        name: '否',
        value: 'NO'
      }],
      rules: {
        fundAccountId: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        accountBalance: [{
          required: true,
          pattern: /^\d+(\.\d*)?$/,
          message: '请正确填写账户余额',
          trigger: 'change'
        }],
        occurAmount: [{
          required: true,
          pattern: /^\d+(\.\d*)?$/,
          message: '请正确填写发生金额',
          trigger: 'change'
        }],
        fundDirection: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        needSystemOperate: [{
          required: true,
          message: '必填项',
          trigger: 'change'
        }],
        occurDatetime: [{
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
      fundAccountSerial: {
        accountBalance: '',
        fundAccountId: '',
        fundDirection: '',
        needSystemOperate: '',
        occurAmount: '',
        occurDatetime: '',
        remark: ''
      }
    }
  }
}
</script>

<style lang="scss">
.fund-account-serial-form {
  .bottom-buttons {
    margin: 0 0 20px;
  }
}
</style>
