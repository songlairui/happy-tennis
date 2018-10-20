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
    this.init()
  }

  componentDidHide() {}
  async init() {
    // 查看是否授权
    await new Promise(r => {
      const currentIdentity = Taro.getStorageSync('identity')
      if (currentIdentity) {
        api.report({ type: 'open', remark: currentIdentity.userInfo })
        return r(currentIdentity)
      }
      return this.getIdentity().then(identity => {
        Taro.setStorageSync('identity', identity)
        this.setState({
          toast: {
            visible: true,
            text: '登陆中',
            status: 'success'
          }
        })
        api
          .report({ type: 'open', remark: identity.userInfo })
          .catch(console.warn)
      })
    })
      .then(a => {
        console.warn('a', a)
        return a
      })
      .then(identity => this.login(identity))
      .catch(err => {
        this.setState({
          needAuth: true
        })
        api.report({
          type: err.type || 'init',
          remark: `${err.remark} ${err.message}`
        })
      })
  }
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
  login(identity) {
    if (Taro.getStorageSync('jwtInfo')) return console.info('has logon')
    const { iv, encryptedData } = identity || Taro.getStorageSync('identity')
    return new Promise(success => {
      Taro.login({ success })
    })
      .then(({ code }) => api.login({ code, iv, encryptedData }))
      .then(({ data: { jwtInfo } }) => {
        if (jwtInfo) Taro.setStorageSync('jwtInfo', jwtInfo)
      })
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
    console.warn('handleGetUserInfo', e)
    if (!userInfo) {
      await api.report({ type: 'auth', remark: 'cancel clicked' })
      this.setState({
        toast: { visible: true, text: '授权后才能参加活动', status: 'error' }
      })
    } else {
      this.setState({
        needAuth: false
      })
      this.getIdentity()
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
