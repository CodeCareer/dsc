<template lang="pug">
  section.car-gps
    .box
      .box-header
        h3 筛选条件
        //- .buttons
        //-   el-button(type="primary", size="small", @click="addCarGps()")
        //-     i.iconfont.icon-add
        //-     | 新增
      .filters
        el-input(placeholder='品牌', icon='search', @keyup.native.13='search', v-model='filter.brandName')
        el-input(placeholder='车系', icon='search', @keyup.native.13='search', v-model='filter.seriesName')
        el-input(placeholder='车型', icon='search', @keyup.native.13='search', v-model='filter.modelName')
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='carGps', style='width: 100%')
        el-table-column(prop='brandName', label='品牌', width='200')
        el-table-column(prop='seriesName', label='车系', width='200')
        el-table-column(prop='modelName', label='车型', width='200')
        el-table-column(prop='guidePrice', label='厂商指导价', width='120')
          template(scope="scope")
            span {{scope.row.guidePrice | ktCurrency}}
        el-table-column(prop='residualValue', label='残值金额', width='120')
          template(scope="scope")
            span {{scope.row.residualValue | ktCurrency}}
        el-table-column(prop='updateTime', label='数据更新日期', width='200')
          template(scope="scope")
            span {{scope.row.updateTime | moment('YYYY-MM-DD HH:mm:ss')}}
        el-table-column(label='操作', :fixed="fixed", width='80')
          template(scope="scope")
            .operations
              i.iconfont.icon-edit(@click="editCarGps(scope.row)")
              //- i.iconfont.icon-delete(@click.stop="deleteCarGps(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge
} from 'lodash'
import {
  carGps
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
    addCarGps() {
      this.$router.push({
        name: 'carGpsForm',
        params: {
          id: 'add'
        }
      })
    },

    editCarGps(car) {
      this.$router.push({
        name: 'carGpsForm',
        params: {
          id: car.id
        }
      })
    },

    _fetchData() {
      carGps.get({
        loadingMaskTarget: '.car-gps',
        params: {
          ...pruneParams(this.filter)
        }
      }).then(res => {
        const data = res.data
        this.carGps = data.rows
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
      carGps: [],
      filter: {
        brandName: '',
        seriesName: '',
        modelName: '',
        page: 1,
        limit: 10
      }
    }
  }
}
</script>
