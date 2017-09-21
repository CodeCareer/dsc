<template lang="pug">
  section.system-config-list
    .box
      .box-header
        h3 筛选条件
      .filters
        el-input(placeholder='配置编号', icon='search', @keyup.native.13="search", v-model.trim='filter.configNo')
        el-input(placeholder='配置名称', icon='search', @keyup.native.13="search", v-model.trim='filter.configName')
        el-button(size="small", type="primary", @click="search")  搜索
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table.no-wrap-cell(:max-height="maxHeight", :data='systemConfigData', style='width: 100%')
        el-table-column(prop='id', label='id', width='280')
        el-table-column(prop='configNo', label='配置编号', width='100')
        el-table-column(prop='configName', label='配置名称', width='200')
        el-table-column(prop='configValue', label='配置值', width='300')
        el-table-column(prop='allowOperateModify', label='是否允许修改', width='100')
          template(scope="scope")
            span(:class="scope.row.allowOperateModify | statusClass") {{scope.row.allowOperateModify | statusFormat}}
        el-table-column(prop='remark', label='备注', width='250')
        el-table-column(label='操作', fixed="right", width='100')
          template(scope="scope")
            .operations
              i.iconfont.icon-edit(v-if="scope.row.allowOperateModify === '1' && $permit('sysConfigUpdate')", @click="edit(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'

import {
  sysConfigList
} from '@/common/resource.js'

import {
  pruneParams
} from '@/common/util.js'

import {
  tableListMixins
} from '@/common/mixins.js'

const statusList = [{
  name: '是',
  value: '1'
}, {
  name: '否',
  value: '0'
}]

export default {
  mixins: [tableListMixins],
  filters: {
    statusClass(value) {
      const classMap = {
        '0': 'color-red',
        '1': 'color-green'
      }
      return classMap[value] || ''
    },
    statusFormat(value) {
      const status = find(statusList, s => s.value === value)
      return status ? status.name : '-'
    }
  },
  methods: {
    parseInt: window.parseInt,
    _fetchData() {
      sysConfigList.post(pruneParams(this.filter), {
        loadingMaskTarget: '.system-config-list'
      }).then(res => {
        const data = res.data.data
        this.systemConfigData = data.rows
        this.page.total = data.total
      })
    },

    edit(rows) {
      this.$router.push({
        name: 'systemConfigForm',
        params: rows
      })
    }
  },

  watch: {
    $route() {
      this._fetchData()
    }
  },

  created() {
    this.filter = merge(this.filter, this.$route.query)
    this._fetchData()
  },

  data() {
    return {
      pickerOptions: '',
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      systemConfigData: [],
      filter: {
        configNo: '',
        configName: '',
        page: 1,
        limit: 10
      }
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
