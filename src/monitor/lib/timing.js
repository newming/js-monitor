import onload from '../utils/onload'
import tracker from '../utils/tracker'
import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'

// 浏览器加载页面过程中各个环节时间
export function timing() {
  let FMP, LCP
  // 增加一个性能条目的观察者
  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries()
    FMP = perfEntries[0]
    observer.disconnect() // 不再观察了
  }).observe({
    entryTypes: ['element'] // 观察页面中有意义的元素，html中需要配合增加 属性包含 elementtiming 的元素
  })

  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries()
    LCP = perfEntries[0]
    observer.disconnect() // 不再观察了
  }).observe({
    entryTypes: ['largest-contentful-paint'] // 观察页面中最大元素的渲染
  })

  // FID 首次输入延迟
  new PerformanceObserver((entryList, observer) => {
    let firstInput = entryList.getEntries()[0]
    let lastEvent = getLastEvent()
    console.log('firstInput', firstInput)
    if (firstInput) {
      // processingStart 开始处理的时间，startTime开始点击的时间，差值就是处理的延迟
      let inputDelay = firstInput.processingStart - firstInput.startTime
      let duration = firstInput.duration // 处理的耗时

      if (inputDelay > 0 || duration > 0) {
        let firstInputDelayLog = {
          kind: 'experience',
          type: 'firstInputDelay',
          inputDelay,
          duration,
          startTime: firstInput.startTime,
          name: firstInput.name,
          selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : null, // 代表最后一个操作的元素
        }
        console.log('firstInputDelayLog', firstInputDelayLog)
      }
    }
    observer.disconnect() // 不再观察了
  }).observe({
    type: 'first-input', // 第一次交互
    buffered: true
  })

  onload(function () {
    setTimeout(() => {
      const {
        fetchStart,
        connectStart,
        connectEnd,
        requestStart,
        responseStart,
        responseEnd,
        domLoading,
        domInteractive,
        domContentLoadedEventStart,
        domContentLoadedEventEnd,
        loadEventStart,
        loadEventEnd
      } = performance.timing
      let log = {
        kind: 'experience', // 用户体验指标
        type: 'timing', // 统计每个阶段的时间
        connectTime: connectEnd - connectStart, // 建立连接时间
        ttfbTime: responseStart - requestStart, // 首字节加载时间
        responseTime: responseEnd - responseStart, // 响应时间
        parseDOMtime: loadEventStart - domLoading, // DOM解析时间
        domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart, // jquery中 domready事件，注意 window.onload 事件比这个晚
        timeToInteractive: domInteractive - fetchStart, // 首次可交互时间
        loadTime: loadEventStart - fetchStart, // 完整的加载时间
      }
      console.log(log)
      tracker.send(log)

      // 开始发送性能指标
      console.log('FMP', FMP)
      console.log('LCP', LCP)
      let FP = performance.getEntriesByName('first-paint')[0]
      let FCP = performance.getEntriesByName('first-contentful-paint')[0]
      console.log(FP)
      console.log(FCP)
      let paintLog = {
        kind: 'experience',
        type: 'paint',
        firstPaint: FP.startTime,
        firstContentfulPaint: FCP.startTime,
        largestContentfulPaint: LCP.startTime,
        firstMeaningfulPaint: FMP.startTime,
      }
      console.log('paintLog', paintLog)
    }, 3000)
  })
}