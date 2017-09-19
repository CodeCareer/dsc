<template lang="pug">
  .asset-analyze
    .box
      .box-header
        h3 筛选条件
      .filters
        el-date-picker(placeholder="截止日期",:value="date.asOfDate",type="date",format="yyyy-MM-dd",@input="dateSearch($event, 'asOfDate')",:picker-options="pickerOptions")
        el-button(size="small", type="primary",@click="search") 搜索
        el-button(size="small", type="primary",@click="clearFilter")  清除
    section.age-section(v-if="$permit(['ageAnalyze'])")
      .asset-title
        h3.fl 年龄分析
        .table-chart.fr
          el-radio-group(v-model="tableChartStatus.ageTableVisible", @change= "val=> ageEchartResize(val, 'ageTableVisible')")
            el-radio-button.table(:label="true") 表
            el-radio-button.chart(:label="false") 图
          //- a.iconfont.icon-down.fr()
      .asset-table(v-if="tableChartStatus.ageTableVisible")
        el-table(:data="tables.ageTable")
          el-table-column(prop="ageSection",label="年龄区间")
            template(scope='scope')
              span {{scope.row.ageSection | ktNull}}
          el-table-column(prop="assetsCount",label="资产总笔数")
            template(scope="scope")
              span {{scope.row.assetsCount | ktNull}}
          el-table-column(prop="assetsBalance",label="资产余额")
            template(scope="scope")
              span {{scope.row.assetsBalance | ktNull | ktThousand}}
          el-table-column(prop="rateBalance",label="余额占比")
            template(scope="scope")
              span {{scope.row.rateBalance | ktNull}}
      .asset-chart(v-if="!tableChartStatus.ageTableVisible")
        bar-chart(:chart-option="ageChartOption",ref="ageChart")
    section.car-section(v-if="$permit(['carAnalyze'])")
      .asset-title
        h3.fl 汽车品牌分析
        .table-chart.fr
          el-radio-group(v-model="tableChartStatus.carTableVisible", @change='val => carEchartResize(val, "carTableVisible")')
            el-radio-button.table(:label="true") 表
            el-radio-button.chart(:label="false") 图
          //- a.iconfont.icon-down.fr()
      .asset-table(v-if="tableChartStatus.carTableVisible")
        el-table(:data="tables.carTable")
          el-table-column(prop="brandName",label="品牌")
            template(scope="scope")
              span {{scope.row.brandName | ktNull}}
          el-table-column(prop="assetsCount",label="资产总笔数")
            template(scope="scope")
              span {{scope.row.assetsCount | ktNull}}
          el-table-column(prop="assetsBalance",label="资产余额")
            template(scope="scope")
              span {{scope.row.assetsBalance | ktNull | ktThousand}}
          el-table-column(prop="rateBalance",label="余额占比")
            template(scope="scope")
              span {{scope.row.rateBalance | ktNull}}
      .asset-chart(v-if="!tableChartStatus.carTableVisible")
        bar-chart(:chart-option="carChartOption", ref="carChart")
    section.city-section(v-if="$permit(['cityAnalyze'])")
      .asset-title
        h3.fl 城市分布
        .table-chart.fr
          el-radio-group(v-model="tableChartStatus.cityTableVisible", @change='val => cityEchartResize(val, "cityTableVisible")')
            el-radio-button.table(:label="true") 表
            el-radio-button.chart(:label="false") 图
          //- a.iconfont.icon-down.fr()
      .asset-table(v-if="tableChartStatus.cityTableVisible")
        el-table(:data="tables.cityTable")
          el-table-column(prop="province",label="城市")
            template(scope="scope")
              span {{scope.row.province | ktNull}}
          el-table-column(prop="assetsCount",label="资产总笔数")
            template(scope="scope")
              span {{scope.row.assetsCount | ktNull}}
          el-table-column(prop="assetsBalance",label="资产余额")
            template(scope="scope")
              span {{scope.row.assetsBalance | ktNull | ktThousand}}
          el-table-column(prop="rateBalance",label="余额占比")
            template(scope="scope")
              span {{scope.row.rateBalance | ktNull}}
      .asset-chart(v-if="!tableChartStatus.cityTableVisible")
        bar-chart(:chart-option="cityChartOption", ref="cityChart")
    section.pay-section(v-if="$permit(['payAnalyze'])")
      .asset-title
        h3.fl 首付比例分布
        .table-chart.fr
          el-radio-group(v-model="tableChartStatus.paymentTableVisible", @change='val => payEchartResize(val, "paymentTableVisible")')
            el-radio-button.table(:label="true") 表
            el-radio-button.chart(:label="false") 图
          //- a.iconfont.icon-down.fr()
      .asset-table(v-if="tableChartStatus.paymentTableVisible")
        el-table(:data="tables.payTable")
          el-table-column(prop="downPaymentsPercent",label="首付比例")
            template(scope="scope")
              span {{scope.row.downPaymentsPercent | ktNull}}
          el-table-column(prop="assetsCount",label="资产总笔数")
            template(scope="scope")
              span {{scope.row.assetsCount | ktNull}}
          el-table-column(prop="assetsBalance",label="资产余额")
            template(scope="scope")
              span {{scope.row.assetsBalance | ktNull | ktThousand}}
          el-table-column(prop="rateBalance",label="余额占比")
            template(scope="scope")
              span {{scope.row.rateBalance | ktNull}}
      .asset-chart(v-if="!tableChartStatus.paymentTableVisible")
        bar-chart(:chart-option="payChartOption", ref="payChart")
    section.asset-section(v-if="$permit(['assetAnalyze'])")
      .asset-title
        h3.fl 资产余额分布
        .table-chart.fr
          el-radio-group(v-model="tableChartStatus.assetTableVisible", @change='val => assetEchartResize(val, "assetTableVisible")')
            el-radio-button.table(:label="true") 表
            el-radio-button.chart(:label="false") 图
          //- a.iconfont.icon-down.fr()
      .asset-table(v-show="tableChartStatus.assetTableVisible")
        el-table(:data="tables.assetTable")
          el-table-column(prop="assetBalance",label="余额范围")
            template(scope="scope")
              span {{scope.row.assetBalance | ktNull}}
          el-table-column(prop="assetsCount",label="资产总笔数")
            template(scope="scope")
              span {{scope.row.assetsCount | ktNull}}
          el-table-column(prop="assetsBalance",label="资产余额")
            template(scope="scope")
              span {{scope.row.assetsBalance | ktNull | ktThousand}}
          el-table-column(prop="rateBalance",label="余额占比")
            template(scope="scope")
              span {{scope.row.rateBalance | ktNull}}
      .asset-chart(v-show="!tableChartStatus.assetTableVisible")
        bar-chart(:chart-option="assetChartOption", ref="assetChart")
</template>

<script>
import {
  ageAnalyze,
  carAnalyze,
  cityAnalyze,
  payAnalyze,
  assetAnalyze
} from '@/common/resource.js'

import {
  pruneParams
} from '@/common/util.js'

import numeral from 'numeral'

import {
  mergeWith,
  map,
  merge,
  isNumber,
  round,
  isArray
} from 'lodash'

import {
  tableListMixins
} from '@/common/mixins.js'

import moment from 'moment'

import barChart from '@/components/BarEchart.vue'

// import Vue from 'vue'

export default {
  components: {
    barChart
  },
  mixins: [tableListMixins],
  data() {
    return {
      ageChartOption: {
        title: {
          text: '年龄分布'
        }
      },
      carChartOption: {
        title: {
          text: '汽车品牌分布'
        }
      },
      cityChartOption: {
        title: {
          text: '城市分布'
        }
      },
      payChartOption: {
        title: {
          text: '首付比例分布'
        }
      },
      assetChartOption: {
        title: {
          text: '资产余额分布'
        }
      },
      date: {
        asOfDate: moment((new Date().getTime() - 86400000)).format('YYYY-MM-DD')
      },
      filter: {
        asOfDate: moment(new Date().getTime() - 86400000).format('YYYYMMDD')
      },
      pickerOptions: {},
      tableChartStatus: {
        ageTableVisible: true,
        carTableVisible: true,
        cityTableVisible: true,
        paymentTableVisible: true,
        assetTableVisible: true
      },
      tables: {
        ageTable: [],
        carTable: [],
        cityTable: [],
        paymentTable: [],
        assetTable: []
      }
    }
  },

  filters: {
    filterThousand(value) {
      if (isNumber(value)) {
        return numeral(round(value / 10000)).format('0,0')
      }
      return value || '-'
    }
  },

  methods: {
    ageEchartResize(val, val2) {
      this.tableChartStatus[val2] = val
      if (val === false) {
        this.$nextTick(() => {
          this.$refs.ageChart.echart.resize()
        })
      }
    },

    carEchartResize(val, val2) {
      this.tableChartStatus[val2] = val
      if (val === false) {
        this.$nextTick(() => {
          this.$refs.carChart.echart.resize()
        })
      }
    },

    cityEchartResize(val, val2) {
      this.tableChartStatus[val2] = val
      if (val === false) {
        this.$nextTick(() => {
          this.$refs.cityChart.echart.resize()
        })
      }
    },

    payEchartResize(val, val2) {
      this.tableChartStatus[val2] = val
      if (val === false) {
        this.$nextTick(() => {
          this.$refs.payChart.echart.resize()
        })
      }
    },

    assetEchartResize(val, val2) {
      this.tableChartStatus[val2] = val
      if (val === false) {
        this.$nextTick(() => {
          this.$refs.assetChart.echart.resize()
        })
      }
    },

    getAgeAnalyze() {
      ageAnalyze.post({
        ...pruneParams(this.filter)
      }, {
        loadingMaskTarget: '.age-section'
      }).then(res => {
        this.tables.ageTable = res.data.data.rows
        this.ageChartOption = mergeWith({}, this.ageChartOption, {
          legend: {
            data: ['资产余额', '资产总笔数']
          },
          xAxis: {
            data: map(this.tables.ageTable, v => v.ageSection)
          },
          yAxis: [{
            axisLabel: {
              formatter: (value) => {
                return this.$options.filters.filterThousand(value)
              }
            }
          }],
          allData: this.tables.ageTable,
          series: [{
            name: '资产余额',
            type: 'bar',
            data: map(this.tables.ageTable, v => v.assetsBalance),
            barMaxWidth: 40,
            yAxisIndex: 0
          }, {
            name: '资产总笔数',
            type: 'line',
            yAxisIndex: 1,
            data: map(this.tables.ageTable, v => v.assetsCount)
          }]
        }, (oldOpt, newOpt) => {
          if (isArray(newOpt)) {
            return newOpt
          }
        })
      })
    },

    getCarAnalyze() {
      carAnalyze.post({
        ...pruneParams(this.filter)
      }, {
        loadingMaskTarget: '.car-section'
      }).then(res => {
        this.tables.carTable = res.data.data.rows
        this.carChartOption = mergeWith({}, this.carChartOption, {
          legend: {
            data: ['资产余额', '资产总笔数']
          },
          allData: this.tables.carTable,
          xAxis: {
            data: map(this.tables.carTable, v => v.brandName)
          },
          yAxis: [{
            axisLabel: {
              formatter: (value) => {
                return this.$options.filters.filterThousand(value)
              }
            }
          }],
          series: [{
            name: '资产余额',
            type: 'bar',
            data: map(this.tables.carTable, v => v.assetsBalance),
            barMaxWidth: 40,
            yAxisIndex: 0
          }, {
            name: '资产总笔数',
            type: 'line',
            yAxisIndex: 1,
            data: map(this.tables.carTable, v => v.assetsCount)
          }]
        }, (oldOpt, newOpt) => {
          if (isArray(newOpt)) {
            return newOpt
          }
        })
      })
    },

    getCityAnalyze() {
      cityAnalyze.post({
        ...pruneParams(this.filter)
      }, {
        loadingMaskTarget: '.city-section'
      }).then(res => {
        this.tables.cityTable = res.data.data.rows
        this.cityChartOption = mergeWith({}, this.cityChartOption, {
          legend: {
            data: ['资产余额', '资产总笔数']
          },
          allData: this.tables.cityTable,
          xAxis: {
            data: map(this.tables.cityTable, v => v.province)
          },
          yAxis: [{
            axisLabel: {
              formatter: (value) => {
                return this.$options.filters.filterThousand(value)
              }
            }
          }],
          series: [{
            name: '资产余额',
            type: 'bar',
            data: map(this.tables.cityTable, v => v.assetsBalance),
            yAxisIndex: 0,
            barMaxWidth: 40
          }, {
            name: '资产总笔数',
            type: 'line',
            yAxisIndex: 1,
            data: map(this.tables.cityTable, v => v.assetsCount)
          }]
        }, (oldOpt, newOpt) => {
          if (isArray(newOpt)) {
            return newOpt
          }
        })
      })
    },

    getPayAnalyze() {
      payAnalyze.post({
        ...pruneParams(this.filter)
      }, {
        loadingMaskTarget: '.pay-section'
      }).then(res => {
        this.tables.payTable = res.data.data.rows
        this.payChartOption = mergeWith({}, this.payChartOption, {
          legend: {
            data: ['资产余额', '资产总笔数']
          },
          xAxis: {
            data: map(this.tables.payTable, v => v.downPaymentsPercent)
          },
          yAxis: [{
            axisLabel: {
              formatter: (value) => {
                return this.$options.filters.filterThousand(value)
              }
            }
          }],
          allData: this.tables.payTable,
          series: [{
            name: '资产余额',
            type: 'bar',
            data: map(this.tables.payTable, v => v.assetsBalance),
            barMaxWidth: 40,
            yAxisIndex: 0
          }, {
            name: '资产总笔数',
            type: 'line',
            yAxisIndex: 1,
            data: map(this.tables.payTable, v => v.assetsCount)
          }]
        }, (oldOpt, newOpt) => {
          if (isArray(newOpt)) {
            return newOpt
          }
        })
      })
    },

    getAssetAnalyze() {
      assetAnalyze.post({
        ...pruneParams(this.filter)
      }, {
        loadingMaskTarget: '.asset-section'
      }).then(res => {
        this.tables.assetTable = res.data.data.rows
        this.assetChartOption = mergeWith({}, this.assetChartOption, {
          legend: {
            data: ['资产余额', '资产总笔数']
          },
          xAxis: {
            data: map(this.tables.assetTable, v => v.assetBalance)
          },
          yAxis: [{
            axisLabel: {
              formatter: (value) => {
                return this.$options.filters.filterThousand(value)
              }
            }
          }],
          allData: this.tables.assetTable,
          series: [{
            name: '资产余额',
            type: 'bar',
            data: map(this.tables.assetTable, v => v.assetsBalance),
            barMaxWidth: 40,
            yAxisIndex: 0
          }, {
            name: '资产总笔数',
            type: 'line',
            yAxisIndex: 1,
            data: map(this.tables.assetTable, v => v.assetsCount)
          }]
        }, (oldOpt, newOpt) => {
          if (isArray(newOpt)) {
            return newOpt
          }
        })
      })
    }
  },

  watch: {
    $route() {
      this.getAgeAnalyze()
      this.getCarAnalyze()
      this.getCityAnalyze()
      this.getPayAnalyze()
      this.getAssetAnalyze()
    }
  },

  created() {
    this.filter = merge(this.filter, this.$route.query)
    this.getAgeAnalyze()
    this.getCarAnalyze()
    this.getCityAnalyze()
    this.getPayAnalyze()
    this.getAssetAnalyze()
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
