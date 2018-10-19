import Taro from '@tarojs/taro'

const baseDomain = 'http://localhost:3001'

const apiFn = ({ method = 'GET', url = '' }) => data =>
  new Promise((success, fail) => {
    console.warn('api -', data)
    Taro.request({
      data,
      success,
      fail,
      method,
      url: `${baseDomain}${url}`
    })
  })

export const report = apiFn({ url: '/trace', method: 'POST' })
export const login = apiFn({ url: '/login', method: 'POST' })

export function blank() {}
