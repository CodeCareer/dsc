<template lang="pug">
  section.account-deposit-manage
    .box
      .box-header
        h3 筛选条件
        .buttons
          el-button(type="primary", size="small", @click="add()")
            i.iconfont.icon-add
            | 新增
      .filters
        el-date-picker(placeholder='入金日期', format='yyyy-MM-dd', type='date', :value='date.payDate', @input="handlePayDate", :picker-options="pickerOptions")
        el-select(v-model="filter.accountType", placeholder="账户类型" @change="search")
          el-option(v-for="t in assetTypes", :key="t.name", :value="t.value", :label="t.name")
        el-button(size="small", type="primary", @click="search")  搜索
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='accountDeposit', style='width: 100%')
        el-table-column(prop='accountName', label='账户名称', width='220')
        el-table-column(prop='fundAccountId', label='资金账户id', width='280')
        el-table-column(prop='accountType', label='账户类型', width='100')
          template(scope="scope")
            span {{scope.row.accountType | statusFormat}}
        el-table-column(prop='createDateTime', label='创建时间', width='100')
          template(scope="scope")
            span {{scope.row.createDateTime | moment('YYYY-MM-DD')}}
        el-table-column(prop='auditStatus', label='审核状态', width='100')
          template(scope="scope")
            span(:class="scope.row.auditStatus | statusClass") {{scope.row.auditStatus | statusFormat}}
        el-table-column(prop='fundDirection', label='资金方向', width='100')
          template(scope="scope")
            span {{scope.row.fundDirection | statusFormat}}
        el-table-column(prop='factPayAmount', label='实际支付金额', width='140')
          template(scope="scope")
            span {{scope.row.factPayAmount | ktCurrency}}
        el-table-column(prop='payDate', label='支付日期', width='100')
          template(scope="scope")
            span {{scope.row.payDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='payWithStartDate', label='支付款对应开始日期', width='140')
          template(scope="scope")
            span {{scope.row.payWithStartDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='payWithEndDate', label='支付款对应结束日期', width='140')
          template(scope="scope")
            span {{scope.row.payWithEndDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='checkingStatus', label='对账状态', width='100')
          template(scope="scope")
            span(:class="scope.row.checkingStatus | statusClass") {{scope.row.checkingStatus | statusFormat}}
        el-table-column(prop='unpassReason', label='对账不通过原因', width='220')
        el-table-column(label='操作', fixed="right", width='120')
          template(scope="scope")
            .operations
              i.iconfont.icon-edit(@click="edit(scope.row)")
              i.iconfont.icon-shenhe(@click="audit(scope.row)")
              i.iconfont.icon-delete(@click="del(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'

import {
  accountDepositManage,
  accountDepositDelete,
  accountDepositAudit
} from '@/common/resource.js'
import moment from 'moment'
import Vue from 'vue'

import {
  pruneParams
} from '@/common/util.js'

import {
  tableListMixins
} from '@/common/mixins.js'

const statusList = [{
  name: '待审核',
  value: 'WAIT_AUDIT'
}, {
  name: '已审核',
  value: 'AUDITED'
}, {
  name: '流入',
  value: 'IN'
}, {
  name: '流出',
  value: 'OUT'
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
        'AUDITED': 'color-green',
        'WAIT_AUDIT': 'color-red',
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
    handlePayDate(value) {
      this.filter.payDate = value ? moment(value).format('YYYYMMDD') : ''
      this.date.payDate = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    parseInt: window.parseInt,
    _fetchData() {
      accountDepositManage.post(pruneParams(this.filter), {
        loadingMaskTarget: '.account-deposit-manage'
      }).then(res => {
        const data = res.data.data
        this.accountDeposit = data.rows
        this.page.total = data.total
      })
    },

    del(rows) {
      this.$confirm('确定删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        accountDepositDelete.post({id: rows.id}, {
          loadingMaskTarget: '.account-deposit-manage'
        }).then(res => {
          const data = res.data
          this.operationStatus(data)
        })
      }).catch(() => {})
    },

    audit(rows) {
      this.$confirm('确定审核通过吗？', '提示', {
        type: 'warning'
      }).then(() => {
        accountDepositAudit.post({id: rows.id}, {
          loadingMaskTarget: '.account-deposit-manage'
        }).then(res => {
          const data = res.data
          this.operationStatus(data)
        })
      }).catch(() => {})
    },

    edit(rows) {
      this.$router.push({
        name: 'accountDepositForm',
        params: rows
      })
    },

    add(rows) {
      this.$router.push({
        name: 'accountDepositForm',
        params: {
          id: 'add'
        }
      })
    },

    operationStatus(data) {
      if (data.resultCode === 'SUCCESS') {
        this.$message.success({
          message: data.resultMsg || '成功！'
        })
      } else {
        this.$message.error({
          message: data.resultMsg || '失败！'
        })
      }
    }
  },

  watch: {
    $route() {
      this._fetchData()
    }
  },

  created() {
    this.filter = merge(this.filter, this.$route.query)
    const { payDate } = this.$route.query
    this.date.payDate = payDate ? Vue.filter('moment')(payDate, 'YYYY-MM-DD') : ''
    this._fetchData()
  },

  data() {
    return {
      pickerOptions: '',
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      accountDeposit: [],
      date: {
        payDate: ''
      },
      filter: {
        accountType: '',
        payDate: '',
        page: 1,
        limit: 10
      },
      assetTypes: [{
        name: '花生',
        value: 'HUASHENG'
      }, {
        name: '大搜车',
        value: 'DSC'
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
