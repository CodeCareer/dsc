<template lang="pug">
.products-release-form
  .box
    .box-header
      | {{title}}
    .box-content
      .box-section
        el-row(:gutter="20")
            el-col(:span="8")
              table
                tr
                  th 账户名称：
                  td {{fundDepositData.accountName}}
                tr
                  th 账户类型	：
                  td {{fundDepositData.accountType | statusFormat}}
                tr
                  th 资产ID：
                  td {{fundDepositData.assetId}}
            el-col(:span="8")
              table
                tr
                  th 资金账户ID：
                  td {{fundDepositData.fundAccountId}}
                tr
                  th 对账状态：
                  td(:class="fundDepositData.checkingStatus | statusClass") {{fundDepositData.checkingStatus | statusFormat}}
                tr
                  th 入金金额：
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
                  th 月供期数：
                  td {{fundDepositData.termNo}}
    .bottom-buttons 
      el-button(size="small", @click="cancel") 返回
</template>

<script>
import {
  find
} from 'lodash'

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
    cancel() {
      this.$router.back()
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
