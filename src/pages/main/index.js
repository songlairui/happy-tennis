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
    // 查看是否授权
    if (Taro.getStorageSync('identity')) return
    this.getIdentity()
  }

  componentDidHide() {}
  getIdentity() {
    const vm = this
    console.warn('getSetting')
    Taro.getSetting({
      success(res) {
        console.warn('checkAuth')
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          console.warn('getUserInfo')

          Taro.getUserInfo({
            success: function(user) {
              Taro.setStorageSync('identity', user)
              vm.setState({
                toast: {
                  visible: true,
                  text: '用户信息获取成功',
                  status: 'success'
                }
              })
            },
            fail(err) {
              console.warn('getUserInfo', err)
            }
          })
        } else {
          vm.setState({
            needAuth: true
          })
        }
      },
      fail(err) {
        console.warn(err)
      }
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
  handleGetUserInfo(e) {
    const userInfo = e.detail.userInfo
    console.warn('handleGetUserInfo', e)
    if (!userInfo) {
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
