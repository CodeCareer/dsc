<template lang="pug">
  section.back-record
    .box
      .box-header
        h3 筛选条件
      .filters
        el-input(placeholder='资产ID', icon='search', @keyup.native.13='search', v-model='filter.assetId')
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='backRecord', style='width: 100%')
        el-table-column(prop='assetId', label='资产ID')
        el-table-column(prop='buyBackAmout', label='回购金额')
          template(scope="scope")
            span {{scope.row.buyBackAmout | ktCurrency}}
        el-table-column(prop='buyBackDate', label='回购日期')
          template(scope="scope")
            span {{scope.row.buyBackDate | moment('YYYY-MM-DD', 'YYYYMMDD')}}
        el-table-column(prop='buyBackReason', label='回购原因')
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge
} from 'lodash'

import {
  backRecord
} from '@/common/resource.js'

import {
  pruneParams
} from '@/common/util.js'

import {
  tableListMixins
} from '@/common/mixins.js'

export default {
  mixins: [tableListMixins],
  methods: {
    parseInt: window.parseInt,
    _fetchData() {
      backRecord.post(pruneParams(this.filter), {
        loadingMaskTarget: '.back-record'
      }).then(res => {
        const data = res.data.data
        this.backRecord = data.rows
        this.page.total = data.total
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
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      backRecord: [],
      filter: {
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
