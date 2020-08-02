export function injectXHR() {
  let XMLHttpRequest = window.XMLHttpRequest
  let oldOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (method, url, async) {
    // 如果是忽略的请求，或者是监控地址，需要跳过，不打log
    if (!url.match(/logurl/)) {
      this.logData = {
        method,
        url,
        async
      }
    }
    return oldOpen.apply(this, arguments)
  }

  let oldSend = XMLHttpRequest.prototype.send
  let startTime
  XMLHttpRequest.prototype.send = function (body) {
    if (this.logData) {
      startTime = Date.now() // 发送之前记录一下开始的时间

      let handler = (type) => (event) => {
        let duration = Date.now() - startTime
        let status = this.status
        let statusText = this.statusText
        let log = {
          kind: 'stability',
          type: 'xhr',
          eventType: type,
          pathname: this.logData.url,
          status: status + '-' + statusText,
          duration,
          respone: this.response ? JSON.stringify(this.response) : '',
          params: body || ''
        }
        console.log(log)
      }

      this.addEventListener('load', handler('load'), false)
      this.addEventListener('error', handler('error'), false)
      this.addEventListener('abort', handler('abort'), false)
    }
    return oldSend.apply(this, arguments)
  }
}