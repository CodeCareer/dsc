<template lang="pug">
  section.fund-deposit-detail
    .box
      .box-header
        h3 筛选条件
        .buttons
          el-button(v-if="ShowAutoCheckUp == 'YES'", type="primary", size="small", @click="autoCheckUp()")  完成对账
      .filters
        el-input(placeholder='资产ID', icon='search', @keyup.native.13="_fetchData", v-model.trim='filter.assetId')
        el-input(placeholder='资金账户ID', icon='search', @keyup.native.13="_fetchData", v-model.trim='filter.fundAccountId')
        el-select(v-model="filter.depositType", placeholder="入金类型", @change="_fetchData")
          el-option(v-for="t in depositTypes", :key="t.name", :value="t.value", :label="t.name")
         
        .filter-line
        el-select(v-model="filter.checkingStatus", placeholder="对账状态", @change="_fetchData")
          el-option(v-for="t in checkingTypes", :key="t.name", :value="t.value", :label="t.name")
        el-date-picker(placeholder='入金日期下限', type='date', format='yyyy-MM-dd', :value='date.depositDateLower', @input="handleDepositDateLower", :picker-options="pickerOptions")
        el-date-picker(placeholder='入金日期上限', type='date', format='yyyy-MM-dd', :value='date.depositDateUpper', @input="handleDepositDateUpper", :picker-options="pickerOptions")
        el-button(size="small", type="primary", @click="_fetchData")  搜索
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table.no-wrap-cell(:max-height="maxHeight", :data='fundDepositData', style='width: 100%', :summary-method="getSummaries", show-summary)
        el-table-column(prop='id', label='id', width='280')
        el-table-column(prop='accountSymbol', label='账户标记', width='100')
          template(scope="scope")
            span {{scope.row.accountSymbol | statusFormat}}
        el-table-column(prop='assetId', label='资产ID', width='280')
        el-table-column(prop='fundAccountId', label='资金账户ID', width='280')
        el-table-column(prop='checkingStatus', label='对账状态', width='100')
          template(scope="scope")
            span(:class="scope.row.checkingStatus | statusClass") {{scope.row.checkingStatus | statusFormat}}
        el-table-column(prop='createDateTime', label='创建时间', width='160')
          template(scope="scope")
            span {{scope.row.createDateTime | moment('YYYY-MM-DD HH:mm:ss')}}
        el-table-column(prop='createType', label='创建类型', width='100')
          template(scope="scope")
            span {{scope.row.createType | statusFormat}}
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
        el-table-column(prop='remark', label='备注', width="250")
        el-table-column(label='操作', fixed="right", width='100')
          template(scope="scope")
            .operations
              i.iconfont.icon-details(@click="detail(scope.row)")
              i.iconfont.icon-check(v-if="scope.row.checkingStatus === 'UNPASS' && $permit('fundManualCheckUp')", @click="manualCheckUp(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total,  sizes, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find,
  indexOf
} from 'lodash'

import {
  fundDeposit,
  fundAutoCheckUp,
  isShowAutoCheckUp
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
      return status ? status.name : '-'
    }
  },
  methods: {
    handleDepositDateLower(value) {
      this.filter.depositDateLower = value ? moment(value).format('YYYYMMDD') : ''
      this.date.depositDateLower = value ? moment(value).format('YYYY-MM-DD') : ''
      this._fetchData()
    },
    handleDepositDateUpper(value) {
      this.filter.depositDateUpper = value ? moment(value).format('YYYYMMDD') : ''
      this.date.depositDateUpper = value ? moment(value).format('YYYY-MM-DD') : ''
      this._fetchData()
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

      if (this.$permit('isShowAutoCheckUp')) {
        isShowAutoCheckUp.get().then(res => {
          const data = res.data.data
          this.ShowAutoCheckUp = (data.isShow)
        })
      }
    },

    detail(rows) {
      this.$router.push({
        name: 'fundDepositDetailForm',
        params: rows
      })
    },

    autoCheckUp() {
      const confirmMsg = '资金账户流水录入完毕，完成对账？'
      this.$confirm(confirmMsg, '提示', {
        type: 'warning'
      }).then(() => {
        fundAutoCheckUp.get({
          loadingMaskTarget: '.fund-deposit-detail'
        }).then(res => {
          const data = res.data
          this.operationStatus(data)
        })
      })
    },

    manualCheckUp(rows) {
      this.$router.push({
        name: 'fundDepositDetailForm',
        params: rows
      })
    },

    operationStatus(data) {
      if (data.resultCode === 'SUCCESS') {
        this._fetchData()
        this.$message.success({
          message: data.resultMsg || '成功！',
          duration: 0,
          showClose: true
        })
      } else {
        this.$message.error({
          message: data.resultMsg || '失败！'
        })
      }
    },

    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '当页合计'
          return
        }
        if (indexOf([1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12], index) > -1) {
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
    const { depositDate } = this.$route.query
    this.date.depositDate = depositDate ? Vue.filter('moment')(depositDate, 'YYYY-MM-DD') : ''
    this._fetchData()
  },

  data() {
    return {
      pickerOptions: '',
      ShowAutoCheckUp: '',
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      fundDepositData: [],
      date: {
        depositDate: '',
        depositDateLower: '',
        depositDateUpper: ''
      },
      filter: {
        fundAccountId: '',
        assetId: '',
        checkingStatus: '',
        depositDateLower: '',
        depositDateUpper: '',
        depositType: '',
        page: 1,
        limit: 10
      },
      checkingTypes: [{
        name: '待对账',
        value: 'WAIT_CHECKING'
      }, {
        name: '对账通过',
        value: 'PASS'
      }, {
        name: '对账不通过',
        value: 'UNPASS'
      }],
      depositTypes: [{
        name: '月供',
        value: 'NSTALMENT'
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
