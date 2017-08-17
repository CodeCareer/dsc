<template lang="pug">
  section.risk-zr
    .box
      .box-header
        h3 筛选条件
      .filters
          el-input(placeholder='资产方', icon='search', @keyup.native.13="search", v-model='filter.assetFrom')
          el-input(placeholder='预警名称', icon='search', @keyup.native.13="search", v-model='filter.name')
          el-select(v-model="filter.status",filterable,placeholder="状态",@change="search",)
            el-option(v-for="option in options",:key="option.value",:value="option.value",:label="option.label")
          el-input(placeholder='预警对象ID', icon='search', @keyup.native.13="search", v-model='filter.subjectId')
          el-button(size="small", type="primary",@click="search") 搜索
          el-button(size="small", type="primary",@click="clearFilter")  清除
    .risk-table.table-container
      el-table(:data="riskDatas")
        el-table-column(label="资产方")
          template(scope="scope")
            span {{scope.row.assetFrom | ktNull}}
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
            span {{scope.row.createdAt | moment}}
        el-table-column(label="预警更新时间",width="150")
          template(scope="scope")
            span {{scope.row.updatedAt | moment}}
        el-table-column(label="详情",width="500")
          template(scope="scope")
            span {{scope.row.description | ktNull}}
      el-pagination(@size-change="sizeChange",@current-change="currentChange",:current-page="parseInt(filter.page)",:page-sizes="page.sizes",:page-size="parseInt(filter.pageSize)",layout="total, sizes, prev, pager, next, jumper",:total="parseInt(page.total)")

</template>

<script>
import {
  riskWarn
} from '@/common/resource.js'
import {
  pruneParams
} from '@/common/util.js'
import {
  each
} from 'lodash'
export default {
  data() {
    return {
      riskDatas: [],
      filter: {
        assetFrom: '',
        name: '',
        page: 1,
        limit: 10,
        status: '',
        subjectId: ''
      },
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

    clearFilter() {
      each(this.filter, (v, k) => {
        if (k !== 'page' && k !== 'pageSize') {
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
    }
  },
  mounted() {
    this.risktemGet()
  }
}
</script>

<style lang="scss">
// .icon-edit-delete {
//   i {
//     display: inline-block;
//     font-size: 13px;
//     padding-right: 10px;
//     text-align: center;
//   }
//   .icon-delete:hover {
//     cursor: pointer;
//     color: #538cc0
//   }
// }
.risk-table{
    .el-table{
      .cell{
        white-space: normal!important;
      }
    }
  }
</style>
