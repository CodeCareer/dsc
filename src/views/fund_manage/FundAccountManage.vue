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
        el-select(v-model="filter.accountUsages", placeholder="账户用途", @change="search")
          el-option(v-for="t in accountUsages", :key="t.name", :value="t.value", :label="t.name")
        el-select(v-model="filter.assetFrom", placeholder="资产来源", @change="search")
          el-option(v-for="t in assetFrom", :key="t.name", :value="t.value", :label="t.name")
        el-button(size="small", type="primary", @click="search")  搜索
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table.no-wrap-cell(:max-height="maxHeight", :data='fundAccount', style='width: 100%')
        el-table-column(prop='id', label='ID')
        el-table-column(prop='accountName', label='账户名称')
        el-table-column(prop='accountUsages', label='账户用途', width='100')
          template(scope="scope")
            span {{scope.row.accountUsages | statusFormat}}
        el-table-column(prop='assetFrom', label='资产来源', width='100')
          template(scope="scope")
            span {{scope.row.assetFrom | statusFormat}}
        el-table-column(prop='bankAccount', label='银行账号')
        el-table-column(prop='bankAccountName', label='银行账户名称')
        el-table-column(prop='bankName', label='银行名称')
        el-table-column(prop='coManagementAccount', label='是否共管账户')
          template(scope="scope")
            span {{scope.row.coManagementAccount | statusFormat}}
        el-table-column(prop='needUpdateAccountSerial', label='是否需要维护账户流水')
          template(scope="scope")
            span {{scope.row.needUpdateAccountSerial | statusFormat}}
        el-table-column(prop='remark', label='备注')
        el-table-column(label='操作')
          template(scope="scope")
            .operations
              i.iconfont.icon-edit(@click="edit(scope.row)")
              i.iconfont.icon-delete(@click="del(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total,  sizes, prev, pager, next, jumper', :total='parseInt(page.total)')
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
}, {
  name: '直接收取月租',
  value: 'INSTALMENT'
}, {
  name: '尾款',
  value: 'REST'
}, {
  name: '回购款',
  value: 'BUY_BACK'
}, {
  name: '月供转付',
  value: 'INSTALMENT_REMITTANCE'
}, {
  name: '月供垫付',
  value: 'INSTALMENT_ADVANCE'
}, {
  name: '差额补足',
  value: 'MAKE_UP_THE_BALANCE'
}, {
  name: '产品提前还款',
  value: 'PREPAYMENT'
}, {
  name: '是',
  value: 'YES'
}, {
  name: '否',
  value: 'NO'
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
        this.search()
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

  created() {
    this.filter = merge(this.filter, this.$route.query)
    this._fetchData()
  },

  data() {
    return {
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      fundAccount: [],
      filter: {
        accountUsages: '',
        assetFrom: '',
        accountName: '',
        page: 1,
        limit: 10
      },
      accountUsages: [{
        name: '直接收取月租',
        value: 'INSTALMENT'
      }, {
        name: '尾款',
        value: 'REST'
      }, {
        name: '回购款',
        value: 'BUY_BACK'
      }, {
        name: '月供转付',
        value: 'INSTALMENT_REMITTANCE'
      }, {
        name: '月供垫付',
        value: 'INSTALMENT_ADVANCE'
      }, {
        name: '差额补足',
        value: 'MAKE_UP_THE_BALANCE'
      }, {
        name: '产品提前还款',
        value: 'PREPAYMENT'
      }],
      assetFrom: [{
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
