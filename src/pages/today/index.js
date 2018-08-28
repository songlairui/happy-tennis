import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtList, AtListItem } from 'taro-ui'

import '../index/index.less'

class Index extends Component {
  config = {
    navigationBarTitleText: 'TODAY'
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
    return <View className="today" />
  }
}

export default Index
