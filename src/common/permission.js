import { map, isString, filter, intersection } from 'lodash'
import { pruneParams } from '@/common/util.js'
import { updateCrumb } from '@/common/crosser.js'

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
          const permitApis = map(filter(permissions, pp => pp.check && pp.apiName), p => p.apiName)

          if (isString(permit)) {
            permit = [permit]
          }

          return intersection(permit, permitApis).length
        }
      }
    })
  }
}
