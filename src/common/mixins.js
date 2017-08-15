import { each } from 'lodash'
import {
  pruneParams
} from '@/common/util.js'

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
  data() {
    return {
      page: {
        total: 0,
        sizes: [10, 20, 30, 50]
      }
    }
  }
}
