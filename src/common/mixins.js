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
      this.search()
    },

    search() {
      this.$router.push({
        name: this.$route.name,
        query: pruneParams(this.filter)
      })
    },

    pageChange(val) {
      this.filter.page = val
      this.search()
    },

    pageSizeChange(val) {
      this.filter.limit = val
      this.search()
    }
  },
  data() {
    return {
      page: {
        total: 1000,
        sizes: [10, 20, 30, 50]
      }
    }
  }
}
