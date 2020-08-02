function getSelectors(path) {
  return path.reverse().filter(element => {
    return element !== document && element !== window
  }).map(element => {
    if (element.id) {
      return `${element.nodeName.toLowerCase()}#${element.id}`
    } else if (element.className && typeof element.className === 'string') {
      return `${element.nodeName.toLowerCase()}.${element.className}`
    } else {
      return `${element.nodeName.toLowerCase()}`
    }
  }).join(' ')
}

export default function(pathOrTarget) {
  if (Array.isArray(pathOrTarget)) {
    return getSelectors(pathOrTarget)
  } else {
    return getSelectors([pathOrTarget])
  }
}
