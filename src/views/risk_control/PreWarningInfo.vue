<template lang="pug">
  section.risk-zr
    .box
      .box-header
        h3 筛选条件
      .filters
          el-select(v-model="filter.assetFrom",filterable,placeholder="资产方",@change="search",)
            el-option(v-for="asset in assetFromList",:key="asset.value",:value="asset.value",:label="asset.name")
          el-select(v-model="filter.name",filterable,placeholder="预警名称",@change="search")
            el-option(v-for="type in assetTypesComputed",:label="type.value",:value="type.value",:key="type.value")
          el-select(v-model="filter.status",filterable,placeholder="状态",@change="search",)
            el-option(v-for="option in options",:key="option.value",:value="option.value",:label="option.label")
          el-input(placeholder='预警对象ID', icon='search', @keyup.native.13="search", v-model='filter.subjectId')
          el-button(size="small", type="primary",@click="search") 搜索
          el-button(size="small", type="primary",@click="clearFilter")  清除
    .risk-table.table-container
      el-table.no-wrap-cell(:max-height="maxHeight", :data="riskDatas")
        el-table-column(label="资产方")
          template(scope="scope")
            span {{scope.row.assetFrom | assetFromLocal}}
        el-table-column(label="预警名称",width="180")
          template(scope="scope")
            span {{scope.row.name | ktNull}}
        el-table-column(label="预警对象ID",width="250")
          template(scope="scope")
            span {{scope.row.subjectId | ktNull}}
        el-table-column(label="当前状态")
          template(scope="scope")
            span {{scope.row.status | riskWarn}}
        el-table-column(label="预警创建时间",width="150")
          template(scope="scope")
            span {{scope.row.createdAt | moment('YYYY-MM-DD HH:mm:ss')}}
        el-table-column(label="预警更新时间",width="150")
          template(scope="scope")
            span {{scope.row.updatedAt | moment('YYYY-MM-DD HH:mm:ss')}}
        el-table-column(label="详情",width="500")
          template(scope="scope")
            span {{scope.row.description | ktNull}}
      el-pagination(@size-change="pageSizeChange",@current-change="pageChange",:current-page="parseInt(filter.page)",:page-sizes="page.sizes",:page-size="parseInt(filter.pageSize)",layout="total, sizes, prev, pager, next, jumper",:total="parseInt(page.total)")

</template>

<script>
import {
  riskWarn,
  riskQuery
} from '@/common/resource.js'
import {
  pruneParams
} from '@/common/util.js'
import {
  // each,
  merge,
  map,
  flatten,
  find,
  filter
} from 'lodash'
import {
  tableListMixins
} from '@/common/mixins.js'

import baseDataMixin from '@/views/base_data/mixin.js'

const options = [{
  value: 'NEW',
  label: '新预警'
}, {
  value: 'IGNORE',
  label: '已忽略'
}, {
  value: 'NOTIFIED',
  label: '已通知'
}, {
  value: 'PROCESSED',
  label: '已处理'
}]

export default {
  mixins: [tableListMixins, baseDataMixin],
  data() {
    return {
      riskDatas: [],
      filter: {
        assetFrom: '',
        name: '',
        type: 'WARNING',
        page: 1,
        limit: 10,
        status: '',
        subjectId: ''
      },
      assetTypes: [],
      page: {
        total: 1000,
        sizes: [10, 20, 30, 40]
      },
      options: options
    }
  },

  filters: {
    riskWarn(value) {
      const filterStatus = find(options, v => value === v.value)
      return filterStatus ? filterStatus.label : '-'
    }
  },

  methods: {
    risktemGet() {
      riskWarn.get({
        params: {
          ...pruneParams(this.filter)
        },
        loadingMaskTarget: '.risk-zr'
      }).then((res) => {
        const data = res.data.data
        this.riskDatas = data.rows
        this.page.total = data.total
      }).catch((res) => {})
    },

    riskQueryGet() {
      riskQuery.get({
        params: {
          ...pruneParams(this.filter)
        },
        loadingMaskTarget: '.risk-zr'
      }).then(res => {
        this.assetTypes = flatten(map(res.data.data, val => {
          return map(val.riskRules, val2 => {
            return { tag: val.name.indexOf('花生') > -1 ? 'HUASENG' : 'DSC', value: val2.name }
          })
        }))
      })
    }
  },

  computed: {
    assetTypesComputed() {
      return filter(this.assetTypes, val => {
        return this.filter.assetFrom ? val.tag === this.filter.assetFrom : true
      })
    }
  },

  watch: {
    $route() {
      this.risktemGet()
    }
  },
  created() {
    this.filter = merge(this.filter, this.$route.query)
    this.risktemGet()
    this.riskQueryGet()
  }
}
</script>

<style lang="scss">
</style>
