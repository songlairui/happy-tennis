import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtCard, AtNoticebar, AtActivityIndicator } from 'taro-ui'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ground: [3, 6],
      id: '~'
    }
  }
  config = {
    navigationBarTitleText: 'ACTIVITY'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {}

  componentDidShow() {
    const { id } = this.$router.params
    this.setState(state => ({ ...state, id }))
    console.warn('opening activity', id, this)
  }

  componentDidHide() {}
  handleChange(...x) {
    console.warn('handleChange', ...x)
  }
  handleGoto(target) {
    console.warn(target)
    Taro.navigateTo({
      url: '/pages/terms/index'
    })
  }
  onShareAppMessage(o) {
    console.warn('onShareAppMessage', o)
    return {
      title: '快乐网球召集',
      path: '/pages/activity/index?id=123'
    }
  }
  render() {
    return (
      <View className="activity">
        <View className="meta">
          {this.state.id || '-'}
          <AtNoticebar icon="volume-plus">地点:华侨城体育中心</AtNoticebar>
          <AtNoticebar>
            时间:
            {new Date().toLocaleString()}
          </AtNoticebar>
          <AtCard
            isFull
            title="场地"
            note={`活动场地 ${this.state.ground.join('、')} 号场`}
          >
            <View className="ground">
              {[2, 3, 6, 7].map(i => (
                <View
                  className={`ground-item${
                    this.state.ground.includes(i) ? ' active' : ''
                  }`}
                  key={i}
                >
                  {i}
                </View>
              ))}
            </View>
          </AtCard>
          <View className="actions">
            <Button open-type="share">发送召集令</Button>
          </View>
          <View className="divider" />
          <AtCard isFull title="报名">
            <AtActivityIndicator content="查询中" mode="center" />
            <View className="players">
              {[2, 3, 6, 7].map(i => (
                <View
                  className={`player${
                    this.state.ground.includes(i) ? ' active' : ''
                  }`}
                  key={i}
                >
                  {i}
                </View>
              ))}
            </View>
          </AtCard>
        </View>
      </View>
    )
  }
}

export default Index
