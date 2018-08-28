import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtGrid, AtSegmentedControl } from 'taro-ui'
import './index.less'
import { switchClass } from '../../actions/terms'

@connect(
  ({ terms }) => ({
    terms
  }),
  dispatch => ({
    switchClass(t) {
      dispatch(switchClass(t))
    }
  })
)
class Index extends Component {
  constructor(props) {
    super(props)

    const easy = []
    const hard = []
    easy.length = 123
    hard.length = 104

    this.state = {
      detail: {
        easy: easy
          .fill(0)
          .map((__, i) => ({ value: `${i + 1}期` }))
          .reverse()
          .slice(0, 30),
        hard: hard
          .fill(0)
          .map((__, i) => ({ value: `${i + 1}期` }))
          .reverse()
          .slice(0, 30)
      }
    }
  }
  config = {
    navigationBarTitleText: '班级'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handleClick(...x) {
    console.warn('handleClick', ...x)
  }
  handleBack() {
    Taro.navigateBack()
  }
  handleTerm({ value }) {
    Taro.navigateTo({ url: `/pages/terms/detail?v=${parseInt(value)}` })
  }
  render() {
    return (
      <View className="terms">
        <AtSegmentedControl
          values={['黄埔', '西点']}
          onClick={this.props.switchClass}
          current={this.props.terms.current}
          fontSize="32"
        />
        {this.props.terms.current === 0 ? (
          <View className="tab-content">
            <AtGrid
              mode="rect"
              data={this.state.detail.easy}
              onClick={this.handleTerm}
            />
          </View>
        ) : null}
        {this.props.terms.current === 1 ? (
          <View className="tab-content">
            <AtGrid
              mode="rect"
              data={this.state.detail.hard}
              onClick={this.handleTerm}
            />
          </View>
        ) : null}
      </View>
    )
  }
}

export default Index
