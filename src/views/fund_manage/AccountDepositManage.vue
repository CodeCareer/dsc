<template lang="pug">
  section.account-deposit-manage
    .box
      .box-tab-head
        el-button(type="primary", size="small", @click="add()")
          i.iconfont.icon-add
          | 新增
      .filters
        el-date-picker(placeholder='入金日期', type='date', v-model.lazy='filter.payDate', :picker-options="pickerOptions")
        el-select(v-model="filter.accountType", placeholder="账户类型")
          el-option(v-for="t in assetTypes", :key="t.name", :value="t.value", :label="t.name")
        el-button(size="small", @click="clearFilter")  清除
        el-button(size="small", type="primary", @click="search") 查询
    .table-container
      el-table(:data='accountDeposit', style='width: 100%')
        el-table-column(prop='fundAccountId', label='资金账户id', width='220')
        el-table-column(prop='accountType', label='账户类型', width='80')
          template(scope="scope")
            span {{scope.row.accountType | ktAccountType}}
        el-table-column(prop='createDateTime', label='创建时间', width='100')
          template(scope="scope")
            span {{scope.row.carriageDate | moment('YYYY-MM-DD')}}
        el-table-column(prop='auditStatus', label='审核状态', width='80')
          template(scope="scope")
            span {{scope.row.auditStatus | ktAuditStatus}}
        el-table-column(prop='fundDirection', label='资金方向', width='80')
          template(scope="scope")
            span {{scope.row.fundDirection | ktFundDirection}}
        el-table-column(prop='factPayAmount', label='实际支付金额', width='140')
          template(scope="scope")
            span {{scope.row.factPayAmount | ktCurrency}}
        el-table-column(prop='payDate', label='支付日期', width='100')
          template(scope="scope")
            span {{scope.row.payDate | moment('YYYY-MM-DD')}}
        el-table-column(prop='payWithStartDate', label='支付款对应开始日期', width='140')
          template(scope="scope")
            span {{scope.row.payWithStartDate | moment('YYYY-MM-DD')}}
        el-table-column(prop='payWithEndDate', label='支付款对应结束日期', width='140')
          template(scope="scope")
            span {{scope.row.payWithEndDate | moment('YYYY-MM-DD')}}
        el-table-column(prop='checkingStatus', label='对账状态', width='80')
          template(scope="scope")
            span {{scope.row.checkingStatus | ktCheckingStatus}}
        el-table-column(prop='unpassReason', label='对账不通过原因', width='220')
        el-table-column(label='操作', width='120')
          template(scope="scope")
            .operations
              i.iconfont.icon-edit(@click="edit(scope.row)")
              i.iconfont.icon-shenhe(@click="audit(scope.row)")
              i.iconfont.icon-delete(@click="del(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  each,
  merge
} from 'lodash'

import {
  accountDepositManage,
  accountDepositDelete,
  accountDepositAudit
} from '@/common/resource.js'

import {
  pruneParams
} from '@/common/util.js'

export default {
  methods: {
    parseInt: window.parseInt,
    clearFilter() {
      each(this.filter, (v, k) => {
        this.filter[k] = ''
      })
      this.search()
    },

    search() {
      this.$router.push({
        name: this.$route.name,
        query: pruneParams(this.filter)
      })
    },

    pageChange(val) {
      this.filter.page = val
      this.search()
    },

    pageSizeChange(val) {
      this.filter.limit = val
      this.search()
    },

    _fetchData() {
      const loadingInstance = this.$loading({
        target: '.account-deposit-manage'
      })
      accountDepositManage.post({
        params: {
          ...pruneParams(this.filter)
        }
      }).then(res => {
        const data = res.data.data
        this.accountDeposit = data.rows
        this.page.total = data.total
        loadingInstance.close()
      })
    },

    del(rows) {
      this.$confirm('确定删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const loadingInstance = this.$loading({
          target: '.account-deposit-manage'
        })
        accountDepositDelete.post({
          params: {
            id: rows.id
          }
        }).then(res => {
          const data = res.data
          this.operationStatus(data)
          loadingInstance.close()
        })
      }).catch(() => {})
    },

    audit(rows) {
      this.$confirm('确定审核通过吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const loadingInstance = this.$loading({
          target: '.account-deposit-manage'
        })
        accountDepositAudit.post({
          params: {
            id: rows.id
          }
        }).then(res => {
          const data = res.data
          this.operationStatus(data)
          loadingInstance.close()
        })
      }).catch(() => {})
    },

    edit(rows) {
      this.$router.push({
        name: 'accountDepositForm',
        params: {
          id: rows.id
        }
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
        this.$notify({
          title: '成功',
          message: data.resultMsg,
          type: 'success'
        })
      } else {
        this.$notify({
          title: '错误',
          message: data.resultMsg,
          type: 'error'
        })
      }
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
      pickerOptions: '',
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      accountDeposit: [],
      filter: {
        accountType: '',
        payDate: '',
        page: 1,
        limit: 10
      },
      page: {
        total: 100,
        sizes: [10, 20, 30, 50]
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
