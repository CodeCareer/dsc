<template lang="pug">
  section.risk-zr
    .box
      .box-header
        h3 筛选条件
      .filters
          el-select(v-model="filter.assetFrom",filterable,placeholder="资产方",@change="search",)
            el-option(v-for="asset in assets",:key="asset.value",:value="asset.value",:label="asset.label")
          el-select(v-model="filter.name",filterable,placeholder="预警名称",@change="search")
            el-option(v-for="type in assetTypes",:label="type",:value="type",:key="type")
          el-select(v-model="filter.status",filterable,placeholder="状态",@change="search",)
            el-option(v-for="option in options",:key="option.value",:value="option.value",:label="option.label")
          el-input(placeholder='预警对象ID', icon='search', @keyup.native.13="search", v-model='filter.subjectId')
          el-button(size="small", type="primary",@click="search") 搜索
          el-button(size="small", type="primary",@click="clearFilter")  清除
    .risk-table.table-container
      el-table.no-wrap-cell(:max-height="maxHeight", :data="riskDatas")
        el-table-column(label="资产方")
          template(scope="scope")
            span {{scope.row.assetFrom | statusFormat}}
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
      el-pagination(@size-change="sizeChange",@current-change="currentChange",:current-page="parseInt(filter.page)",:page-sizes="page.sizes",:page-size="parseInt(filter.pageSize)",layout="total, sizes, prev, pager, next, jumper",:total="parseInt(page.total)")

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
  each,
  merge,
  map,
  flatten,
  find
} from 'lodash'
import {
  tableListMixins
} from '@/common/mixins.js'

const statusList = [{
  name: '大搜车',
  value: 'DSC'
}, {
  name: '花生',
  value: 'HUASHENG'
}]

export default {
  mixins: [tableListMixins],
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
      assets: [{
        value: 'DSC',
        label: '大搜车'
      }, {
        value: 'HUASHENG',
        label: '花生好车'
      }],
      page: {
        total: 1000,
        sizes: [10, 20, 30, 40]
      },
      options: [{
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
    }
  },

  filters: {
    riskWarn(value) {
      if (value === 'NEW') {
        return '新预警'
      } else if (value === 'IGNORED') {
        return '已忽略'
      } else if (value === 'NOTIFIED') {
        return '已通知'
      } else if (value === 'PROCESSED') {
        return '已处理'
      } else {
        return '-'
      }
    },

    statusFormat(value) {
      const status = find(statusList, s => s.value === value)
      return status ? status.name : '-'
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

    riskQueryGet () {
      riskQuery.get({
        params: {
          ...pruneParams(this.filter)
        },
        loadingMaskTarget: '.risk-zr'
      }).then(res => {
        this.assetTypes = flatten(map(res.data.data, val => {
          return map(val.riskRules, val2 => val2.name)
        }))
      })
    },

    clearFilter() {
      each(this.filter, (v, k) => {
        if (k !== 'limit' && k !== 'page' && k !== 'pageSize') {
          this.filter[k] = ''
        }
      })
      this.search()
    },

    search() {
      this.$router.push({
        name: this.$router.name,
        query: pruneParams(this.filter)
      })
    },

    sizeChange(val) {
      this.filter.limit = val
      this.search()
    },

    currentChange(val) {
      this.filter.page = val
      this.search()
    }
  },
  watch: {
    $route() {
      this.risktemGet()
      this.riskQueryGet()
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
