import {
  get,
  keys,
  every
} from 'lodash'

export function validateArray(rule, value, cb) {
  if (!value || !value.length) {
    cb(new Error(`请选择${rule.fieldName}`))
  } else {
    cb()
  }
}

export function validateArrayDeep(rule, value, cb) {
  if (!value || !value.length) {
    cb(new Error(`${rule.fieldName}不能为空`))
  } else {
    const valid = every(value, item => {
      return every(keys(item), k => {
        if (rule.arrayKeys[k] && rule.arrayKeys[k].required && !item[k]) {
          item.hasError = true
          cb(new Error(`${rule.arrayKeys[k].message}`))
          return false
        }
        item.hasError = false
        return true
      })
    })

    if (valid) {
      cb()
    }
  }
}

export function validateEqual(rule, value, cb) {
  if (value !== get(this, rule.compare)) {
    cb(new Error(`请输入相同的${rule.compareName}`))
  } else {
    cb()
  }
}
