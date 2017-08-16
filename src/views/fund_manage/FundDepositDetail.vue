<template lang="pug">
  section.fund-deposit-detail
    .box
      .box-header
        h3 筛选条件
      .filters
        el-select(v-model="filter.accountType", placeholder="账户类型", @change="search")
          el-option(v-for="t in accountTypes", :key="t.name", :value="t.value", :label="t.name")
        el-select(v-model="filter.checkingStatus", placeholder="对账状态", @change="search")
          el-option(v-for="t in checkingTypes", :key="t.name", :value="t.value", :label="t.name")
        el-date-picker(placeholder='入金日期', type='date', format='yyyy-MM-dd', :value='date.depositDate', @input="handleDepositDate", :picker-options="pickerOptions")
        el-button(size="small", type="primary", @click="search")  搜索
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='fundDepositData', style='width: 100%')
        el-table-column(prop='accountName', label='账户名称', width='220')
        el-table-column(prop='accountType', label='账户类型', width='80')
          template(scope="scope")
            span {{scope.row.accountType | statusFormat}}
        el-table-column(prop='assetId', label='资产ID', width='280')
        el-table-column(prop='fundAccountId', label='资金账户ID', width='280')
        el-table-column(prop='checkingStatus', label='对账状态')
          template(scope="scope")
            span(:class="scope.row.checkingStatus | statusClass") {{scope.row.checkingStatus | statusFormat}}
        el-table-column(prop='depositAmout', label='入金金额', width='220')
          template(scope="scope")
            span {{scope.row.depositAmout | ktCurrency}}
        el-table-column(prop='depositDate', label='入金日期', width='120')
          template(scope="scope")
            span {{scope.row.depositDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='depositType', label='入金类型')
          template(scope="scope")
            span {{scope.row.depositType | statusFormat}}
        el-table-column(prop='termNo', label='月供期数')
        el-table-column(label='操作', fixed="right", width='80')
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
  fundDeposit
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
    handleDepositDate(value) {
      this.filter.depositDate = value ? moment(value).format('YYYYMMDD') : ''
      this.date.depositDate = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    parseInt: window.parseInt,
    _fetchData() {
      fundDeposit.post(pruneParams(this.filter), {
        loadingMaskTarget: '.fund-deposit-detail'
      }).then(res => {
        const data = res.data.data
        this.fundDepositData = data.rows
        this.page.total = data.total
      })
    },

    detail(rows) {
      this.$router.push({
        name: 'fundDepositDetailForm',
        params: rows
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
    const { depositDate } = this.$route.query
    this.date.depositDate = depositDate ? Vue.filter('moment')(depositDate, 'YYYY-MM-DD') : ''
    this._fetchData()
  },

  data() {
    return {
      pickerOptions: '',
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      fundDepositData: [],
      date: {
        depositDate: ''
      },
      filter: {
        accountType: '',
        checkingStatus: '',
        depositDate: '',
        page: 1,
        limit: 10
      },
      accountTypes: [{
        name: '花生',
        value: 'HUASHENG'
      }, {
        name: '大搜车',
        value: 'DSC'
      }],
      checkingTypes: [{
        name: '待对账',
        value: 'WAIT_CHECKING'
      }, {
        name: '对账通过',
        value: 'PASS'
      }, {
        name: '对账不通过',
        value: 'UNPASS'
      }]
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
  .icon-relation {
    font-size: 15px;
  }
}
.box-tab-head{
  text-align: right;
    background: #f3f6f8;
    height: 40px;
    line-height: 40px;
    padding-right: 15px;
}
</style>
