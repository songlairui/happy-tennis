import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtList, AtListItem } from 'taro-ui'
import * as api from '../../api'

import './index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = { activities: [] }
  }
  config = {
    navigationBarTitleText: 'ALL ACTIVITIES'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  async componentWillMount() {
    const activities = await api.getActivities()
    this.setState({ activities })
  }
  handleClick(id) {
    Taro.navigateTo({
      url: `/pages/activity/create?id=${id}`
    })
  }
  async handleGoto(target) {
    Taro.navigateTo({
      url: target
    })
  }
  render() {
    return (
      <View>
        <AtButton
          type="secondary"
          onClick={this.handleGoto.bind(this, '/pages/main/index')}
        >
          返回
        </AtButton>
        <AtList>
          {this.state.activities.map(activity => (
            <AtListItem
              key={activity.id}
              title={activity.title}
              onClick={this.handleClick.bind(this, activity.id)}
              arrow="right"
              note={activity.detail}
              extraText={activity.id}
            />
          ))}
        </AtList>
      </View>
    )
  }
}

export default Index
