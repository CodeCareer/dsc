<template lang="pug">
  .bar-echart(ref="barEchart")
</template>

<script>
import echarts from 'echarts/lib/echarts'
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/model/Series.js')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
require('echarts/lib/component/grid')
require('echarts/lib/component/axis')
import {
  merge,
  concat
  // map
} from 'lodash'

import Vue from 'vue'

export default {
  props: ['chartOption'],
  data() {
    return {
      echart: null
    }
  },
  mounted() {
    const echart = this.echart = echarts.init(this.$refs.barEchart)
    var option = {
      title: {
        show: true,
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 15
        }
      },
      legend: {
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 20,
        top: 'bottom',
        textStyle: {
          color: '#262c38',
          fontSize: 12
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params, ticket, callback) => {
          const echartData = echart.getOption().allData
          if (!params.length) return
          return concat([`<table class="chart-tooltip"><tr><th colspan="2">${params[0].name}</th><tr>`],
            // map(params, v => {
            `<tr class="line">
                <td class="text-right"><i class="circle" style="color:${params[0].color}"></i>${params[0].seriesName}：</td>
                <td class="right">${Vue.filter('ktThousand')(params[0].value)}</td>
              </tr>
              <tr class="line">
                <td class="text-right"><i class="circle" style="color:${params[0].color}"></i>资产总笔数：</td>
                <td class="right">${Vue.filter('ktNull')(echartData[params[0].dataIndex].assetsCount)}</td>
              </tr>
              <tr class="line">
                <td class="text-right"><i class="circle" style="color:${params[0].color}"></i>余额占比：</td>
                <td class="right">${Vue.filter('ktCurrency')(echartData[params[0].dataIndex].rateBalance)}</td>
              </tr>
              `, '</table>').join('')
        }
      },
      color: ['#20a0ff', 'rgb(25, 183, 207)', '#61a0a8', '#d48265', '#91c7ae'],
      xAxis: {
        type: 'category',
        // data: _.map(data.fund_trends, v => moment(v.date).format('MM-DD')),
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: [{
        type: 'value',
        name: '资产余额',

        // interval: 0,
        // axisLabel: {
        //   show: true,
        //   formatter: '{value}'
        // },
        // axisLine: {
        //   show: true,
        //   lineStyle: {
        //     color: '#000'
        //   }
        // },
        // axisTick: {
        //   show: false
        // },
        splitLine: {
          show: false
        }
      }, {
        type: 'value',
        name: '资产总笔数',
        position: 'right'
      }],
      grid: {
        show: false,
        left: 100,
        right: 100,
        bottom: 60
      }
    }
    this.echart.setOption(merge({}, option, this.chartOption))
    window.addEventListener('resize', () => {
      this.echart.resize()
    })
  },
  watch: {
    chartOption() {
      this.echart.setOption(this.chartOption)
    }
  }
}
</script>

<style lang="scss">
.bar-echart {
  width: 100%;
  height: 300px; // margin: 0 auto;
}
</style>
