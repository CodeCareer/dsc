<template lang="pug">
  el-dialog(title='基础车型', v-model='carListVisible', size="large", @open="onCarListOpen")
    .car-list-dialog
      .box
        .box-header
          h3 筛选条件
        .filters
          el-input(placeholder='品牌', icon='search', @keyup.native.13='search()', v-model='filter.brandName')
          el-input(placeholder='车系', icon='search', @keyup.native.13='search()', v-model='filter.seriesName')
          el-input(placeholder='车型', icon='search', @keyup.native.13='search()', v-model='filter.modelName')
          el-button(size="small", type="primary", @click="search()")  搜索
          el-button(size="small", type="primary", @click="clearFilter")  清除
      .table-container
        el-table.no-wrap-cell(:data='carList', highlight-current-row, ref="carsTable", @current-change="checkCar", max-height="200")
          el-table-column(type='index', width='65', label='选择')
            template(scope="scope")
              el-checkbox.circle.mini(v-model="scope.row.checked")
          el-table-column(prop='brandName', label='品牌', width="120")
          el-table-column(prop='seriesName', label='车系', width="120")
          el-table-column(prop='modelName', label='车型')
          el-table-column(prop='guidePrice', label='厂商指导价')
            template(scope="scope")
              span {{scope.row.guidePrice | ktCurrency | ktNull}}
          el-table-column(prop='residualValue', label='残值金额')
            template(scope="scope")
              span {{scope.row.residualValue | ktCurrency | ktNull}}
          el-table-column(prop='updateTime', label='数据更新日期')
            template(scope="scope")
              span {{scope.row.updateTime | moment('YYYY-MM-DD HH:mm:ss')}}
        el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
    .dialog-footer(slot="footer")
      el-button(type="primary", size="small", @click='submit', v-if="$permit('carMatchUpdate')") 确定
</template>

<script>
import {
  carInfos,
  carMatch
} from '@/common/resource.js'
import {
  tableListMixins
} from '@/common/mixins.js'
import {
  map
  // find
} from 'lodash'

export default {
  mixins: [tableListMixins],
  methods: {
    _fetchData() {
      carInfos.get({
        params: {
          ...this.pruneParams(this.filter)
        },
        loadingMaskTarget: '.car-list-dialog'
      }).then(res => {
        const data = res.data.data
        this.page.total = data.total
        this.carInfos = data.rows
        // this.checkedCar = find(this.carInfos, c => c.id === this.carMatch.baseId) || {}
      })
    },

    search(savedPage) {
      // 重置到第一个页面
      if (!savedPage && this.filter.page !== 1) {
        this.filter.page = 1
        return
      }
      this._fetchData()
    },

    open(activeCarMatch) {
      this.carListVisible = true
      this.carMatch = activeCarMatch
      this.checkedCar = activeCarMatch.carInfo || {}
    },

    onCarListOpen() {
      this._fetchData()
    },

    checkCar(value) {
      if (!value) return
      this.checkedCar = value
    },

    submit() {
      if (!this.checkedCar.id) {
        this.$confirm(`您没有选择基础车型, 点击确认关闭?`, '提示', {
          type: 'warning'
        }).then(() => {
          this.carListVisible = false
        }).catch(() => {})
        return
      }

      carMatch.put({
        id: this.carMatch.id,
        baseId: this.checkedCar.id
      }, {
        loadingMaskTarget: '.car-list-dialog'
      }).then(res => {
        this.$message.success({
          message: '手动匹配保存成功！'
        })
        this.carListVisible = false
        this.$emit('dialog-close', this.checkedCar)
      })
    }
  },

  computed: {
    carList() {
      return map(this.carInfos, c => {
        c.checked = this.checkedCar && this.checkedCar.id === c.id
        return c
      })
    }
  },

  data() {
    return {
      carMatch: {},
      filter: {
        brandName: '',
        seriesName: '',
        modelName: '',
        page: 1,
        limit: 10
      },
      carListVisible: false,
      checkedCar: {},
      carInfos: []
    }
  }
}
</script>
