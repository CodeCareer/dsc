import { isNumber, round, isNil, isNull } from 'lodash'
import moment from 'moment'
import numeral from 'numeral'

export default {
  install(Vue, options) {
    Vue.filter('ktCurrency', (value, prefix = '￥', suffix = '') => {
      if (isNumber(value)) {
        return prefix + numeral(round(value, 2)).format('0,0.00') + suffix
      }
      return value
    })

    Vue.filter('ktKm', value => {
      if (isNumber(value)) {
        return numeral(round(value / 1000)).format('0,0') + 'km'
      }
      return value
    })

    Vue.filter('ktPercent', (value, decimal = 2, multi = 100, unit = '%') => {
      return isNumber(value) ? round(value * multi, decimal).toFixed(decimal) + (unit || '') : ''
    })

    Vue.filter('ktRangePercent', (value, value2, decimal = 2) => {
      value = isNumber(value) ? round(value, decimal).toFixed(decimal) : ''
      value2 = isNumber(value2) ? round(value2, decimal).toFixed(decimal) : ''
      if (value === value2) {
        return value + '%'
      }

      return `${value}-${value2}%`
    })

    Vue.filter('ktRound', (value, decimal = 0) => {
      return round(value, decimal).toFixed(2)
    })

    Vue.filter('ktAppend', (value, str) => {
      return (isNil(value) ? '' : value) + str
    })

    Vue.filter('ktPrepend', (value, str) => {
      return str + (isNil(value) ? '' : value)
    })

    Vue.filter('ktPositveNumber', (value) => {
      if (value > 0 && isNumber(value)) {
        return '+' + value
      }
      return value
    })

    Vue.filter('ktNegativeNumber', (value) => {
      if (value > 0) {
        return value
      } else {
        return -(value)
      }
    })

    Vue.filter('ktNull', (value, str) => {
      return isNull(value) ? '-' : (str || value)
    })

    Vue.filter('moment', (date, format = 'YYYY-MM-DD h:mm:ss', inputFormat) => {
      if (inputFormat) {
        return date ? moment(date, inputFormat).format(format) : '-'
      }
      return date ? moment(date).format(format) : '-'
    })

    Vue.filter('filterTem', value => {
      return value === 'ACCESS' ? '准入模板' : '预警模板'
    })

    Vue.filter('riskState', value => {
      return value === 'PASS' ? '通过' : '未通过'
    })
  }
}
