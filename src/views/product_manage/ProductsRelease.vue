<template lang="pug">
  section.products-release
    .box
      .filters
        el-date-picker(placeholder='上架日期下限', type='date', v-model.lazy='filter.carriageDateLower', :picker-options="pickerOptions")
        el-date-picker(placeholder='上架日期上限', type='date', v-model.lazy='filter.carriageDateUpper', :picker-options="pickerOptions")
        el-date-picker(placeholder='起息日下限', type='date', v-model.lazy='filter.valueDateLower', :picker-options="pickerOptions")
        el-date-picker(placeholder='起息日上限', type='date', v-model.lazy='filter.valueDateUpper', :picker-options="pickerOptions")
        el-input(placeholder='产品名称', icon='search', v-model.lazy='filter.productName')
        el-select(v-model="filter.assetFrom", placeholder="资产来源")
          el-option(v-for="t in assetTypes", :key="t.name", :value="t.value", :label="t.name")
        el-button(size="small", @click="clearFilter")  清除
        el-button(size="small", type="primary", @click="search") 查询
    .table-container
      el-table(:data='productsRelease', style='width: 100%')
        el-table-column(prop='productName', fixed="left", label='产品名称', width='220')
        el-table-column(prop='productCode', fixed="left", label='产品代码', width='220')
        el-table-column(prop='assetFrom', fixed="left", label='资产来源', width='100')
        el-table-column(prop='productStatus', label='产品状态', width='220')
        el-table-column(prop='profitYearRate', label='发行利率', width='220')
          template(scope="scope")
            span {{scope.row.profitYearRate | ktPercent}}
        el-table-column(prop='carriageDate', label='上架日期', width='120')
          template(scope="scope")
            span {{scope.row.carriageDate | moment('YYYY-MM-DD')}}
        el-table-column(prop='underDate', label='下架日期', width='220')
          template(scope="scope")
            span {{scope.row.underDate | moment('YYYY-MM-DD')}}
        el-table-column(prop='valueDate', label='起息日期', width='220')
          template(scope="scope")
            span {{scope.row.valueDate | moment('YYYY-MM-DD')}}
        el-table-column(prop='term', label='期限', width='220')
        el-table-column(prop='requestAmount', label='申请融资金额', width='220')
          template(scope="scope")
            span {{scope.row.requestAmount | ktCurrency}}
        el-table-column(prop='dueDate', label='到期日', width='220')
          template(scope="scope")
            span {{scope.row.dueDate | moment('YYYY-MM-DD')}}
        el-table-column(prop='factCollectAmount', label='实际募集金额', width='220')
          template(scope="scope")
            span {{scope.row.factCollectAmount | ktCurrency}}
        el-table-column(prop='dueTotalInterest', label='到期应付总收益', width='220')
          template(scope="scope")
            span {{scope.row.dueTotalInterest | ktCurrency}}
        el-table-column(prop='factDueDate', label='实际到期日期', width='220')
          template(scope="scope")
            span {{scope.row.factDueDate | moment('YYYY-MM-DD')}}
        el-table-column(prop='factRedeemAmount', label='实际兑付给投资人总金额', width='220')
          template(scope="scope")
            span {{scope.row.factRedeemAmount | ktCurrency}}
        el-table-column(prop='minPreDueDate', label='最早可提前还款日期', width='220')
          template(scope="scope")
            span {{scope.row.minPreDueDate | moment('YYYY-MM-DD')}}
        el-table-column(prop='redeemAmount', label='到期应对付总金额', width='220')
          template(scope="scope")
            span {{scope.row.requestAmount | ktCurrency}}
        el-table-column(prop='remark', label='备注', width='220')
        el-table-column(label='操作', fixed="right", width='60')
          template(scope="scope")
            .operations
              i.iconfont.icon-edit(@click="audit(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  each,
  merge
} from 'lodash'

import {
  productsRelease
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
        target: '.products-release'
      })
      productsRelease.post({
        params: {
          ...pruneParams(this.filter)
        }
      }).then(res => {
        const data = res.data.data
        this.productsRelease = data.rows
        this.page.total = data.total
        loadingInstance.close()
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

  mounted() {
    this.filter = merge(this.filter, this.$route.query)
    this._fetchData()
  },

  data() {
    return {
      pickerOptions: '',
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      productsRelease: [],
      filter: {
        carriageDateLower: '',
        carriageDateUpper: '',
        valueDateLower: '',
        valueDateUpper: '',
        assetFrom: '',
        productName: '',
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
