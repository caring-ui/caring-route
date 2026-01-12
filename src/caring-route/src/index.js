import { queryParams } from 'caring-utils'
import { isObject, isJsonString } from 'caring-test'
const PARAMS_ROUTE = ['navigateTo', 'redirectTo', 'reLaunch']

// 放在Route类里也可以
function dispatchNavigate(config) {
  const { routeUrl: url, routeType = 'navigateTo', delta = 1, events } = config

  return new Promise((resolve, reject) => {
    uni[routeType]({
      url,
      delta,
      events,
      success: (e) => resolve(e),
      fail: (e) => reject(e)
    })
  })
}

class Route {
  handleParams(params = {}) {
    const obj = {}
    for (let key in params) {
      if (typeof params[key] === 'object') {
        obj[key] = encodeURIComponent(JSON.stringify(params[key]))
      }
      // 如果包含http链接进行编码操作
      if (typeof params[key] === 'string' && params[key].includes('http')) {
        params[key] = encodeURIComponent(params[key])
      }
    }
    return Object.assign(params, obj)
  }

  mini(appId, path) {
    return new Promise((resolve, reject) => {
      uni.navigateToMiniProgram({
        appId, // 其他小程序APPID
        path,
        success: (res) => {
          console.log('🚀 ===>res：', res)
          resolve()
        },
        fail: (err) => {
          console.log('🚀 ===>err：', err)
          reject(err)
        }
      })
    })
  }
  // 解码onload中的query参数
  query(query) {
    console.log('🐛 ~ index.js:53 ~ Route ~ query ~ query 🐛:', query)
    const obj = {}
    for (const key in query) {
      // 非对象数据才会处理

      if (typeof query[key] !== 'object') {
        const q = decodeURIComponent(query[key])
        console.log('🚀 ===>q：', q)
        if (isJsonString(q)) {
          obj[key] = JSON.parse(q)
        }
        // if (q.startsWith('{') || q.startsWith('[')) {
        //   if (typeof q === 'string') {
        //     obj[key] = JSON.parse(q)
        //   }
        // }
      }
      // 处理 url 是否包含 http 链接的情况
      if (query[key].includes('http')) {
        obj[key] = decodeURIComponent(query[key])
      }
    }
    return Object.assign(query, obj)
  }
  navigate(url, config) {
    if (!url) return false

    if (typeof url === 'string') {
      // 如果url为字符串，则config为params, 即route(url, params)的形式
      if (!config) config = {}
      config.routeUrl = this.mixinParam(url, config)
      return dispatchNavigate(config)
    }
    if (isObject(url)) {
      console.log('isobject', url)
      // 如果url为对象，则config为type, 即route(url, type)的形式
      config = url
      config.routeUrl = url.url
      config.routeType = url.type || 'navigateTo'
      Reflect.deleteProperty(config, 'url')
      Reflect.deleteProperty(config, 'type')

      const data = config.params || config.data
      config.routeUrl = this.mixinParam(config.routeUrl, data)
      return dispatchNavigate(config)
    }
  }
  // 整合路由参数
  mixinParam(url, params) {
    url = url && this.addRootPath(url)

    // 使用正则匹配，主要依据是判断是否有"/","?","="等，如“/page/index/index?name=mary"

    let query = ''
    if (/.*\/.*\?.*=.*/.test(url)) {
      // object对象转为get类型的参数
      query = queryParams(this.handleParams(params), false) // 如果有url中有get参数，转换后无需带上"?"
      // 因为已有get参数,所以后面拼接的参数需要带上"&"隔开
      return (url += '&' + query)
    } else {
      // 直接拼接参数，因为此处url中没有后面的query参数，也就没有"?/&"之类的符号
      query = queryParams(this.handleParams(params))
      return (url += query)
    }
  }

  to(routeUrl, params) {
    const config = {
      routeType: 'navigateTo',
      routeUrl,
      params
    }
    this._navigateMethod(config)
  }
  navigateTo(...params) {
    this.to(...params)
  }

  back(delta) {
    const config = {
      routeType: 'navigateBack',
      delta
    }
    this._navigateMethod(config)
  }
  navigateBack(...params) {
    this.back(...params)
  }

  tab(routeUrl) {
    const config = {
      routeType: 'switchTab',
      routeUrl
    }
    this._navigateMethod(config)
  }
  switchTab(...params) {
    this.tab(...params)
  }

  direct(routeUrl, params) {
    const config = {
      routeType: 'redirectTo',
      routeUrl,
      params
    }
    this._navigateMethod(config)
  }
  redirectTo(...params) {
    this.direct(...params)
  }

  launch(routeUrl, params) {
    const config = {
      routeType: 'reLaunch',
      routeUrl,
      params
    }
    this._navigateMethod(config)
  }
  reLaunch(...params) {
    this.launch(...params)
  }
  _navigateMethod(config) {
    if (PARAMS_ROUTE.includes(config.routeType)) {
      config.routeUrl = this.mixinParam(config.routeUrl, config.params)
    } else {
      config.routeUrl = config.routeUrl && this.addRootPath(config.routeUrl)
    }
    return dispatchNavigate(config)
  }
  // 判断url前面是否有"/"，如果没有则加上，否则无法跳转
  addRootPath(url) {
    return url[0] === '/' ? url : `/${url}`
  }
}

function createRoute() {
  const context = new Route()
  const instance = Route.prototype.navigate.bind(context)
  // 关键，将Route的实例context上的原型赋值给instance，从而让instance具备Route的原型方法，instance是一个混合函数，既可以作为函数调用，也可以调用类的方法
  Object.setPrototypeOf(instance, context)
  return instance
}

export default createRoute()
