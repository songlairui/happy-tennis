import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTimeline, AtCard, AtGrid } from 'taro-ui'

import '../index/index.less'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '第...期',
      items: [],
      players: [
        'badco',
        'xiaoyu',
        'wuli more',
        'larry',
        'lulu',
        'li-yan-hong',
        'andy',
        'ivy',
        'Ding'
      ].map(value => ({
        value
      }))
    }
  }
  config = {
    navigationBarTitleText: 'TERM-DETAIL'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillMount() {
    console.log('componentWillMount', this.$router.params)
    const { v } = this.$router.params
    this.setState(() => ({
      title: `第${v}期`,
      num: v,
      items: [, , , , , , , ,].fill(0).map((__, i) => ({
        title: `第${i + 1}课`,
        content: ['2018-07-08'],
        icon: 'check-circle'
      }))
    }))
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  render() {
    return (
      <View className="activity">
        <AtCard title={this.state.title} isFull>
          <AtTimeline pending items={this.state.items} />
        </AtCard>
        <AtCard title="PLAYER" isFull>
          <AtGrid mode="rect" data={this.state.players} />
        </AtCard>
      </View>
    )
  }
}

export default Index
