<template></template>

<script>
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

export default {
  props: {
    parent: String
  },
  created() {
    if (this.parent) {
      nprogress.configure({
        parent: this.parent
      })
    }
  }
}
</script>

<style lang="scss">
.nprogress-custom-parent #nprogress .spinner,
#nprogress .spinner {
  left: 150px;
  top: 20px;
  position: fixed!important;
}

.nprogress-custom-parent #nprogress .bar {
  position: fixed!important;
}
</style>
