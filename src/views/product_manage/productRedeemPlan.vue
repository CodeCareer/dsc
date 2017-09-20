<template lang="pug">
  section.products-release
    .box
      .box-header
        h3 筛选条件
      .filters
        .filter-line 
          el-input(placeholder='产品代码', icon='search', @keyup.native.13="search", v-model.trim='filter.productCode')
          el-input(placeholder='产品名称', icon='search', @keyup.native.13="search", v-model.trim='filter.productName')
          el-select(v-model="filter.redeemPlanStatus", placeholder="回款状态", @change="search")
            el-option(v-for="t in redeemPlanStatus", :key="t.name", :value="t.value", :label="t.name")
          el-button(size="small", type="primary", @click="search")  搜索
          el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table.no-wrap-cell(:max-height="maxHeight", :data='productRedeemPlan', style='width: 100%')
        el-table-column(prop='id', label='ID', width='280')
        el-table-column(prop='period', label='回款期数', width='100')
        el-table-column(prop='productCode', label='产品代码', width='200')
        el-table-column(prop='productName', label='产品名称', width='160')
        el-table-column(prop='redeemAmount', label='回款本息', width='200')
        el-table-column(prop='redeemCorpus', label='回款本金', width='200')
        el-table-column(prop='redeemDate', label='回款日期', width='160')
          template(scope="scope")
            span {{scope.row.redeemDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='redeemInterest', label='回款利息', width='200')
          template(scope="scope")
            span {{scope.row.redeemInterest | ktCurrency}}
        el-table-column(prop='redeemPlanStatus', label='回款状态', width='120')
          template(scope="scope")
            span {{scope.row.redeemPlanStatus | statusFormat}}
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total,  sizes, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'

import {
  productRedeemPlan
} from '@/common/resource.js'

import {
  pruneParams
} from '@/common/util.js'

import {
  tableListMixins
} from '@/common/mixins.js'

const statusList = [{
  name: '待回款',
  value: 'WAIT_REDEEM'
}, {
  name: '已回款',
  value: 'REDEEMED'
}]

export default {
  mixins: [tableListMixins],
  filters: {
    statusClass(value) {
      const classMap = {
        'AUDIT_FAILED': 'color-red',
        'WAIT_INTO_POOL': 'color-green'
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
      productRedeemPlan.post(pruneParams(this.filter), {
        loadingMaskTarget: '.products-release'
      }).then(res => {
        const data = res.data.data
        this.productRedeemPlan = data.rows
        this.page.total = data.total
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
    this._fetchData()
  },

  data() {
    return {
      pickerOptions: '',
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      productRedeemPlan: [],
      filter: {
        productCode: '',
        productName: '',
        redeemPlanStatus: '',
        page: 1,
        limit: 10
      },
      redeemPlanStatus: [{
        name: '待回款',
        value: 'WAIT_REDEEM'
      }, {
        name: '已回款',
        value: 'REDEEMED'
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
