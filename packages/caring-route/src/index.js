import { queryParams, isObject, isJsonString } from 'caring-utils'
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
    for (const key in params) {
      if (!Object.prototype.hasOwnProperty.call(params, key)) continue

      const value = params[key]
      if (value === undefined || value === null || value === '') continue

      // 对象/数组序列化为 JSON 后统一编码，其余值转成字符串后编码
      obj[key] = encodeURIComponent(
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      )
    }
    return obj
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
  query(rawQuery) {
    const obj = {}
    for (const key of Object.keys(rawQuery || {})) {
      const raw = rawQuery[key]
      // 非字符串数据不处理（部分平台可能已解析成对象）
      if (typeof raw !== 'string') continue

      // 部分平台在 onLoad 前已自动解码过一次，这里做容错解码
      let value = raw
      try {
        value = decodeURIComponent(raw)
      } catch (e) {
        // 非法转义（如 "100%"）或已解码时保持原值
      }

      if (isJsonString(value)) {
        try {
          obj[key] = JSON.parse(value)
        } catch (e) {
          obj[key] = value
        }
      } else {
        obj[key] = value
      }
    }
    // 不修改入参，返回合并后的新对象
    return Object.assign({}, rawQuery, obj)
  }
  navigate(url, config) {
    if (!url) return false

    if (typeof url === 'string') {
      // 如果url为字符串，则config为params, 即route(url, params)的形式
      const params = config || {}
      return dispatchNavigate({
        ...params,
        routeUrl: this.mixinParam(url, params)
      })
    }
    if (isObject(url)) {
      // 如果url为对象，则config为type, 即route(url, type)的形式
      const { url: routeUrl, type = 'navigateTo', params, data, ...rest } = url
      return dispatchNavigate({
        ...rest,
        routeType: type,
        routeUrl: this.mixinParam(routeUrl, params || data)
      })
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
