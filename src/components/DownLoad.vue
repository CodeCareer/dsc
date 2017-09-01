<template lang="pug">
  span
    a.color-blue.download(v-for="item in filePath", v-on:click="downloadAttachment(item)", href="javascript:;") 下载附件 
</template>

<script>
import {
  downLoad
} from '@/common/resource.js'

export default {
  name: 'down-load',
  props: {
    filePath: Array
  },
  methods: {
    downloadAttachment(path) {
      downLoad.post({ filePath: path }, {
        loadingMaskTarget: '.asset-info-form'
      }).then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>

<style lang="scss">

</style>
