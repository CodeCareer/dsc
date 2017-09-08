<template lang="pug">
.products-release-form
  .box
    .box-header
      | {{title}}
      router-link.buttons(:to="{ name: 'repayPlan', query: { assetId: fundDepositData.assetId, termNo: fundDepositData.termNo }}", target="_blank", v-if="fundDepositData.checkingStatus === 'UNPASS'")
        el-button(type="primary", size="small")
          | 查看实际还款
    .box-content
      .box-section
        el-row(:gutter="20")
          el-col(:span="8")
            table
              tr
                th id：
                td {{fundDepositData.id}}
              tr
                th 账户标记	：
                td {{fundDepositData.accountSymbol | statusFormat}}
              tr
                th 资产ID：
                td {{fundDepositData.assetId}}
              tr
                th 资金账户ID：
                td {{fundDepositData.fundAccountId}}
          el-col(:span="8")
            table
              tr
                th 对账状态	：
                td(:class="fundDepositData.checkingStatus | statusClass") {{fundDepositData.checkingStatus | statusFormat}}
              tr
                th 创建时间：
                td {{fundDepositData.createDateTime | moment('YYYY-MM-DD HH:mm:ss')}}
              tr
                th 创建类型：
                td {{fundDepositData.createType | statusFormat}}
              tr
                th 入金金额	：
                td {{fundDepositData.depositAmout | ktCurrency}}
          el-col(:span="8")
            table
              tr
                th 入金日期：
                td {{fundDepositData.depositDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
              tr
                th 入金类型：
                td {{fundDepositData.depositType | statusFormat}}
              tr
                th 月供期数	：
                td {{fundDepositData.termNo}}
    .bottom-buttons 
      el-button(v-if="fundDepositData.checkingStatus === 'UNPASS'", type="primary", size="small", @click="checkUp('PASSED')") 通过
      el-button(size="small", @click="cancel") 返回
</template>

<script>
import {
  find
} from 'lodash'

import {
  fundManualCheckUp
} from '@/common/resource.js'

import {
  tableListMixins
} from '@/common/mixins.js'

const statusList = [{
  name: '月供',
  value: 'INSTALMENT'
}, {
  name: '尾款',
  value: 'REST'
}, {
  name: '回购款',
  value: 'BUY_BACK'
}, {
  name: '大搜车',
  value: 'DSC'
}, {
  name: '花生',
  value: 'HUASHENG'
}, {
  name: '待对账',
  value: 'WAIT_CHECKING'
}, {
  name: '对账通过',
  value: 'PASS'
}, {
  name: '对账不通过',
  value: 'UNPASS'
}, {
  name: '中金捷翊',
  value: 'ZHONGJIN_JIEYU'
}, {
  name: '中金捷众',
  value: 'ZHONGJIN_JIEZHONG'
}, {
  name: '银联',
  value: 'UNIPAY'
}, {
  name: '线下',
  value: 'OFF_LINE'
}, {
  name: '系统创建',
  value: 'SYSTEM_CREATE'
}, {
  name: '外部系统通知创建',
  value: 'OUTER_SYSTEM_NOTIFY'
}]

export default {
  mixins: [tableListMixins],
  filters: {
    statusClass(value) {
      const classMap = {
        'UNPASS': 'color-red',
        'WAIT_CHECKING': 'color-yellow',
        'PASS': 'color-green'
      }
      return classMap[value] || ''
    },
    statusFormat(value) {
      const status = find(statusList, s => s.value === value)
      return status ? status.name : '未知状态'
    }
  },
  methods: {
    checkUp(data) {
      const confirmMsg = data === 'PASSED' ? '确定对账通过吗？' : '确定对账驳回吗？'
      this.$confirm(confirmMsg, '提示', {
        type: 'warning'
      }).then(() => {
        this.fundCheckUp(data)
      })
    },

    fundCheckUp(data) {
      const checkStatus = data === 'PASSED' ? 'PASS' : 'UNPASS'
      fundManualCheckUp.get({
        params: {
          checkingStatus: checkStatus,
          id: this.$route.params.id
        }
      }).then(res => {
        const msg = res.data
        this.operationStatus(msg)
      })
    },

    cancel() {
      this.$router.back()
    },

    operationStatus(data) {
      if (data.resultCode === 'SUCCESS') {
        this.$message.success({
          message: data.resultMsg || '审核成功！'
        })
        this.$router.back()
      } else {
        this.$message.error({
          message: data.resultMsg || '审核失败！'
        })
      }
    }
  },
  created() {
    this.fundDepositData = this.$route.params
  },
  data() {
    return {
      title: '入金明细信息',
      loadingInstance: {
        close() {}
      },
      fundDepositData: {}
    }
  }
}
</script>

<style lang="scss">
.products-release-form {
  .bottom-buttons {
    margin: 0 0 20px;
  }
}
.box {
  .box-content {
    .el-col {
      th{
        width: 180px;
      }
    }
  }
}
  
</style>
