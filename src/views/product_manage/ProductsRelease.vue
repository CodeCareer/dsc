<template lang="pug">
  section.products-release
    .box
      .box-header
        h3 筛选条件
      .filters
        .filter-line 
          el-input(placeholder='产品名称', icon='search', @keyup.native.13="search", v-model.trim='filter.productName')
          el-input(placeholder='产品代码', icon='search', @keyup.native.13="search", v-model.trim='filter.productCode')
          el-select(v-model="filter.assetFrom", placeholder="资产来源", @change="search")
            el-option(v-for="t in assetTypes", :key="t.name", :value="t.value", :label="t.name")
          el-select(v-model="filter.productStatus", placeholder="产品状态", @change="search")
            el-option(v-for="t in productStatusTypes", :key="t.name", :value="t.value", :label="t.name")
          el-select(v-model="filter.assetAcceptStatus", placeholder="资产接收状态", @change="search")
            el-option(v-for="t in assetAcceptStatusTypes", :key="t.name", :value="t.value", :label="t.name")
        .filter-line
          el-date-picker(placeholder='上架日期下限', format='yyyy-MM-dd', type='date', :value='date.carriageDateLower', @input="handleCarriageDateLower", :picker-options="pickerOptions")
          el-date-picker(placeholder='上架日期上限', format='yyyy-MM-dd', type='date', :value='date.carriageDateUpper', @input="handleCarriageDateUpper", :picker-options="pickerOptions")
          el-date-picker(placeholder='起息日下限', format='yyyy-MM-dd', type='date', :value='date.valueDateLower', @input="handleValueDateLower", :picker-options="pickerOptions")
          el-date-picker(placeholder='起息日上限', format='yyyy-MM-dd', type='date', :value='date.valueDateUpper', @input="handleValueDateUpper", :picker-options="pickerOptions")
          el-button(size="small", type="primary", @click="search")  搜索
          el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table.no-wrap-cell(:max-height="maxHeight", :data='productsRelease', style='width: 100%')
        el-table-column(prop='productName', label='产品名称', width='250')
        el-table-column(prop='productCode', label='产品代码', width='150')
        el-table-column(prop='assetFrom', label='资产来源', width='100')
          template(scope="scope")
            span {{scope.row.assetFrom | statusFormat}}
        el-table-column(prop='productStatus', label='产品状态', width='110')
          template(scope="scope")
            span {{scope.row.productStatus | statusFormat}}
        el-table-column(prop='assetAcceptStatus', label='资产接收状态', width='110')
          template(scope="scope")
            span {{scope.row.assetAcceptStatus | statusFormat}}
        el-table-column(prop='profitYearRate', label='发行利率', width='100')
          template(scope="scope")
            span {{scope.row.profitYearRate | ktPercent}}
        el-table-column(prop='carriageDate', label='上架日期', width='100')
          template(scope="scope")
            span {{scope.row.carriageDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='underDate', label='下架日期', width='100')
          template(scope="scope")
            span {{scope.row.underDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='valueDate', label='起息日期', width='100')
          template(scope="scope")
            span {{scope.row.valueDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='term', label='期限', width='100')
        el-table-column(prop='requestAmount', label='申请融资金额', width='110')
          template(scope="scope")
            span {{scope.row.requestAmount | ktCurrency}}
        el-table-column(prop='dueDate', label='到期日', width='100')
          template(scope="scope")
            span {{scope.row.dueDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='factCollectAmount', label='实际募集金额', width='110')
          template(scope="scope")
            span {{scope.row.factCollectAmount | ktCurrency}}
        el-table-column(prop='dueTotalInterest', label='到期应付总收益', width='120')
          template(scope="scope")
            span {{scope.row.dueTotalInterest | ktCurrency}}
        el-table-column(prop='factDueDate', label='实际到期日期', width='110')
          template(scope="scope")
            span {{scope.row.factDueDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='factRedeemAmount', label='实际兑付给投资人总金额', width='170')
          template(scope="scope")
            span {{scope.row.factRedeemAmount | ktCurrency}}
        el-table-column(prop='minPreDueDate', label='最早可提前还款日期', width='140')
          template(scope="scope")
            span {{scope.row.minPreDueDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='redeemAmount', label='到期应兑付总金额', width='140')
          template(scope="scope")
            span {{scope.row.redeemAmount | ktCurrency}}
        el-table-column(prop='leftPeriods', label='剩余期数', width='100')
        el-table-column(prop='repayType', label='还款方式', width='140')
          template(scope="scope")
            span {{scope.row.repayType | statusFormat}}
        el-table-column(prop='totalPeriods', label='总期数', width='100')
        el-table-column(prop='remark', label='备注', width='220')
        el-table-column(label='操作', fixed="right", width='60')
          template(scope="scope")
            .operations
              i.iconfont.icon-shenhe(v-if="scope.row.productStatus === 'AUTO_AUDIT_FAIL_WAIT_CONFIRMED' && $permit('productsAudit')", @click="audit(scope.row)")
              i.iconfont.icon-details(v-else, @click="audit(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total,  sizes, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'

import {
  productsRelease
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
  name: '大搜车',
  value: 'DSC'
}, {
  name: '花生',
  value: 'HUASHENG'
}, {
  name: '待审核',
  value: 'WAITING_AUDIT'
}, {
  name: '自动审核失败',
  value: 'AUTO_AUDIT_FAIL_WAIT_CONFIRMED'
}, {
  name: '审核成功',
  value: 'WAITING_COLLECT'
}, {
  name: '审核失败',
  value: 'AUDIT_FAIL'
}, {
  name: '募集中',
  value: 'COLLECTING'
}, {
  name: '已成立',
  value: 'DURATION'
}, {
  name: '募集失败',
  value: 'COLLECT_FAIL'
}, {
  name: '已回款',
  value: 'FINISHED'
}, {
  name: '一次性还本付息',
  value: 'ONE_TIME'
}, {
  name: '按月等额本息',
  value: 'AVAERAGEC_CAPITAL_INTEREST'
}, {
  name: '已接收',
  value: 'ACCEPTED'
}, {
  name: '未接收',
  value: 'NOT_ACCEPT'
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
      return status ? status.name : '-'
    }
  },
  methods: {
    handleValueDateUpper(value) {
      this.filter.valueDateUpper = value ? moment(value).format('YYYYMMDD') : ''
      this.date.valueDateUpper = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    handleValueDateLower(value) {
      this.filter.valueDateLower = value ? moment(value).format('YYYYMMDD') : ''
      this.date.valueDateLower = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    handleCarriageDateUpper(value) {
      this.filter.carriageDateUpper = value ? moment(value).format('YYYYMMDD') : ''
      this.date.carriageDateUpper = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    handleCarriageDateLower(value) {
      this.filter.carriageDateLower = value ? moment(value).format('YYYYMMDD') : ''
      this.date.carriageDateLower = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    parseInt: window.parseInt,
    _fetchData() {
      productsRelease.post(pruneParams(this.filter), {
        loadingMaskTarget: '.products-release'
      }).then(res => {
        const data = res.data.data
        this.productsRelease = data.rows
        this.page.total = data.total
      })
    },

    audit(rows) {
      this.$router.push({
        name: 'productsReleaseForm',
        params: rows
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
    const {carriageDateLower, carriageDateUpper, valueDateLower, valueDateUpper} = this.$route.query
    this.date.carriageDateLower = carriageDateLower ? Vue.filter('moment')(carriageDateLower, 'YYYY-MM-DD') : ''
    this.date.carriageDateUpper = carriageDateUpper ? Vue.filter('moment')(carriageDateUpper, 'YYYY-MM-DD') : ''
    this.date.valueDateLower = valueDateLower ? Vue.filter('moment')(valueDateLower, 'YYYY-MM-DD') : ''
    this.date.valueDateUpper = valueDateUpper ? Vue.filter('moment')(valueDateUpper, 'YYYY-MM-DD') : ''
    this._fetchData()
  },

  data() {
    return {
      pickerOptions: '',
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      productsRelease: [],
      date: {
        carriageDateLower: '',
        carriageDateUpper: '',
        valueDateLower: '',
        valueDateUpper: ''
      },
      filter: {
        carriageDateLower: '',
        carriageDateUpper: '',
        valueDateLower: '',
        valueDateUpper: '',
        assetFrom: '',
        productName: '',
        productCode: '',
        productStatus: '',
        assetAcceptStatus: '',
        page: 1,
        limit: 10
      },
      assetTypes: [{
        name: '花生',
        value: 'HUASHENG'
      }, {
        name: '大搜车',
        value: 'DSC'
      }],
      assetAcceptStatusTypes: [{
        name: '已接收',
        value: 'ACCEPTED'
      }, {
        name: '未接收',
        value: 'NOT_ACCEPT'
      }],
      productStatusTypes: [{
        name: '待审核',
        value: 'WAITING_AUDIT'
      }, {
        name: '自动审核失败',
        value: 'AUTO_AUDIT_FAIL_WAIT_CONFIRMED'
      }, {
        name: '审核成功',
        value: 'WAITING_COLLECT'
      }, {
        name: '审核失败',
        value: 'AUDIT_FAIL'
      }, {
        name: '募集中',
        value: 'COLLECTING'
      }, {
        name: '已成立',
        value: 'DURATION'
      }, {
        name: '募集失败',
        value: 'COLLECT_FAIL'
      }, {
        name: '已回款',
        value: 'FINISHED'
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
