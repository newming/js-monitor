# 前端监控系统

## 浏览器加载过程

![浏览器加载过程](images/浏览器加载过程.png)


| 字段  | 描述 | 计算方式 | 意义 |
| ------ | ----- | ----- | ----- |
| unload | 前一个页面卸载耗时 | unloadEventEnd - unloadEventStart | - |
| redirect | 重定向耗时 | redirectEnd - redirectStart | 重定向的时间 |
| appCache | 缓存耗时 | domainLookupStart - fetchStart | 读取缓存的时间 |
| dns | DNS解析耗时 | domainLookupEnd - domainLookupStart | 可观察域名解析服务 |
| tcp | tcp连接耗时 | connectEnd - connectStart | 建立连接的耗时 |
| ssl | SSl安全连接耗时 | connectEnd - secureConnectionStart | 反应数据安全建立连接耗时 |
| ttfb | Time to First Byte(TTFB)网络请求耗时 | responseEnd - requestStart | TTFB是页面发出请求到接收到应答数据第一个字节所花费的时间 |
| response | 响应数据传输耗时 | responseEnd- responseStart | 观察网络是否正常 |
| dom | DOM解析耗时 | domInteractive - responseEnd | 观察DOM结构是否合理，是否有js阻塞页面解析 |
| dcl | DOMContentLoaded事件耗时 | domContentLoadedEventEnd - domContentLoadedEventStart | 等HTML文档被完全加载和解析完成后，domContentLoaded事件触发 |
| resources | 资源加载耗时 | domComplete - domContentLoadedEventEnd | 可观察文档流量是否过大 |
| domReady | DOM阶段渲染耗时 | domContentLoadedEventEnd - fetchStart | DOM树和页面资源加载完成时间，会触发domContentLoaded事件 |
| 首次渲染耗时 | 首次渲染耗时 | responseEnd - fetchStart | 加载文档到看到第一帧非空图像的时间，也叫白屏时间 |
| 首次可交互时间 | 首次可交互时间 | domInteractive - fetchStart | DOM树解析完成时间，此时document.readyState为interactive |
| 首包时间耗时 | 首包时间 | responseStart - domainLookupStart | DNS解析到响应返回给浏览器第一个字节的时间 |
| 页面完全加载时间 | 页面完全加载时间 | loadEventStart - fetchStart | - |
| onLoad | onLoad事件耗时 | loadEventEnd - loadEventStart | - |

## 性能指标

| 字段 | 描述 | 备注 |
| --- | --- | --- |
| FP | First Paint(首次绘制) | 包括了任何用户自定义的背景绘制，它是首先将像素绘制到屏幕的时刻 |
| FCP | First Content Paint(首次内容绘制) | 是浏览器将第一个DOM渲染到屏幕的时间，可能是文本、图像、svg等，这其实就是白屏时间 |
| FMP | First Meaningful Paint(首次有意义绘制) | 页面有意义的内容渲染的时间 |
| LCP | Largest Contentful Paint(最大内容渲染) | 代表在viewpoint中最大的页面元素加载的时间 |
| DCL | Dom Content Loaded(DOM加载完成) | 当HTML文档被完全加载和解析完成之后，DOMContentLoaded事件被触发，无需等待样式表、图像和子框架的完全加载 |
| L | onload | 当依赖的资源全部加载完毕之后才触发 |
| TTL | Time to Interactive | 用于标记应用已进行视觉渲染并能可靠响应用户的输入的时间点 |
| FID | First Input Delay(首次输入延迟) | 用户首次和页面交互(单击链接、点击按钮等)到页面响应交互的时间 |

## 实战项目

front-monitor文件夹
