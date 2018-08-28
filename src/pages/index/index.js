import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtCard, AtList, AtListItem, AtProgress } from 'taro-ui'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      day: new Date().getDay(),
      title: '今天'
    }
  }
  config = {
    navigationBarTitleText: 'TODAY'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {}

  componentDidShow() {
    this.setState(state => ({
      ...state,
      title: `星期${state.day.toLocaleString('zh-Hans-CN-u-nu-hanidec')}`
    }))
  }

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
        <AtCard note="" extra="SZ-SPORT" title={this.state.title} isFull>
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
        <AtCard title="MORE" isFull>
          <AtList>
            <AtListItem
              arrow="right"
              note="黄埔班、西点班"
              title="班级列表"
              onClick={this.handleGoto.bind(this, '/pages/terms/index')}
            />
            <AtListItem title="报名" extraText="新班级" arrow="right" />
          </AtList>
        </AtCard>
      </View>
    )
  }
}

export default Index
