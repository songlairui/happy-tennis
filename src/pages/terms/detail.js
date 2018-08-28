import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtList, AtListItem, AtNoticebar } from 'taro-ui'

import '../index/index.less'

class Index extends Component {
  config = {
    navigationBarTitleText: 'TERM-DETAIL'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  render() {
    return (
      <View className="activity">
      </View>
    )
  }
}

export default Index
