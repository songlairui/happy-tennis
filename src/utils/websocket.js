const factory = () => {
  function WebSocket(url) {
    this.url = url
    this.msg = ''
    ;['Open', 'Close', 'Error', 'Message'].forEach(eName => {
      this[`_on${eName}`] = null
    })
    const jwtInfo = wx.getStorageSync('jwtInfo')
    const payload = {
      url,
      success: msg => {
        this.msg = msg
      },
      fail: err => {
        this.msg = err
      }
    }
    if (jwtInfo) {
      payload.header = {
        authorization: jwtInfo
      }
    }
    console.info('connectSocket payload', payload)
    this.task = wx.connectSocket(payload)
  }
  ;['Open', 'Close', 'Error', 'Message'].forEach(eName => {
    Object.defineProperty(WebSocket.prototype, `on${eName.toLowerCase()}`, {
      enumerable: true,
      configurable: true,
      get() {
        return this[`_on${eName}`]
      },
      set(val) {
        this[`_on${eName}`] = val
        this.task[`on${eName}`](this[`_on${eName}`])
      }
    })
  })
  ;['send', 'close'].forEach(fnName => {
    WebSocket.prototype[fnName] = function(data) {
      this.task[fnName]({
        data
      })
    }
  })
  return WebSocket
}

export default (typeof WebSocket === 'undefined' ? factory() : WebSocket)
