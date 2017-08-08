const msgQueue = []
import { MessageBox } from 'element-ui'
import { some } from 'lodash'

export default function msgboxErr(message, code = 'UNKNOWN') {
  return new Promise((resolve, reject) => {
    if (msgQueue.length > 2 || some(msgQueue, msg => msg.code === code)) return // 避免过多了错误提示和重复的msg弹出

    msgQueue.push({
      message,
      code,
      resolve,
      reject
    })

    showNextMsg()
  })
}

const showNextMsg = function() {
  const currentMsg = msgQueue.unshift()
  return MessageBox({
    message: currentMsg.message,
    title: '提示',
    type: 'error'
  }).then(() => currentMsg.resolve(showNextMsg()))
}
