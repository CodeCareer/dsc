<template lang="pug">
  section.fund-deposit-detail
    .box
      .box-header
        h3 筛选条件
      .filters
        .filter-line
          el-input(placeholder='资产ID', icon='search', @keyup.native.13='search', v-model.trim='filter.assetId')
          el-input(placeholder='外部资产订单编号', icon='search', @keyup.native.13='search', v-model.trim='filter.outerAssetOrderNo')
          el-select(v-model="filter.assetFrom", placeholder="资产来源", @change="search")
            el-option(v-for="t in assetFroms", :key="t.name", :value="t.value", :label="t.name")
        .filter-line
          el-input(placeholder='产品代码', icon='search', @keyup.native.13='search', v-model.trim='filter.productCode')
          el-select(v-model="filter.assetStatus", placeholder="资产状态", @change="search")
            el-option(v-for="t in assetTypes", :key="t.name", :value="t.value", :label="t.name")
          el-button(size="small", type="primary", @click="search")  搜索
          el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table.no-wrap-cell(:max-height="maxHeight", :data='assetInfo', style='width: 100%')
        el-table-column(prop='assetBaseInfo.assetFrom', label='资产来源')
          template(scope="scope")
            span {{scope.row.assetBaseInfo.assetFrom | statusFormat}}
        el-table-column(prop='assetBaseInfo.outerAssetOrderNo', label='外部资产订单编号', width="160")
        el-table-column(prop='assetBaseInfo.productCode', label='产品代码', width="120")
        el-table-column(prop='assetBaseInfo.name', label='姓名', width="120")
        el-table-column(prop='assetCarCoreInfo.tenancyStartDate', label='租约起始日期', width="100")
          template(scope="scope")
            span {{scope.row.assetCarCoreInfo.tenancyStartDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='assetCarCoreInfo.tenancyEndDate', label='租约结束日期', width="100")
          template(scope="scope")
            span {{scope.row.assetCarCoreInfo.tenancyEndDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='assetCarCoreInfo.guidePrice', label='厂商指导价', width="120")
          template(scope="scope")
            span {{scope.row.assetCarCoreInfo.guidePrice | ktCurrency}}
        el-table-column(prop='assetCarCoreInfo.downPaymentsAmount', label='首付金额', width="120")
          template(scope="scope")
            span {{scope.row.assetCarCoreInfo.downPaymentsAmount | ktCurrency}}
        el-table-column(prop='assetCarCoreInfo.downPaymentsPercent', label='首付比例')
          template(scope="scope")
            span {{scope.row.assetCarCoreInfo.downPaymentsPercent | ktPercent}}
        el-table-column(prop='assetCarCoreInfo.instalmentAmount', label='月供金额', width="120")
          template(scope="scope")
            span {{scope.row.assetCarCoreInfo.instalmentAmount | ktCurrency}}
        el-table-column(prop='assetCarCoreInfo.restAmount', label='尾款金额', width="120")
          template(scope="scope")
            span {{scope.row.assetCarCoreInfo.restAmount | ktCurrency}}
        el-table-column(prop='assetBaseInfo.assetStatus', label='资产状态')
          template(scope="scope")
            span {{scope.row.assetBaseInfo.assetStatus | statusFormat}}
        el-table-column(label='操作')
          template(scope="scope")
            .operations
              i.iconfont.icon-details(@click="detail(scope.row)")
              i.iconfont.icon-repayPlan(@click="repayPlan(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total,  sizes, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'

import {
  assetInfo
} from '@/common/resource.js'

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
  name: '审核失败',
  value: 'AUDIT_FAILED'
}, {
  name: '审核成功，待入池',
  value: 'WAIT_INTO_POOL'
}, {
  name: '已入池',
  value: 'HAVE_IN_POOL'
}, {
  name: '已出池',
  value: 'HAVE_OUT_POOL'
}, {
  name: '募集失败',
  value: 'COLLECT_FAILED'
}, {
  name: '大搜车',
  value: 'DSC'
}, {
  name: '花生',
  value: 'HUASHENG'
}, {
  name: '未回购',
  value: 'NOT_BUY_BACK'
}, {
  name: '已回购-未打款',
  value: 'BUY_BACKED_UNPAID'
}, {
  name: '已回购-已打款',
  value: 'BUY_BACKED_PAID'
}, {
  name: '待推送校验',
  value: 'WAIT_PUSH_CHECK'
}, {
  name: '已推送校验',
  value: 'PUSH_CHECKED'
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
    parseInt: window.parseInt,
    _fetchData() {
      assetInfo.post(pruneParams(this.filter), {
        loadingMaskTarget: '.fund-deposit-detail'
      }).then(res => {
        const data = res.data.data
        this.assetInfo = data.rows
        this.page.total = data.total
      })
    },

    detail(rows) {
      this.$router.push({
        name: 'assetInfoForm',
        params: {
          assetId: rows.assetBaseInfo.id
        }
      })
    },

    repayPlan(rows) {
      this.$router.push({
        name: 'repayPlan',
        query: {assetId: rows.assetCarCoreInfo.assetId}
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
      assetInfo: [],
      filter: {
        assetId: '',
        assetFrom: '',
        outerAssetOrderNo: '',
        productCode: '',
        assetStatus: '',
        page: 1,
        limit: 10
      },
      assetFroms: [{
        name: '花生',
        value: 'HUASHENG'
      }, {
        name: '大搜车',
        value: 'DSC'
      }],
      assetTypes: [{
        name: '待审核',
        value: 'WAIT_AUDIT'
      }, {
        name: '审核失败',
        value: 'AUDIT_FAILED'
      }, {
        name: '审核成功，待入池',
        value: 'WAIT_INTO_POOL'
      }, {
        name: '已入池',
        value: 'HAVE_IN_POOL'
      }, {
        name: '已出池',
        value: 'HAVE_OUT_POOL'
      }, {
        name: '募集失败',
        value: 'COLLECT_FAILED'
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
