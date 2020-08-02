// 监控js错误
import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'
import tracker from '../utils/tracker'

export function injectJsError() {
  window.addEventListener('error', function (event) {
    // 可以捕获到js执行错误和资源加载失败的错误
    console.log('error:', event)
    let lastEvent = getLastEvent() // 获取到最后一个交互事件
    // console.log(lastEvent)
    let log
    // 脚本加载错误
    if (event.target && (event.target.src || event.target.href)) {
      log = {
        kind: 'stability', // 监控指标的大类
        type: 'error', // 小类型，这是一个错误
        errorType: 'resourceError', // 资源加载错误
        // message: event.message, // 报错信息
        filename: event.target.src || event.target.href,
        tagName: event.target.tagName,
        // position: `${event.lineno}:${event.colno}`, // 报错位置
        selector: getSelector(event.path), // 代表最后一个操作的元素
      }
    } else {
      log = {
        kind: 'stability', // 监控指标的大类
        type: 'error', // 小类型，这是一个错误
        errorType: 'jsError', // JS执行错误
        message: event.message, // 报错信息
        filename: event.filename,
        position: `${event.lineno}:${event.colno}`, // 报错位置
        stack: getLines(event.error.stack), // 错误堆栈
        selector: lastEvent ? getSelector(lastEvent.path) : '', // 代表最后一个操作的元素
      }
    }
    console.log('errorLog', log)
    tracker.send(log)
  }, true) // 在捕获阶段执行，否则捕获不到 资源加载失败的错误

  window.addEventListener('unhandledrejection', function (event) {
    console.log(event)
    let lastEvent = getLastEvent()
    let message
    let filename
    let line = 0
    let column = 0
    let stack = ''
    let reason = event.reason
    if (typeof reason === 'string') {
      message = reason
    } else if (typeof reason === 'object') {
      message = reason.message
      if (reason.stack) {
        // at http://localhost:8080/:23:30 解析出来文件地址和行列数
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
        filename = matchResult[1]
        line = matchResult[2]
        column = matchResult[3]
      }
      stack = getLines(reason.stack)
    }
    let log = {
      kind: 'stability', // 监控指标的大类
      type: 'error', // 小类型，这是一个错误
      errorType: 'promiseError', // JS执行错误
      message: message, // 报错信息
      filename: filename,
      position: `${line}:${column}`, // 报错位置
      stack: stack, // 错误堆栈
      selector: lastEvent ? getSelector(lastEvent.path) : ''
    }
    console.log(log)
    tracker.send(log)
  })

  function getLines(stack) {
    // \n 划分，第一行是错误信息丢弃
    return stack.split('\n').slice(1).map(item => {
      return item.replace(/^\s+at\s+/g, '')
    }).join('^')
  }
}