<template lang="pug">
  el-dialog(title='账户信息', v-model='carListVisible', size="large", @open="onCarListOpen")
    .car-list-dialog
      .box
        .box-header
          h3 筛选条件
        .filters
          el-input(placeholder='品牌', icon='search', @keyup.native.13='search', v-model='filter.brandName')
          el-input(placeholder='车系', icon='search', @keyup.native.13='search', v-model='filter.seriesName')
          el-input(placeholder='车型', icon='search', @keyup.native.13='search', v-model='filter.modelName')
          el-button(size="small", type="primary", @click="clearFilter")  清除
      .table-container
        el-table(:data='carList', highlight-current-row, ref="carsTable", @current-change="checkCar", max-height="200")
          el-table-column(type='index', width='65', label='选择')
            template(scope="scope")
              el-checkbox.circle.mini(v-model="scope.row.checked")
          el-table-column(prop='brandName', label='品牌')
          el-table-column(prop='seriesName', label='车系')
          el-table-column(prop='modelName', label='车型')
          el-table-column(prop='guidePrice', label='厂商指导价')
            template(scope="scope")
              span {{scope.row.guidePrice | ktCurrency}}
          el-table-column(prop='residualValue', label='残值金额')
            template(scope="scope")
              span {{scope.row.residualValue | ktCurrency}}
          el-table-column(prop='updateTime', label='数据更新日期')
            template(scope="scope")
              span {{scope.row.updateTime | moment('YYYY-MM-DD HH:mm:ss')}}
        el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
    .dialog-footer(slot="footer")
      el-button(type="primary", size="small", @click='submit') 确定
</template>

<script>
import {
  carInfos,
  carMatchs
} from '@/common/resource.js'
import {
  tableListMixins
} from '@/common/mixins.js'
import {
  pruneParams
} from '@/common/util.js'
import {
  map
} from 'lodash'

export default {
  mixins: [tableListMixins],
  methods: {
    _fetchData() {
      carInfos.get({
        params: {
          ...pruneParams(this.filter)
        },
        loadingMaskTarget: '.car-list-dialog'
      }).then(res => {
        this.carInfos = res.data.rows
      })
    },

    search() {
      this._fetchData()
    },

    open(activeCarMatch) {
      this.checkedCar = {}
      this.carListVisible = true
      this.carMatch = activeCarMatch
    },

    onCarListOpen() {
      this._fetchData()
    },

    checkCar(value) {
      this.checkedCar = value
    },

    submit() {
      carMatchs.put({
        id: this.carMatch.id,
        baseId: this.checkedCar.id
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
        c.checked = this.checkedCar.id === c.id
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
