class SendTracker {
  constructor() {
    this.url = '' // 上报的路径
    this.xhr = new XMLHttpRequest
  }

  send(data = {}) {

  }
}

export default new SendTracker()
