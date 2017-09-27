import { find } from 'lodash'
const dataSourceList = [{
  name: '全部',
  value: '_all_'
}, {
  name: '汽车之家',
  value: 'autohome'
}, {
  name: '花生',
  value: 'HUASHENG'
}, {
  name: '手动添加',
  value: 'manual_add'
}]

const assetFromList = [{
  name: '大搜车',
  value: 'DSC'
}, {
  name: '花生',
  value: 'HUASHENG'
}]

export default {
  filters: {
    dataSourceLocal(value) {
      const status = find(dataSourceList, s => s.value === value)
      return status ? status.name : '来源不详'
    },
    assetFromLocal(value) {
      const assetFrom = find(assetFromList, s => s.value === value)
      return assetFrom ? assetFrom.name : '未知来源'
    }
  },

  data() {
    return {
      dataSourceList,
      assetFromList
    }
  }
}
