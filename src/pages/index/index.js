import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtList, AtListItem } from 'taro-ui'

import './index.less'

class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
    navigationStyle: 'custom'
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
    Taro.navigateTo({
      url: target
    })
  }
  render() {
    return (
      <View className="index">
        <AtCard note="----" extra="sz-sport" title="welcome" isFull>
          <AtList>
            <AtListItem
              title="活动召集"
              note="活动召集"
              onClick={this.handleGoto.bind(this, '/pages/activity/index')}
            />
            <AtListItem title="新班级" note="新班级" arrow="right" />
            <AtListItem
              arrow="right"
              note="黄埔班、西点班"
              title="班级列表"
              extraText="详情"
              onClick={this.handleGoto.bind(this, '/pages/terms/index')}
            />
          </AtList>
        </AtCard>
      </View>
    )
  }
}

export default Index
