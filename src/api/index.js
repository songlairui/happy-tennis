import Taro from '@tarojs/taro'

const baseDomain = 'http://192.168.50.64:3001'

const apiFn = ({ method = 'GET', url = '', auth = false }) => data =>
  new Promise((success, fail) => {
    const jwt = Taro.getStorageSync('jwtInfo')
    if (auth && !jwt) throw new Error('未登陆')
    const payload = {
      data,
      success,
      fail,
      method,
      url: `${baseDomain}${url}`
    }
    if (jwt) {
      payload.header = {
        authorization: jwt
      }
    }
    Taro.request(payload)
  })

export const report = apiFn({ url: '/trace', method: 'POST' })
export const login = apiFn({ url: '/wx-login', method: 'POST' })
export const newActivity = apiFn({ url: '/activity', method: 'POST' })
export const getActivity = id => apiFn({ url: `/activity/${id}` })()

export function blank() {}
