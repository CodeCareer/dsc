<template lang="pug">
  section.car-info
    .box
      .box-tab-head
        el-button(type="primary", size="small", @click="addCarInfo()")
          i.iconfont.icon-plus
          | 新增
      .filters
        el-input(placeholder='品牌', icon='search', v-model.lazy='filter.brandName')
        el-input(placeholder='车系', icon='search', v-model.lazy='filter.seriesName')
        el-input(placeholder='车型', icon='search', v-model.lazy='filter.modelName')
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='carInfos', style='width: 100%')
        el-table-column(prop='brandName', label='品牌', width='220')
        el-table-column(prop='seriesName', label='车系', width='120')
        el-table-column(prop='modelName', label='车型', width='220')
        el-table-column(prop='guidePrice', label='厂商指导价', width='220')
        el-table-column(prop='residualValue', label='残值金额', width='220')
        el-table-column(prop='updateTime', label='数据更新日期', width='120')
        el-table-column(label='操作', :fixed="fixed", width='100')
          template(scope="scope")
            .operations
              i.iconfont.icon-edit(@click="editCarInfo(scope.row)")
              i.iconfont.icon-delete(@click.stop="deleteCarInfo(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='page.current', :page-sizes="page.sizes", :page-size="page.size", layout='total, prev, pager, next, jumper', :total='carInfos.length')
</template>

<script>
import {
  each
} from 'lodash'

export default {
  methods: {
    clearFilter() {
      each(this.filter, (v, k) => {
        this.filter[k] = ''
      })
    },

    pageChange(val) {
      console.log(`分页${val}`)
    },

    pageSizeChange(val) {
      this.page.size = val
    },

    addCarInfo() {

    },

    editCarInfo() {

    },

    deleteCarInfo() {

    }
  },

  data() {
    return {
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      carInfos: [],
      filter: {
        brandName: '',
        seriesName: '',
        modelName: ''
      },
      page: {
        current: 1,
        size: 10,
        sizes: [10, 20, 30, 50]
      }
    }
  }
}
</script>
