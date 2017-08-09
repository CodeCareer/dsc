import { MessageBox } from 'element-ui'
import { some } from 'lodash'
const msgQueue = []
let preMsg = {}
let msgBoxLock = false

export default function msgboxErr(message, code = 'UNKNOWN') {
  return new Promise((resolve, reject) => {
    if (msgQueue.length > 2 || some(msgQueue, msg => msg.code === code)) return // 避免过多了错误提示和重复的msg弹出

    msgQueue.push({
      message,
      code,
      resolve,
      reject
    })

    if (!msgBoxLock) {
      showNextMsg()
    }
  })
}

const showNextMsg = function() {
  if (msgQueue.length > 0) {
    const currentMsg = msgQueue[0]
    if (preMsg.code === currentMsg.code) { // 多层保护
      preMsg = msgQueue.shift()
      currentMsg.resolve(showNextMsg())
    }
    msgBoxLock = true
    MessageBox({
      message: currentMsg.message,
      title: '提示',
      type: 'error'
    }).then(() => {
      msgBoxLock = false
      preMsg = msgQueue.shift()
      currentMsg.resolve(showNextMsg())
    })
  }
}
