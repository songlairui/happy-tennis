import Taro from '@tarojs/taro'

const baseDomain = 'https://songlairui.cn/tennis'

const apiFn = ({ method = 'GET', url = '', auth = false }) => data =>
  new Promise((success, fail) => {
    const jwt = Taro.getStorageSync('jwtInfo')
    if (auth && !jwt) throw new Error('未登陆')
    const payload = {
      data,
      success(result) {
        if (result.statusCode >= 200 && result.statusCode < 300) {
          success(result.data)
        } else {
          const msg =
            result.data && typeof result.data !== 'string'
              ? result.data
              : { msg: result.data }
          fail({ code: result.statusCode, ...msg })
        }
      },
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
export const updateActivity = (id, payload) =>
  apiFn({ url: `/activity/${id}`, method: 'PUT' })(payload)
export const getActivities = apiFn({ url: '/activities' })
export const myInfo = apiFn({ url: `/user` })

export function blank() {}
