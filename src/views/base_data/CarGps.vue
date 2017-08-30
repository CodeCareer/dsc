<template lang="pug">
  section.car-gps
    .box
      .box-header
        h3 筛选条件
      .filters
        el-input(placeholder='VIN码', icon='search', @keyup.native.13='search()', v-model='filter.vinCode')
        //- el-input(placeholder='SIM码', icon='search', @keyup.native.13='search()', v-model='filter.simNo')
        el-select(placeholder="状态", v-model="filter.vehicleStatus", @change="search()")
          el-option(v-for="o in statusList", :value="o.value", :label="o.name", :key="o.value")
        el-date-picker(placeholder='起始时间', format='yyyy-MM-dd', type='date', :value="date.gpsTimeStart", @input="dateSearch($event, 'gpsTimeStart')", :picker-options="pickerOptions")
        el-date-picker(placeholder='结束时间', format='yyyy-MM-dd', type='date', :value='date.gpsTimeEnd', @input="dateSearch($event, 'gpsTimeEnd')", :picker-options="pickerOptions")
        el-button(size="small", type="primary", @click="search()")  搜索
        el-button(size="small", type="primary", @click="clearFilter")  清除
    .table-container
      el-table.no-wrap-cell(:data='carGps', style='width: 100%')
        el-table-column(prop='vinCode', label='VIN码', width='200')
        el-table-column(prop='acc', label='ACC', width='120')
          template(scope="scope")
            span {{scope.row.acc | accLocal}}
        //- el-table-column(prop='simNo', label='SIM码', width='200')
        el-table-column(prop='longitude', label='经度', width='150')
        el-table-column(prop='latitude', label='维度', width='150')
        el-table-column(prop='alarmInfo', label='报警信息', width='200')
          template(scope="scope")
            span {{scope.row.alarmInfo | ktNull('-')}}
        el-table-column(prop='direct', label='行驶方向', width='120')
        el-table-column(prop='plate', label='车牌号', width='120')
        el-table-column(prop='terminalNo', label='终端号', width='120')
        el-table-column(prop='terminalType', label='终端类型', width='200')
        el-table-column(prop='lastPower', label='剩余电量', width='120')
          template(scope="scope")
            span {{scope.row.lastPower | lastPowerLocal}}
        el-table-column(prop='travelDistance', label='总里程', width='120')
          template(scope="scope")
            span {{scope.row.travelDistance | ktKm}}
        el-table-column(prop='speed', label='速度', width='120')
          template(scope="scope")
            span {{scope.row.speed | ktAppend('km/h')}}
        el-table-column(prop='locationStyle', label='位置规格', width='120')
          template(scope="scope")
            span {{scope.row.locationStyle | locationStyleLocal}}
        el-table-column(prop='gpsTime', label='数据上报时间', width='200')
          template(scope="scope")
            span {{scope.row.gpsTime | moment('YYYY-MM-DD HH:mm:ss')}}
        el-table-column(prop='vehicleStatus', label='车辆状态', width='120')
          template(scope="scope")
            span(:class="scope.row.vehicleStatus | vehicleStatusClass") {{scope.row.vehicleStatus | vehicleStatusLocal}}
      el-pagination(@size-change='pageSizeChange', @current-change='pageChange', :current-page='parseInt(filter.page)', :page-sizes="page.sizes", :page-size="parseInt(filter.limit)", layout='total, prev, pager, next, jumper', :total='parseInt(page.total)')
</template>

<script>
import {
  merge,
  find
} from 'lodash'
import {
  carGps
} from '@/common/resource.js'
import {
  pruneParams
} from '@/common/util.js'
import {
  tableListMixins
} from '@/common/mixins.js'
import Vue from 'vue'

const statusList = [{
  name: '全部',
  value: '_all_'
}, {
  name: '未上线',
  value: '0'
}, {
  name: '行驶',
  value: '1'
}, {
  name: '停车',
  value: '2'
}, {
  name: '离线',
  value: '3'
}]

export default {
  mixins: [tableListMixins],
  filters: {
    lastPowerLocal(value) {
      if (value === -1) {
        return '充电中'
      } else {
        return Vue.filter('ktAppend')(value, '%')
      }
    },

    locationStyleLocal(value) {
      const map = {
        '-1': '不知道',
        0: '不定位',
        1: 'GPS定位',
        2: 'WIFI定位',
        3: '多基站',
        4: '单基站'
      }
      return map[value] || '未知状态'
    },

    accLocal(value) {
      const map = ['开', '关']
      return map[value] || '未知'
    },

    vehicleStatusLocal(value) {
      const status = find(statusList, s => s.value === value)
      return status ? status.name : '未知状态'
    },

    vehicleStatusClass(value) {
      const map = {
        0: 'color-gray',
        1: 'color-green',
        2: 'color-blue',
        3: 'color-gray'
      }
      return map[value] || ''
    }
  },

  methods: {
    _fetchData() {
      carGps.get({
        loadingMaskTarget: '.car-gps',
        params: {
          ...pruneParams(this.filter)
        }
      }).then(res => {
        const data = res.data.data
        this.carGps = data.rows
        this.page.total = data.total
      })
    }
  },

  watch: {
    $route() {
      this._fetchData()
    }
  },

  created() {
    merge(this.filter, this.$route.query)
    this._fetchData()
  },

  data() {
    return {
      fixed: window.innerWidth - 180 - 12 * 2 > 1150 ? false : 'right', // 180 左侧菜单宽度，12 section的padding
      pickerOptions: {},
      carGps: [],
      date: {
        gpsTimeEnd: '',
        gpsTimeStart: ''
      },
      statusList,
      filter: {
        vinCode: '',
        // simNo: '',
        vehicleStatus: '',
        gpsTimeStart: '',
        gpsTimeEnd: '',
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
