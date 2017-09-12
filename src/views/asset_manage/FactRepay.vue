<template lang="pug">
  section.fact-repay
    .box
      .box-header
        h3 筛选条件
      .filters
        el-input(placeholder='资产ID', icon='search', @keyup.native.13='search', v-model.trim='filter.assetId')
        el-input(placeholder='期数', icon='search', @keyup.native.13='search', v-model.trim='filter.termNo')
        el-date-picker(placeholder='实际还款日期下限', format='yyyy-MM-dd', type='date', :value='date.factRepayDateLower', @input="handleFactRepayDateLower", :picker-options="pickerOptions")
        el-date-picker(placeholder='实际还款日期上限', format='yyyy-MM-dd', type='date', :value='date.factRepayDateUpper', @input="handleFactRepayDateUpper", :picker-options="pickerOptions")
        el-button(size="small", type="primary", @click="search")  搜索
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table.no-wrap-cell(:max-height="maxHeight", :data='factRepay', style='width: 100%', :summary-method="getSummaries", show-summary)
        el-table-column(prop='assetId', label='资产ID', width="250")
        el-table-column(prop='termNo', label='期数')
        el-table-column(prop='factRepayDate', label='实际还款日期', width="120")
          template(scope="scope")
            span {{scope.row.factRepayDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='factRepayAmount', label='实际还款金额', width="120")
          template(scope="scope")
            span {{scope.row.factRepayAmount | ktCurrency}}
        el-table-column(prop='penaltyInterst', label='罚息')
          template(scope="scope")
            span {{scope.row.penaltyInterst | ktCurrency}}
        el-table-column(prop='dealStatus', label='处理状态', width="120")
          template(scope="scope")
            span(:class="scope.row.dealStatus | statusClass") {{scope.row.dealStatus | statusFormat}}
        el-table-column(prop='validStatus', label='校验状态')
          template(scope="scope")
            span(:class="scope.row.valid_status | statusClass") {{scope.row.valid_status | statusFormat}}
        el-table-column(prop='payChannel', label='支付渠道')
          template(scope="scope")
            span {{scope.row.payChannel | statusFormat}}
        el-table-column(prop='payNo', label='支付流水号', width="160")
        el-table-column(prop='factBenefit', label='实际优惠金额')
        el-table-column(prop='remark', label='备注', width="160")
          template(scope="scope")
            span {{scope.row.factBenefit | ktCurrency}}
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total,  sizes, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'

import {
  factRepay
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
  name: '待处理',
  value: 'WAIT_DEAL'
}, {
  name: '已处理，无异常',
  value: 'DEALED_RIGHT'
}, {
  name: '已处理，有异常',
  value: 'DEALED_ERROR'
}, {
  name: '待校验',
  value: 'WAIT_VALID'
}, {
  name: '已校验',
  value: 'VALIDED_PASS'
}, {
  name: '已校验，未通过',
  value: 'VALIDED_UNPASS'
}, {
  name: '无需校验',
  value: 'NO_NEED_VALID'
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
        'DEALED_RIGHT': 'color-green',
        'DEALED_ERROR': 'color-red',
        'WAIT_DEAL': 'color-red',
        'VALIDED_PASS': 'color-green',
        'WAIT_VALID': 'color-red',
        'NO_NEED_VALID': 'color-red'
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
      factRepay.post(pruneParams(this.filter), {
        loadingMaskTarget: '.fact-repay'
      }).then(res => {
        const data = res.data.data
        this.factRepay = data.rows
        this.page.total = data.total
      })
    },
    handleFactRepayDateLower(value) {
      this.filter.factRepayDateLower = value ? moment(value).format('YYYYMMDD') : ''
      this.date.factRepayDateLower = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    handleFactRepayDateUpper(value) {
      this.filter.factRepayDateUpper = value ? moment(value).format('YYYYMMDD') : ''
      this.date.factRepayDateUpper = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '当页合计'
          return
        }
        if (index === 1 || index === 2 || index === 5 || index === 7 || index === 6) {
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = Vue.filter('ktCurrency')(sums[index])
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    }
  },

  watch: {
    $route() {
      this._fetchData()
    }
  },

  created() {
    this.filter = merge(this.filter, this.$route.query)
    const {factRepayDateLower, factRepayDateUpper} = this.$route.query
    this.date.factRepayDateLower = factRepayDateLower ? Vue.filter('moment')(factRepayDateLower, 'YYYY-MM-DD') : ''
    this.date.factRepayDateUpper = factRepayDateUpper ? Vue.filter('moment')(factRepayDateUpper, 'YYYY-MM-DD') : ''
    this._fetchData()
  },

  data() {
    return {
      pickerOptions: '',
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      factRepay: [],
      date: {
        factRepayDateLower: '',
        factRepayDateUpper: ''
      },
      filter: {
        factRepayDateLower: '',
        factRepayDateUpper: '',
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
