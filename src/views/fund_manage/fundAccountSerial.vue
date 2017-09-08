<template lang="pug">
  section.fund-account-serial
    .box
      .box-header
        h3 筛选条件
        .buttons
          el-button(type="primary", size="small", @click="upload()")
            i.iconfont.icon-add
            | 导入Excel
          el-button(type="primary", size="small", @click="add()")
            i.iconfont.icon-add
            | 新增
      .filters
        .filter-line
          el-input(placeholder='账户ID', icon='search', @keyup.native.13="search", v-model.trim='filter.fundAccountId')
          el-date-picker(placeholder='发生时间下限', type='date', format='yyyy-MM-dd', :value='date.occurDatetimeLower', @input="handleDateLower", :picker-options="pickerOptionsLower")
          el-date-picker(placeholder='发生时间上限', type='date', format='yyyy-MM-dd', :value='date.occurDatetimeUpper', @input="handleDatetUpper", :picker-options="pickerOptionsUpper")
        .filter-line
          el-select(v-model="filter.needSystemOperate", placeholder="请选择是否需要对账" @change="search")
            el-option(v-for="t in needSystemOperateList", :key="t.name", :value="t.value", :label="t.name")
          el-select(v-model="filter.fundSerialStatus", placeholder="对账状态" @change="search")
            el-option(v-for="t in fundSerialStatusList", :key="t.name", :value="t.value", :label="t.name")
          el-button(size="small", type="primary", @click="search")  搜索
          el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table.no-wrap-cell(:data='fundAccountSerial', style='width: 100%')
        el-table-column(prop='fundAccountId', label='资金账户Id' width="240")
        el-table-column(prop='accountBalance', label='账户余额' width="120")
        el-table-column(prop='occurAmount', label='发生金额' width="120")
        el-table-column(prop='fundDirection', label='资金方向')
          template(scope="scope")
            span {{scope.row.fundDirection | statusFormat}}
        el-table-column(prop='fundSerialStatus', label='对账状态' width="110")
          template(scope="scope")
            span {{scope.row.fundSerialStatus | statusFormat}}
        el-table-column(prop='occurDatetime', label='发生时间' width="150")
          template(scope="scope")
            span {{scope.row.occurDatetime | moment('YYYY-MM-DD HH:mm:ss')}}
        el-table-column(prop='needSystemOperate', label='是否需要对账' width="130")
          template(scope="scope")
            span {{scope.row.needSystemOperate | statusFormat}}
        el-table-column(prop='inputType', label='录入方式')
          template(scope="scope")
            span {{scope.row.inputType | statusFormat}}
        el-table-column(prop='inputUserId', label='录入人用户id' width="240")
        el-table-column(prop='createDatetime', label='创建时间' width="150")
          template(scope="scope")
            span {{scope.row.createDatetime | moment('YYYY-MM-DD HH:mm:ss')}}
        el-table-column(prop='remark', label='备注' width="300")
        el-table-column(label='操作', fixed="right")
          template(scope="scope")
            .operations
              i.iconfont.icon-delete(@click="del(scope.row)")
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'

import {
  fundAccountSerial,
  fundAccountSerialDelete
} from '@/common/resource.js'

import {
  pruneParams
} from '@/common/util.js'

import {
  tableListMixins
} from '@/common/mixins.js'
import moment from 'moment'
import Vue from 'vue'

const statusList = [{
  name: '是',
  value: 'YES'
}, {
  name: '否',
  value: 'NO'
}, {
  name: '入',
  value: 'IN'
}, {
  name: '出',
  value: 'OUT'
}, {
  name: '已录入',
  value: 'INPUT'
}, {
  name: '已对账',
  value: 'CHECKED'
}, {
  name: 'EXCEL',
  value: 'EXCEL导入'
}, {
  name: 'MANUALLY',
  value: '手动录入'
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
    handleDateLower(value) {
      this.filter.occurDatetimeLower = value ? moment(value).format('YYYY-MM-DD') + ' 00:00:00' : ''
      this.date.occurDatetimeLower = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    handleDatetUpper(value) {
      this.filter.occurDatetimeUpper = value ? moment(value).format('YYYY-MM-DD') + ' 23:59:59' : ''
      this.date.occurDatetimeUpper = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },
    parseInt: window.parseInt,
    _fetchData() {
      fundAccountSerial.post(pruneParams(this.filter), {
        loadingMaskTarget: '.fund-account-serial'
      }).then(res => {
        const data = res.data.data
        this.fundAccountSerial = data.rows
        this.page.total = data.total
      })
    },

    del(rows) {
      this.$confirm('确定删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        fundAccountSerialDelete.post({id: rows.id}, {
          loadingMaskTarget: '.fund-account-serial'
        }).then(res => {
          const data = res.data
          this.operationStatus(data)
        })
      }).catch(() => {})
    },

    upload() {
      this.$router.push({
        name: 'fundAccountSerialUpload'
      })
    },

    add() {
      this.$router.push({
        name: 'fundAccountSerialForm',
        params: {
          uuid: 'add'
        }
      })
    },

    operationStatus(data) {
      if (data.resultCode === 'SUCCESS') {
        this.$message.success({
          message: data.resultMsg || '成功！'
        })
        this.search()
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
    const { occurDatetimeLower, occurDatetimeUpper } = this.$route.query
    this.date.occurDatetimeLower = occurDatetimeLower ? Vue.filter('moment')(occurDatetimeLower, 'YYYY-MM-DD') : ''
    this.date.occurDatetimeUpper = occurDatetimeUpper ? Vue.filter('moment')(occurDatetimeUpper, 'YYYY-MM-DD') : ''
    this._fetchData()
  },

  data() {
    return {
      pickerOptionsLower: {
        disabledDate: date => {
          return this.date.occurDatetimeUpper && Vue.filter('moment')(date, 'YYYY-MM-DD') > Vue.filter('moment')(this.date.occurDatetimeUpper, 'YYYY-MM-DD')
        }
      },
      pickerOptionsUpper: {
        disabledDate: date => {
          return Vue.filter('moment')(date, 'YYYY-MM-DD') < Vue.filter('moment')(this.date.occurDatetimeLower, 'YYYY-MM-DD')
        }
      },
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      fundAccountSerial: [],
      needSystemOperateList: [{
        name: '是',
        value: 'YES'
      }, {
        name: '否',
        value: 'NO'
      }],
      fundSerialStatusList: [{
        name: '已录入',
        value: 'INPUT'
      }, {
        name: '已对账',
        value: 'CHECKED'
      }],
      date: {
        occurDatetimeLower: '',
        occurDatetimeUpper: ''
      },
      filter: {
        fundAccountId: '',
        needSystemOperate: '',
        fundSerialStatus: '',
        occurDatetimeLower: '',
        occurDatetimeUpper: '',
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
