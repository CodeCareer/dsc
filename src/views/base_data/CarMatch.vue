<template lang="pug">
  section.car-match
    .box
      .box-header
        h3 筛选条件
        //- el-button(type="primary", size="small", @click="addCarMatch()")
          i.iconfont.icon-add
          | 新增
      .filters
        .filter-line
          el-input(placeholder='资产来源', icon='search', @keyup.native.13="search", v-model='filter.assetFrom')
          el-input(placeholder='品牌', icon='search', @keyup.native.13="search", v-model='filter.brandName')
          el-input(placeholder='车系', icon='search', @keyup.native.13="search", v-model='filter.seriesName')
          el-input(placeholder='车型', icon='search', @keyup.native.13="search", v-model='filter.modelName')
        .filter-line
          el-select(placeholder="状态", v-model="filter.status", @change="search")
            el-option(v-for="o in statusList", :value="o.value", :label="o.name", :key="o.value")
          el-button(size="small", type="primary", @click="search")  搜索
          el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='carMatchs', style='width: 100%')
        el-table-column(prop='assetFrom', label='资产来源')
        el-table-column(prop='brandName', label='品牌', width='200')
        el-table-column(prop='seriesName', label='车系', width='200')
        el-table-column(prop='modelName', label='车型', width='200')
        el-table-column(prop='status', label='状态', width='150')
          template(scope="scope")
            span(:class="scope.row.status | statusClass") {{scope.row.status | statusFormat}}
        el-table-column(label='手动匹配', width="80")
          template(scope="scope")
            .operations
              i.iconfont.icon-pipei(title="手动关联匹配车型信息", @click="editCarMatch(scope.row)", v-if="$permit('carMatchUpdate')")
              //- i.iconfont.icon-delete(@click.stop="deleteCarMatch(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
    car-match-dialog(ref="carMatchDialog", @dialog-close="updateRow")
</template>

<script>
import {
  merge,
  find
} from 'lodash'
import {
  pruneParams
} from '@/common/util.js'
import {
  carMatchs
} from '@/common/resource.js'
import {
  tableListMixins
} from '@/common/mixins.js'
import CarMatchDialog from '@/views/base_data/CarMatchDialog.vue'

const statusList = [{
  name: '全部',
  value: '_all_'
}, {
  name: '待匹配',
  value: 'WATING_MATCH'
}, {
  name: '已匹配',
  value: 'MATCH_SUCCESS'
}]

export default {
  mixins: [tableListMixins],
  components: {
    CarMatchDialog
  },

  filters: {
    statusClass(value) {
      const classMap = {
        'MATCH_SUCCESS': 'color-green',
        'WATING_MATCH': 'color-red'
      }
      return classMap[value] || ''
    },
    statusFormat(value) {
      const status = find(statusList, s => s.value === value)
      return status ? status.name : '未知状态'
    }
  },

  methods: {
    _fetchData() {
      carMatchs.get({
        loadingMaskTarget: '.car-match',
        params: {
          ...pruneParams(this.filter)
        }
      }).then(res => {
        const data = res.data.data
        this.carMatchs = data.rows
        this.page.total = data.total
      })
    },

    updateRow(checkedCar) {
      if (!checkedCar.id) return
      this.activeCarMatch.baseId = checkedCar.id
      this.activeCarMatch.status = 'MATCH_SUCCESS'
    },

    editCarMatch(value) {
      this.activeCarMatch = value
      this.$refs.carMatchDialog.open(value)
    }
  },

  watch: {
    $route() {
      this._fetchData()
    }
  },

  mounted() {
    merge(this.filter, this.$route.query)
    this._fetchData()
  },

  data() {
    return {
      // fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      carMatchs: [],
      statusList,
      activeCarMatch: null,
      filter: {
        status: '',
        assetFrom: '',
        brandName: '',
        seriesName: '',
        modelName: '',
        page: 1,
        limit: 10
      },
      page: {
        total: 1000,
        sizes: [10, 20, 30, 50]
      }
    }
  }
}
</script>
