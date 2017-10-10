<template lang="pug">
  el-button(size="small", type="primary")
    a(:href="exportExcel()") 导出Excel
</template>

<script>
import store from '@/vuex/store.js'

export default {
  props: ['excelFilter'],
  methods: {
    exportExcel() {
      return process.env.API_HOST + this.excelFilter + '&token=' + store.getters.token
    }
  }
}
</script>

<style lang="scss"> </style>
