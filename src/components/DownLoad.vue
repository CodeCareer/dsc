<template lang="pug">
  span
    a.color-blue.download(v-for="item in filePath", :href="href(item, assetFrom)") 下载附件 
</template>

<script>
import store from '@/vuex/store.js'

export default {
  name: 'down-load',
  props: {
    filePath: Array,
    assetFrom: String
  },
  methods: {
    href(value, assetFrom) {
      return process.env.API_HOST + '/common/download?filePath=' + value + '&assetFrom=' + assetFrom + '&token=' + store.getters.token
    }
  }
}
</script>

<style lang="scss">

</style>
