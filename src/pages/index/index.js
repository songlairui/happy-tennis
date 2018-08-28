import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtNavBar, AtList, AtListItem } from 'taro-ui'

import './index.less'

class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
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
      <View className="index">
        <View className="navTop" />
        <AtNavBar color="#000" title="TENNIS" leftText="SZ" />
        <View className="divider" />
        <AtCard note="via" extra="sz-sport" title="功能列表">
          <AtList>
            <AtListItem title="活动召集" note="活动召集" />
            <AtListItem title="新班级" note="新班级" arrow="right" />
            <AtListItem
              arrow="right"
              note="黄埔班、西点班"
              title="班级列表"
              extraText="详情"
              onClick={this.handleGoto}
            />
          </AtList>
        </AtCard>
      </View>
    )
  }
}

export default Index
