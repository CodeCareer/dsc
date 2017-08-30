<template lang="pug">
  section.reapy-plan
    .box
      .box-header
        h3 筛选条件
      .filters
        .filter-line 
          el-input(placeholder='资产ID', icon='search', @keyup.native.13='search', v-model.trim='filter.assetId')
          el-input(placeholder='期数', icon='search', @keyup.native.13='search', v-model.trim='filter.termNo')
          el-date-picker(placeholder='实际还款日期下限', format='yyyy-MM-dd', type='date', :value='date.factRepayDateLower', @input="handleFactRepayDateLower", :picker-options="pickerOptions")
          el-date-picker(placeholder='实际还款日期上限', format='yyyy-MM-dd', type='date', :value='date.factRepayDateUpper', @input="handleFactRepayDateUpper", :picker-options="pickerOptions")
        .filter-line
          el-date-picker(placeholder='应还款日期下限', format='yyyy-MM-dd', type='date', :value='date.repayDateLower', @input="handleRepayDateLower", :picker-options="pickerOptions")
          el-date-picker(placeholder='应还款日期上限', format='yyyy-MM-dd', type='date', :value='date.repayDateUpper', @input="handleRepayDateUpper", :picker-options="pickerOptions")
          el-button(size="small", type="primary", @click="search")  搜索
          el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table.no-wrap-cell(:data='repayPlan', style='width: 100%')
        el-table-column(prop='assetId', label='资产ID', width='280')
        el-table-column(prop='termNo', label='期数', width='100')
        el-table-column(prop='repayDate', label='应还款日期', width='110')
          template(scope="scope")
            span {{scope.row.repayDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='nameInstalmentsAmount', label='名义月供金额', width='110')
          template(scope="scope")
            span {{scope.row.nameInstalmentsAmount | ktCurrency}}
        el-table-column(prop='repayAmount', label='应还款金额', width='110')
          template(scope="scope")
            span {{scope.row.repayAmount | ktCurrency}}
        el-table-column(prop='repayStatus', label='还款状态', width='100')
          template(scope="scope")
            span(:class="scope.row.repayStatus | statusClass") {{scope.row.repayStatus | statusFormat}}
        el-table-column(prop='factRepayDate', label='实际还款日期', width='110')
          template(scope="scope")
            span {{scope.row.factRepayDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='factRepayAmount', label='实际还款金额', width='110')
          template(scope="scope")
            span {{scope.row.factRepayAmount | ktCurrency}}
        el-table-column(prop='factBenefit', label='实际优惠金额', width='110')
          template(scope="scope")
            span {{scope.row.factBenefit | ktCurrency}}
        el-table-column(prop='penaltyInterst', label='罚息', width='100')
          template(scope="scope")
            span {{scope.row.penaltyInterst | ktCurrency}}
        el-table-column(prop='maxOverdueDays', label='逾期天数', width='100')
        el-table-column(prop='payChannel', label='支付渠道', width='100')
          template(scope="scope")
            span {{scope.row.payChannel | statusFormat}}
        el-table-column(prop='payNo', label='支付流水号', width='120')
        el-table-column(prop='benefitType', label='优惠方式', width='100')
          template(scope="scope")
            span {{scope.row.benefitType | statusFormat}}
        el-table-column(prop='benefit', label='优惠金额', width='100')
          template(scope="scope")
            span {{scope.row.benefit | ktCurrency}}
        el-table-column(prop='repayInterest', label='应还款利息', width='110')
          template(scope="scope")
            span {{scope.row.repayInterest | ktCurrency}}
        el-table-column(prop='repayPrincipal', label='应还款本金', width='110')
          template(scope="scope")
            span {{scope.row.repayPrincipal | ktCurrency}}
        el-table-column(label='操作', fixed="right", width="80")
          template(scope="scope")
            .operations
              i.iconfont.icon-details(@click="detail(scope.row)")
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

import moment from 'moment'

import Vue from 'vue'

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
    handleRepayDateUpper(value) {
      this.filter.repayDateUpper = value ? moment(value).format('YYYYMMDD') : ''
      this.date.repayDateUpper = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    handleRepayDateLower(value) {
      this.filter.repayDateLower = value ? moment(value).format('YYYYMMDD') : ''
      this.date.repayDateLower = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    handleFactRepayDateUpper(value) {
      this.filter.factRepayDateUpper = value ? moment(value).format('YYYYMMDD') : ''
      this.date.factRepayDateUpper = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    handleFactRepayDateLower(value) {
      this.filter.factRepayDateLower = value ? moment(value).format('YYYYMMDD') : ''
      this.date.factRepayDateLower = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    parseInt: window.parseInt,
    _fetchData() {
      repayPlan.post(pruneParams(this.filter), {
        loadingMaskTarget: '.reapy-plan'
      }).then(res => {
        const data = res.data.data
        this.repayPlan = data.rows
        this.page.total = data.total
      })
    },
    detail(rows) {
      this.$router.push({
        name: 'repayPlanDetail',
        params: {
          id: rows.id
        }
      })
    }
  },

  watch: {
    $route() {
      this._fetchData()
    }
  },

  created() {
    this.filter = merge(this.filter, this.$route.query)
    const {factRepayDateLower, factRepayDateUpper, repayDateLower, repayDateUpper} = this.$route.query
    this.date.factRepayDateLower = factRepayDateLower ? Vue.filter('moment')(factRepayDateLower, 'YYYY-MM-DD') : ''
    this.date.factRepayDateUpper = factRepayDateUpper ? Vue.filter('moment')(factRepayDateUpper, 'YYYY-MM-DD') : ''
    this.date.repayDateLower = repayDateLower ? Vue.filter('moment')(repayDateLower, 'YYYY-MM-DD') : ''
    this.date.repayDateUpper = repayDateUpper ? Vue.filter('moment')(repayDateUpper, 'YYYY-MM-DD') : ''
    this._fetchData()
  },

  data() {
    return {
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      repayPlan: [],
      date: {
        factRepayDateLower: '',
        factRepayDateUpper: '',
        repayDateLower: '',
        repayDateUpper: ''
      },
      filter: {
        factRepayDateLower: '',
        factRepayDateUpper: '',
        repayDateLower: '',
        repayDateUpper: '',
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
