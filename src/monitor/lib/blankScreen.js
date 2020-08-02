import onload from '../utils/onload'

// 白屏监控
export function blankScreen() {
  let innerWidth = window.innerWidth
  let innerHeight = window.innerHeight

  let wrapperElements = ['html', 'body', '#container'] // 认为是空白点的容器
  let emptyPoints = 0
  function isWrapper(element) {
    let selector = getSelector(element)
    if (wrapperElements.indexOf(selector) !== -1) {
      emptyPoints++
    }
  }

  function getSelector(element) {
    if (element.id) {
      return '#' + element.id
    } else if (element.className) {
      // .a.b.c
      return '.' + element.className.split(' ').filter(item => !!item).join('.')
    } else {
      return element.nodeName.toLowerCase()
    }
  }

  onload(function () {
    for (let i = 1; i <= 9; i++) {
      let xElements = document.elementsFromPoint(innerWidth * i / 10, innerHeight / 2)
      let yElements = document.elementsFromPoint(innerWidth / 2, innerHeight * i / 10)
      isWrapper(xElements[0])
      isWrapper(yElements[0])
    }

    if (emptyPoints > 16) {
      let centerElements = document.elementsFromPoint(innerWidth / 2, innerHeight / 2)
      let log = {
        kind: 'stability',
        type: 'blank',
        emptyPoints,
        screen: window.screen.width + 'X' + window.screen.height,
        viewPoint: window.innerWidth + 'X' + window.innerHeight,
        selector: getSelector(centerElements[0])
      }
      console.log(log)
    }
  })
}
