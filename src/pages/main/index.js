import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import {
  AtButton,
  AtCard,
  AtList,
  AtListItem,
  AtProgress,
  AtToast
} from 'taro-ui'
import * as api from '../../api'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      needAuth: false,
      canIUse: Taro.canIUse('button.open-type.getUserInfo'),
      toast: {
        visible: false,
        text: '',
        status: ''
      }
    }
  }
  config = {
    navigationBarTitleText: 'MAIN'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {}

  componentDidShow() {
    this.login()
  }

  componentDidHide() {}
  getIdentity() {
    return new Promise((success, j) => {
      Taro.getSetting({
        async success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            Taro.getUserInfo({
              success,
              fail: err =>
                j(Object.assign(err, { type: 'auth', remark: 'failed' }))
            })
          } else {
            j({ msg: 'need getSetting auth', type: 'auth' })
          }
        },
        fail: err => j(Object.assign(err, { remark: 'getSetting fail' }))
      })
    })
  }
  async login() {
    if (Taro.getStorageSync('jwtInfo')) return console.info('has logon')
    try {
      const { code } = await new Promise((success, fail) =>
        Taro.login({ success, fail })
      )
      const { iv, encryptedData } = await this.getIdentity()
      const { data: jwtText } = await api.login({ code, iv, encryptedData })
      if (typeof jwtText !== 'string') {
        return Promise.reject({ type: 'login', remark: '登陆失败' })
      }
      Taro.setStorageSync('jwtInfo', jwtText)
      this.setState({
        toast: {
          visible: true,
          text: '登陆成功',
          status: 'success'
        }
      })
    } catch (err) {
      console.warn('登陆失败', err)
      this.setState({
        needAuth: true
      })
      api.report({
        type: err.type || 'init',
        remark: `${err.remark || '-'} ${err.message || ''}`
      })
    }
  }
  handleChange(...x) {
    console.warn('handleChange', ...x)
  }
  handleGoto(target) {
    Taro.navigateTo({
      url: target
    })
  }
  async handleGetUserInfo(e) {
    const userInfo = e.detail.userInfo
    if (!userInfo) {
      await api.report({ type: 'auth', remark: 'cancel clicked' })
      this.setState({
        toast: { visible: true, text: '授权后才能参加活动', status: 'error' }
      })
    } else {
      this.setState({
        needAuth: false
      })
      this.login()
    }
  }
  handleClose = () => {
    console.warn('close')
    this.setState({
      toast: { visible: false, status: '' }
    })
  }
  render() {
    return (
      <View className="wrapper">
        <AtToast
          isOpened={this.state.toast.visible}
          text={this.state.toast.text}
          status={this.state.toast.status}
          onClose={this.handleClose}
        />
        <View className="userBar">
          <View className="figure">
            <View className="avatarPlace">
              <open-data type="userAvatarUrl" />
            </View>
          </View>
          <View className="nick-name">
            <open-data type="userNickName" />
          </View>
          {this.state.needAuth && (
            <View className="auth">
              {this.state.canIUse ? (
                <Button
                  open-type="getUserInfo"
                  onGetUserInfo={this.handleGetUserInfo}
                >
                  授权登录
                </Button>
              ) : (
                <View>请升级微信版本</View>
              )}
            </View>
          )}
        </View>
        <View className="main">
          <View className="action create">
            <AtButton
              type="primary"
              onClick={this.handleGoto.bind(
                this,
                '/pages/activity/index?id=new'
              )}
            >
              新建召集
            </AtButton>
          </View>
        </View>
      </View>
    )
  }
}

export default Index
