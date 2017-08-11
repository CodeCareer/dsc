<template lang="pug">
  section.reapy-plan
    .box
      .box-header
        h3 筛选条件
      .filters
        el-input(placeholder='资产ID', icon='search', @keyup.native.13='search', v-model='filter.assetId')
        el-input(placeholder='期数', icon='search', @keyup.native.13='search', v-model='filter.termNo')
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='repayPlan', style='width: 100%')
        el-table-column(prop='assetId', label='资产ID', width='240')
        el-table-column(prop='benefit', label='优惠金额', width='100')
          template(scope="scope")
            span {{scope.row.benefit | ktCurrency}}
        el-table-column(prop='benefitType', label='优惠方式', width='80')
          template(scope="scope")
            span {{scope.row.benefitType | statusFormat}}
        el-table-column(prop='faceRepayDate', label='实际还款日期', width='110')
          template(scope="scope")
            span {{scope.row.faceRepayDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='factBenefit', label='实际优惠金额', width='110')
          template(scope="scope")
            span {{scope.row.factBenefit | ktCurrency}}
        el-table-column(prop='factRepayAmount', label='实际还款金额', width='110')
          template(scope="scope")
            span {{scope.row.factRepayAmount | ktCurrency}}
        el-table-column(prop='nameInstalmentsAmount', label='名义月供金额', width='110')
          template(scope="scope")
            span {{scope.row.nameInstalmentsAmount | ktCurrency}}
        el-table-column(prop='maxOverdueDays', label='逾期天数', width='80')
        el-table-column(prop='payChannel', label='支付渠道', width='80')
          template(scope="scope")
            span {{scope.row.payChannel | statusFormat}}
        el-table-column(prop='payNo', label='支付流水号', width='120')
        el-table-column(prop='penaltyInterst', label='罚息', width='100')
          template(scope="scope")
            span {{scope.row.penaltyInterst | ktCurrency}}
        el-table-column(prop='repayAmount', label='应还款金额', width='110')
          template(scope="scope")
            span {{scope.row.repayAmount | ktCurrency}}
        el-table-column(prop='repayDate', label='应还款日', width='110')
          template(scope="scope")
            span {{scope.row.repayDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='repayInterest', label='应还款利息', width='110')
          template(scope="scope")
            span {{scope.row.repayInterest | ktCurrency}}
        el-table-column(prop='repayPrincipal', label='应还款本金', width='110')
          template(scope="scope")
            span {{scope.row.repayPrincipal | ktCurrency}}
        el-table-column(prop='repayStatus', label='还款状态', width='100')
          template(scope="scope")
            span(:class="scope.row.repayStatus | statusClass") {{scope.row.repayStatus | statusFormat}}
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'

import {
  repayPlan
} from '@/common/resource.js'

import {
  pruneParams
} from '@/common/util.js'

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
      return status ? status.name : '未知状态'
    }
  },
  methods: {
    parseInt: window.parseInt,
    _fetchData() {
      repayPlan.post(pruneParams(this.filter), {
        loadingMaskTarget: '.reapy-plan'
      }).then(res => {
        const data = res.data.data
        this.repayPlan = data.rows
        this.page.total = data.total
      })
    }
  },

  watch: {
    $route() {
      this._fetchData()
    }
  },

  mounted() {
    this.filter = merge(this.filter, this.$route.query)
    this._fetchData()
  },

  data() {
    return {
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      repayPlan: [],
      filter: {
        assetId: '',
        page: 1,
        limit: 10
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  margin-top: 20px;
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
