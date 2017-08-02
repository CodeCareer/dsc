<template lang="pug">
  section.risk-zr
    .box
      .filters
          el-input(placeholder='资产方', icon='search', @keyup.native.13="search", v-model='filter.assetFrom')
          el-input(placeholder='规则名', icon='search', @keyup.native.13="search", v-model='filter.name')
          el-select(v-model="filter.status",filterable,placeholder="状态")
            el-option(v-for="option in options",:value="option.value",:label="option.label")
          el-input(placeholder='对象ID', icon='search', @keyup.native.13="search", v-model='filter.subjectId')
          //- el-button(size="small", type="primary",@click="search") 查找
          el-button(size="small", type="primary",@click="clearFilter")  清除
    .risk-table.table-container
      el-table(:data="riskDatas")
        el-table-column(prop="assetFrom",label="资产方")
        el-table-column(prop="riskRuleId",label="规则ID")
        el-table-column(prop="name",label="规则名")
        el-table-column(prop="subjectId",label="对象ID")
        el-table-column(prop="status",label="当前状态")
        el-table-column(prop="updatedAt",label="时间")
        el-table-column(prop="description",label="详情")
      el-pagination(@size-change="sizeChange",@current-change="currentChange",:current-page="parseInt(filter.page)",:page-sizes="page.sizes",:page-size="parseInt(filter.pageSize)",layout="total, sizes, prev, pager, next, jumper",:total="parseInt(page.total)")

</template>

<script>
import {
  riskZr
} from '@/common/resource.js'
import {
  pruneParams
} from '@/common/util.js'
import {
  each
} from 'lodash'
export default{
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
        value: '通过',
        label: '通过'
      }, {
        value: '未通过',
        label: '未通过'
      }]
    }
  },
  methods: {
    risktemGet () {
      const loadingInstance = this.$loading({
        target: '.risk-zr'
      })
      riskZr.get({
        params: {
          ...pruneParams(this.filter)
        }
      }).then((res) => {
        const data = res.data
        this.riskDatas = data.rows
        this.page.total = data.total
        loadingInstance.close()
      }).catch((res) => {
      })
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
  mounted () {
    this.$router.push({
      name: this.$router.name,
      query: pruneParams(this.filter)
    })
    this.risktemGet()
  }
}
</script>

<style lang="scss">
  .icon-edit-delete{
    i{
      display: inline-block;
      font-size:13px;
      padding-right:10px;
      text-align: center;
    }
    .icon-delete:hover{
      cursor:pointer;
      color:#538cc0
    }
  }
</style>
