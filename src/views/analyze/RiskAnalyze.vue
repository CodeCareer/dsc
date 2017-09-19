<template lang="pug">
  .asset-analyze
    .box
      .box-header
        h3 筛选条件
      .filters
        el-date-picker(placeholder="开始日期",:value="date.startOfDate",type="month",format="yyyy-MM",@input="riskDateSearch($event, 'startOfDate')",:picker-options="pickerOptions")
        el-date-picker(placeholder="结束日期",:value="date.asOfDate",type="month",format="yyyy-MM",@input="riskDateSearch($event, 'asOfDate')",:picker-options="pickerOptions")
        el-button(size="small", type="primary",@click="search") 搜索
        el-button(size="small", type="primary",@click="clearFilter")  清除
    section.overdue-section(v-if="$permit(['riskOverdue'])")
      .asset-title
        h3.fl 逾期率趋势
        .table-chart.fr
          el-radio-group(v-model="tableChartStatus.overDueTableVisible", @change="val=> overDueEchartResize(val, 'overDueTableVisible')")
            el-radio-button.table(:label="true") 表
            el-radio-button.chart(:label="false") 图
          //- a.iconfont.icon-down.fr()
      .asset-table(v-if="tableChartStatus.overDueTableVisible")
        el-table(:data="tables.overDue.data")
          el-table-column(prop="status",label="逾期")
          el-table-column(:prop="date", :label="date",v-for="date in tables.overDue.dates", :key="date")
            template(scope="scope")
              span {{scope.row[date] | filterRate(scope.row.status)}}
      .asset-chart(v-if="!tableChartStatus.overDueTableVisible")
        line-echart(:chart-option="overDueChartOption", ref="overDueEchart")
    section.migrate-section(v-if="$permit(['riskMigrateRate'])")
      .asset-title
        h3.fl 迁徙率分析
        .table-chart.fr
          el-radio-group(v-model="tableChartStatus.migrateTableVisible", @change="val=> migrateEchartResize(val, 'migrateTableVisible')")
            el-radio-button.table(:label="true") 表
            el-radio-button.chart(:label="false") 图
          //- a.iconfont.icon-down.fr()
      .asset-table(v-if="tableChartStatus.migrateTableVisible")
        el-table(:data="tables.migrate.data")
          el-table-column(prop="status",label="逾期")
          el-table-column(:prop="date", :label="date",v-for="date in tables.migrate.dates", :key="date")
            template(scope="scope")
              span {{scope.row[date] | ktPercent | filterNull}}
      .asset-chart(v-if="!tableChartStatus.migrateTableVisible")
        line-echart(:chart-option="migrateChartOption", ref="migrateEchart")
    section.vintage-section(v-if="$permit(['riskVintage'])")
      .asset-title
        h3.fl Vintage分析
        .table-chart.fr
          el-radio-group(v-model="tableChartStatus.vintageTableVisible", @change="val=> vintageEchartResize(val, 'vintageTableVisible')")
            el-radio-button.table(:label="true") 表
            el-radio-button.chart(:label="false") 图
          //- a.iconfont.icon-down.fr()
      .asset-table(v-if="tableChartStatus.vintageTableVisible")
        el-table(:data="tables.vintage.data")
          el-table-column(prop="status",label="Vintage")
          el-table-column(:prop="date", :label="date + '\\n' + '逾期率(%)'",v-for="date in tables.vintage.dates", :key="date")
            template(scope="scope")
              span {{scope.row[date] | ktPercent | filterNull}}
      .asset-chart(v-if="!tableChartStatus.vintageTableVisible")
        line-echart(:chart-option="vintageChartOption", ref="vintageEchart")
</template>

<script>
import {
  riskOverdue,
  riskMigrateRate,
  riskVintage
} from '@/common/resource.js'
import {
  mergeWith,
  map,
  each,
  merge,
  isNumber,
  round,
  isNull,
  isArray
} from 'lodash'
import {
  pruneParams
} from '@/common/util.js'
import {
  tableListMixins
} from '@/common/mixins.js'

import Vue from 'vue'
import moment from 'moment'
import LineEchart from '@/components/LineEchart.vue'

export default {
  components: {
    LineEchart
  },
  mixins: [tableListMixins],
  data() {
    return {
      overDueChartOption: {},
      migrateChartOption: {},
      vintageChartOption: {},
      date: {
        startOfDate: moment().subtract(6, 'month').format('YYYY-MM'),
        asOfDate: moment().subtract(1, 'month').format('YYYY-MM')
      },
      filter: {
        startOfDate: moment().subtract(6, 'month').format('YYYYMM'),
        asOfDate: moment().subtract(1, 'month').format('YYYYMM')
      },
      pickerOptions: {},
      tableChartStatus: {
        overDueTableVisible: true,
        migrateTableVisible: true,
        vintageTableVisible: true
      },
      tables: {
        overDue: {
          dates: [],
          data: []
        },
        migrate: {
          dates: [],
          data: []
        },
        vintage: {
          dates: [],
          data: []
        }
      },
      charts: {
        overDue: [],
        migrate: [],
        vintage: []
      }
    }
  },

  methods: {
    riskDateSearch(value, key) {
      this.filter[key] = value ? moment(value).format('YYYYMM') : ''
      this.date[key] = value ? moment(value).format('YYYY-MM') : ''
      this.search()
    },

    overDueEchartResize(val, val2) {
      this.tableChartStatus[val2] = val
      if (val === false) {
        this.$nextTick(() => {
          this.$refs.overDueEchart.echart.resize()
        })
      }
    },

    migrateEchartResize(val, val2) {
      this.tableChartStatus[val2] = val
      if (val === false) {
        this.$nextTick(() => {
          this.$refs.migrateEchart.echart.resize()
        })
      }
    },

    vintageEchartResize(val, val2) {
      this.tableChartStatus[val2] = val
      if (val === false) {
        this.$nextTick(() => {
          this.$refs.vintageEchart.echart.resize()
        })
      }
    },

    getRiskOverdue() {
      riskOverdue.post({
        ...pruneParams(this.filter)
      }, {
        loadingMaskTarget: '.overdue-section'
      }).then(res => {
        const datas = res.data.data
        this.customData(datas, 'overDue')
        this.customChartData(datas, 'overDue')
        this.overDueChartOption = mergeWith({}, this.overDueChartOption, {
          title: {
            text: '逾期率报表'
          },
          xAxis: {
            // axisLabel: {
            //   formatter: value => {
            //     return
            //   }
            // },
            data: datas.labelDate
          },
          yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: (value) => {
                return Vue.filter('ktPercent')(value)
              }
            }
          },
          legend: {
            data: datas.status.slice(0, -2)
          },
          series: map(datas.status.slice(0, -2), (stat, index) => {
            return {
              name: stat,
              // symbol: 'none',
              smooth: true,
              type: 'line',
              data: this.charts.overDue[index]
            }
          })
        }, (oldOpt, newOpt) => {
          if (isArray(newOpt)) {
            return newOpt
          }
        })
      })
    },

    getRiskMigrateTable() {
      riskMigrateRate.post({
        ...pruneParams(this.filter)
      }, {
        loadingMaskTarget: '.migrate-section'
      }).then(res => {
        const datas = res.data.data
        this.customData(datas, 'migrate')
        this.customChartData(datas, 'migrate')
        this.migrateChartOption = mergeWith({}, this.migrateChartOption, {
          title: {
            text: 'migrate分析'
          },
          xAxis: {
            data: datas.labelDate
          },
          yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: (value) => {
                return Vue.filter('ktPercent')(value)
              }
            }
          },
          legend: {
            data: datas.status
          },
          series: map(datas.status, (stat, index) => {
            return {
              name: stat,
              // symbol: 'none',
              smooth: true,
              type: 'line',
              data: this.charts.migrate[index]
            }
          })
        }, (oldOpt, newOpt) => {
          if (isArray(newOpt)) {
            return newOpt
          }
        })
      })
    },

    getRiskVintageTable() {
      riskVintage.post({
        ...pruneParams(this.filter)
      }, {
        loadingMaskTarget: '.vintage-section'
      }).then(res => {
        const datas = res.data.data
        this.customData(datas, 'vintage')
        this.customChartData(datas, 'vintage')
        this.vintageChartOption = mergeWith({}, this.vintageChartOption, {
          title: {
            text: 'Vintage分析'
          },
          xAxis: {
            data: map(datas.labelDate, stat => {
              return stat + '\n' + '逾期率(%)'
            })
          },
          yAxis: {
            type: 'value',
            scale: true,
            axisLabel: {
              formatter: (value) => {
                return Vue.filter('ktPercent')(value)
              }
            }
          },
          legend: {
            data: datas.status
          },
          series: map(datas.status, (stat, index) => {
            return {
              name: stat,
              // symbol: 'none',
              smooth: true,
              type: 'line',
              data: this.charts.vintage[index]
            }
          })
        }, (oldOpt, newOpt) => {
          if (isArray(newOpt)) {
            return newOpt
          }
        })
      })
    },

    customData(data, chart) {
      this.tables[chart].dates = data.labelDate
      const dataArr = []
      for (let stat of data.status) {
        let obj = {}
        obj.status = stat
        for (let date of data.labelDate) {
          obj[date] = data.tableData[date][stat]
        }
        dataArr.push(obj)
      }
      this.tables[chart].data = dataArr
    },

    customChartData(data, chart) {
      const dataArr = []
      this.charts[chart] = each(data.status, stat => {
        dataArr.push(map(data.labelDate, date => {
          return data.tableData[date][stat] || 0
        }))
      })
      this.charts[chart] = dataArr
    }

  },

  filters: {
    filterRate(val, val2, decimal = 2, multi = 100, unit = '%') {
      return (isNumber(val) && val2.indexOf('资产') < 0) ? round(val * multi, decimal).toFixed(decimal) + (unit || '') : Vue.filter('ktThousand')(val)
    },
    filterNull(val) {
      return (!isNull(val) && val !== 'undefined' && val !== '') ? val : '-'
    }
  },

  watch: {
    $route() {
      this.getRiskOverdue()
      this.getRiskMigrateTable()
      this.getRiskVintageTable()
    }
  },

  created() {
    this.filter = merge(this.filter, this.$route.query)
    this.getRiskOverdue()
    this.getRiskMigrateTable()
    this.getRiskVintageTable()
  }
}
</script>

<style lang="scss">
section {
  margin: 30px 0;
  .asset-title {
    border: 1px solid #e7eaed;
    border-bottom: none;
    height: 40px;
    line-height: 40px;
    background: #f3f6f8;
    border-radius: 4px 4px 0 0;
    padding: 0 15px;
  }
  h3 {
    font-weight: bold;
    font-size: 13px;
    color: #595f67;
    line-height: 40px;
  }
  .table-chart {
    .icon-down {
      margin-left: 15px;
      &:hover {
        color: #20a0ff;
      }
    }
  }
  .asset-chart {
    border: 1px solid #e7eaed;
  }
}
</style>
