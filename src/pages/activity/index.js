import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtNoticebar, AtActivityIndicator } from 'taro-ui'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ground: [3, 6]
    }
  }
  config = {
    navigationBarTitleText: 'ACTIVITY'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {}

  componentDidShow() {}

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
  render() {
    return (
      <View className="activity">
        <View className="meta">
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
