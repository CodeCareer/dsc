<template lang="pug">
  section.fund-account-manage
    .box
      .box-header
        h3 筛选条件
        .buttons
          el-button(type="primary", size="small", @click="add()")
            i.iconfont.icon-add
            | 新增
      .filters
        el-input(placeholder='账户名称', icon='search', @keyup.native.13="search", v-model.trim='filter.accountName')
        el-select(v-model="filter.accountType", placeholder="账户类型", @change="search")
          el-option(v-for="t in assetTypes", :key="t.name", :value="t.value", :label="t.name")
        el-button(size="small", type="primary", @click="search")  搜索
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table(:data='fundAccount', style='width: 100%')
        el-table-column(prop='id', label='ID')
        el-table-column(prop='accountName', label='账户名称')
        el-table-column(prop='accountType', label='账户类型', width='80')
          template(scope="scope")
            span {{scope.row.accountType | statusFormat}}
        el-table-column(prop='remark', label='备注')
        el-table-column(label='操作')
          template(scope="scope")
            .operations
              i.iconfont.icon-edit(@click="edit(scope.row)")
              i.iconfont.icon-delete(@click="del(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'

import {
  fundAccountManage,
  fundAccountDelete
} from '@/common/resource.js'

import {
  pruneParams
} from '@/common/util.js'

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
  filters: {
    statusFormat(value) {
      const status = find(statusList, s => s.value === value)
      return status ? status.name : '未知类型'
    }
  },
  methods: {
    parseInt: window.parseInt,
    _fetchData() {
      fundAccountManage.post(pruneParams(this.filter), {
        loadingMaskTarget: '.fund-account-manage'
      }).then(res => {
        const data = res.data.data
        this.fundAccount = data.rows
        this.page.total = data.total
      })
    },

    del(rows) {
      this.$confirm('确定删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        fundAccountDelete.post({id: rows.id}, {
          loadingMaskTarget: '.fund-account-manage'
        }).then(res => {
          const data = res.data
          this.operationStatus(data)
        })
      }).catch(() => {})
    },

    edit(rows) {
      this.$router.push({
        name: 'fundAccountForm',
        params: rows
      })
    },

    add(rows) {
      this.$router.push({
        name: 'fundAccountForm',
        params: {
          id: 'add'
        }
      })
    },

    operationStatus(data) {
      if (data.resultCode === 'SUCCESS') {
        this.$message.success({
          message: data.resultMsg || '成功！'
        })
      } else {
        this.$message.error({
          message: data.resultMsg || '失败！'
        })
      }
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
      fundAccount: [],
      filter: {
        accountType: '',
        accountName: '',
        page: 1,
        limit: 10
      },
      assetTypes: [{
        name: '花生',
        value: 'HUASHENG'
      }, {
        name: '大搜车',
        value: 'DSC'
      }]
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
  .icon-relation {
    font-size: 15px;
  }
}
.box-tab-head{
  text-align: right;
    background: #f3f6f8;
    height: 40px;
    line-height: 40px;
    padding-right: 15px;
}
</style>
