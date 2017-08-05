import { APIS as API_1 } from '@/common/resource.js'
import { APIS as API_2 } from '@/common/resource_auth.js'
import { some, isString, every } from 'lodash'

const APIS = {
  ...API_1,
  ...API_2
}

export default {
  install(Vue, options) {
    // 权限控制
    Vue.mixin({
      methods: {
        $permit(permit) { // String<apiName> or Array[]<apiName>
          const permissions = this.$store.state.permissions
          if (isString(permit)) {
            permit = [permit]
          }

          return every(permit, pp => {
            const ppUrl = '/api' + APIS[pp]
            return some(permissions, ps => {
              return ~ppUrl.indexOf(ps.url) && ps.check
            }) || every(permissions, ps => !~ppUrl.indexOf(ps.url))
          })
        }
      }
    })
  }
}
