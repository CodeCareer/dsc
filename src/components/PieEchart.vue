<template lang="pug">
  .pie-echart(ref="pieChart")
</template>

<script>
import {
  merge
} from 'lodash'
import echarts from 'echarts/lib/echarts.js'
require('echarts/lib/chart/pie')
require('echarts/lib/model/series')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')

export default {
  props: ['chartOption'],
  data() {
    return {
      echart: null
    }
  },

  mounted() {
    this.echart = echarts.init(this.$refs.pieChart)
    let option = {
      tooltip: {
        show: true,
        x: 'left',
        y: 'middle',
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      color: ['#21a9e1', '#35cbef', '#1fdab1', '#92e68d', '#877989', '#343523'],
      legend: {
        orient: 'vertical',
        x: '20px',
        left: '0px',
        top: 'center',
        // data: this.chartOption.legendData,
        data: [],
        textStyle: {
          fontSize: 12, //示例文字size
          color: '#262c38' //示例文字颜色
        },
        itemWidth: 15,
        itemHeight: 10,
        itemGap: 20
      },
      series: [{
        name: '',
        type: 'pie',
        center: ['70%', '50%'],
        radius: ['50%', '80%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '10',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: []
      }]
    }
    this.echart.setOption(merge({}, this.chartOption, option))
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
.pie-echart {
  height: 140px;
  width: 390px;
  margin: 0 auto;
}
</style>
