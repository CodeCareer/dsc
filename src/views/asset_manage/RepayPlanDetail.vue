<template lang="pug">
.repay-plan-detail
  .box
    .box-header
      | {{title}}
    .box-content
      .box-section
        el-row(:gutter="20")
            el-col(:span="8")
              table
                tr
                  th 资产ID：
                  td {{repayPlan.assetId}}
                tr
                  th 优惠金额：
                  td {{repayPlan.benefit | ktCurrency}}
                tr
                  th 优惠方式：
                  td {{repayPlan.benefitType | statusFormat}}
                tr
                  th 实际还款日期：
                  td {{repayPlan.factRepayDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
                tr
                  th 实际优惠金额：
                  td {{repayPlan.factBenefit | ktCurrency}}
                tr
                  th 实际还款金额：
                  td {{repayPlan.factRepayAmount | ktCurrency}}
                tr
                  th 剩余本金：
                  td {{repayPlan.leftPrincipal | ktCurrency}}
            el-col(:span="8")
              table
                tr
                  th 名义月供金额：
                  td {{repayPlan.nameInstalmentsAmount | ktCurrency}}
                tr
                  th 期数：
                  td {{repayPlan.termNo}}
                tr
                  th 逾期天数：
                  td {{repayPlan.maxOverdueDays}}
                tr
                  th 支付渠道：
                  td {{repayPlan.payChannel | statusFormat}}
                tr
                  th 支付流水号：
                  td {{repayPlan.payNo}}
                tr
                  th 罚息：
                  td {{repayPlan.penaltyInterst | ktCurrency}}
                tr
                  th 提前结清金额：
                  td {{repayPlan.preendAmount | ktCurrency}}
            el-col(:span="8")
              table 
                tr
                  th 应还款金额：
                  td {{repayPlan.repayAmount | ktCurrency}} 
                tr
                  th 应还款日：
                  td {{repayPlan.repayDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}   
                tr
                  th 应还款利息：
                  td {{repayPlan.repayInterest | ktCurrency}}
                tr
                  th 应还款本金：
                  td {{repayPlan.repayPrincipal | ktCurrency}}
                tr
                  th 还款状态：
                  td {{repayPlan.repayStatus | statusFormat}}
                tr
                  th 核销状态：
                  td {{repayPlan.verifyStatus | statusFormat}}
                tr
                  th 支付批次号：
                  td {{repayPlan.payBatchNo}}
    .bottom-buttons 
      el-button(size="small", @click="cancel") 返回
</template>

<script>
import {
  find
} from 'lodash'

import {
  repayPlan
} from '@/common/resource.js'

import {
  tableListMixins
} from '@/common/mixins.js'

const statusList = [{
  name: '抵扣',
  value: 'DEDUCT'
}, {
  name: '返现',
  value: 'RETURN_CASH'
}, {
  name: '待还款',
  value: 'WAITING'
}, {
  name: '已还款',
  value: 'REPAID'
}, {
  name: '网商',
  value: 'MYBANK'
}, {
  name: '中金',
  value: 'ZHONGJIN'
}, {
  name: '银联',
  value: 'UNIPAY'
}, {
  name: '线下',
  value: 'OFF_LINE'
}, {
  name: '其他',
  value: 'OTHER'
}, {
  name: '未核销',
  value: 'NOT_VERIFY'
}, {
  name: '已核销',
  value: 'VERIFYED'
}, {
  name: '无需核销',
  value: 'NO_NEED'
}]

export default {
  mixins: [tableListMixins],
  filters: {
    statusClass(value) {
      const classMap = {
        'REPAID': 'color-green',
        'WAITING': 'color-red'
      }
      return classMap[value] || ''
    },
    statusFormat(value) {
      const status = find(statusList, s => s.value === value)
      return status ? status.name : '-'
    }
  },
  methods: {
    _fetchData() {
      repayPlan.post({
        repayPlanId: this.$route.params.id,
        showInvalid: 'YES'
      }, {
        loadingMaskTarget: '.repay-plan-detail'
      }).then(res => {
        this.repayPlan = res.data.data.rows[0]
      })
    },
    cancel() {
      this.$router.push({
        name: 'repayPlan'
      })
    }
  },
  created() {
    this._fetchData()
  },
  data() {
    return {
      title: '还款计划详情',
      loadingInstance: {
        close() {}
      },
      repayPlan: {}
    }
  }
}
</script>

<style lang="scss">
.repay-plan-detail {
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
