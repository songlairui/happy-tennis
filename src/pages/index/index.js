import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtCard, AtList, AtListItem, AtProgress } from 'taro-ui'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      day: new Date().getDay()
    }
  }
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
        <AtCard note="" extra="sz-sport" title="今天" isFull>
          <View className="terms">
            <View
              className={`easy${
                [1, 3].includes(this.state.day) ? ' active' : ''
              }`}
            >
              黄埔: 123 期 (2/8) 课
              <AtProgress
                percent="25"
                status={[1, 3].includes(this.state.day) ? 'progress' : ''}
              />
            </View>
            <View
              className={`hard${
                [2, 4].includes(this.state.day) ? ' active' : ''
              }`}
            >
              西点: 104 期 (1/8) 课
              <AtProgress
                percent="12"
                status={[2, 4].includes(this.state.day) ? 'progress' : ''}
              />
            </View>
          </View>
          <View className="divider" />
          <AtButton
            icon="clock"
            type="primary"
            size="normal"
            onClick={this.handleGoto.bind(this, '/pages/activity/index')}
          >
            GETHER
          </AtButton>
        </AtCard>
        <AtCard note="----" extra="sz-sport" title="welcome" isFull>
          <AtList>
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
