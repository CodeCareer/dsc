<template lang="pug">
  div
</template>

<script>
import { http } from '@/common/resource_auth.js'

export default {
  mounted() {
    http.get('/usermanage/v1/group/list').then(res => console.log(res.data))
  }
}
</script>
