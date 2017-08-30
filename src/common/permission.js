// import { APIS as API_1 } from '@/common/resource.js'
// import { APIS as API_2 } from '@/common/resource_auth.js'
import { some, isString, every } from 'lodash'
import { pruneParams } from '@/common/util.js'
import { updateCrumb } from '@/common/crosser.js'

// const APIS = {
//   ...API_1,
//   ...API_2
// }

export default {
  install(Vue, options) {
    // 权限控制
    Vue.prototype.updateCrumb = updateCrumb
    Vue.mixin({
      methods: {
        pruneParams,
        $permit(permit) { // String<apiName> or Array[]<apiName>
          if (process.env.STOP_PERMIT) return true

          const permissions = this.$store.state.permissions
          if (isString(permit)) {
            permit = [permit]
          }

          return some(permit, pp => {
            // if (!APIS[pp]) return true
            // const ppUrl = APIS[pp].replace(/:[^/]*/g, '*')

            return some(permissions, ps => {
              return ps.apiName === pp && ps.check
              // return ~ps.url.indexOf(ppUrl) && ps.check
            }) || every(permissions, ps => ps.apiName !== pp) // !~ps.url.indexOf(ppUrl)
          })
        }
      }
    })
  }
}
