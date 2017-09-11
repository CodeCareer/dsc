import { each, keys, merge } from 'lodash'
import {
  pruneParams
} from '@/common/util.js'

import moment from 'moment'

export const tableListMixins = {
  methods: {
    parseInt: window.parseInt,
    clearFilter() {
      each(this.filter, (v, k) => {
        if (k !== 'limit' && k !== 'size' && k !== 'page') {
          this.filter[k] = ''
        }
      })
      each(this.date, (v, k) => {
        this.date[k] = ''
      })
      this.search()
    },

    search(savedPage) {
      if (!savedPage) this.filter.page = 1 // 重置到第一个页面
      this.$router.push({
        name: this.$route.name,
        query: pruneParams(this.filter)
      })
      this.filter = merge(this.filter, {'refresh': Math.random()})
    },

    dateSearch(value, key) {
      this.filter[key] = value ? moment(value).format('YYYYMMDD') : ''
      this.date[key] = value ? moment(value).format('YYYY-MM-DD') : ''
      this.search()
    },

    pageChange(val) {
      this.filter.page = val
      this.search(true)
    },

    pageSizeChange(val) {
      this.filter.limit = val
      this.search(true)
    }
  },

  created() {
    const query = this.$route.query
    each(keys(this.date), d => {
      this.date[d] = query[d] ? moment(query[d], 'YYYYMMDD').format('YYYY-MM-DD') : this.date[d]
    })
  },

  data() {
    return {
      page: {
        total: 0,
        sizes: [10, 20, 50, 100, 500]
      },
      maxHeight: 600
    }
  }
}
