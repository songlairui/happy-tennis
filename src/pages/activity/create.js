import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Picker } from '@tarojs/components'
import { AtButton, AtRadio, AtTimeline, AtIcon } from 'taro-ui'

import './create.less'

const timeArray = new Array(7).fill(0).map((__, i) => ({
  val: i + 16,
  me: `${i + 16}:00`
}))
const locations = [
  {
    label: '华侨城网球中心',
    value: '华侨城网球中心'
  },
  { label: '大学城体育场', value: '大学城体育场' },
  { label: '其他', value: '其他', desc: '待通知' }
]
class Index extends Component {
  constructor(props) {
    super(props)
    const start = 4 // 20:00
    this.state = {
      form: {
        title: '快乐网球召集',
        location: '华侨城网球中心',
        date: new Date().toLocaleDateString().replace(/\//g, '-'),
        description: ''
      },
      period: [4, 2],
      timeArray: [[...timeArray], timeArray.slice(start)]
    }
  }
  inputChange(key, e) {
    const value = e.detail.value
    this.setState(state => {
      Object.assign(state.form, { [key]: value })
      return state
    })
  }
  handleChange(key, value) {
    this.setState(state => {
      Object.assign(state.form, { [key]: value })
      return state
    })
  }
  stateChange(key, e) {
    const value = typeof e === 'string' ? e : e.detail.value
    this.setState(state => {
      Object.assign(state, { [key]: value })
      return state
    })
  }
  dataColChange(key, e) {
    const { column: changedColumn, value: currVal } = e.detail
    const nextColumn = changedColumn + 1
    const nextColRange = this.state.timeArray[nextColumn]
    const period = this.state.period
    const newNextRange = timeArray.slice(currVal)
    period[changedColumn] = currVal
    if (nextColRange) {
      if (period[nextColumn] > 0) {
        const nextColVal = nextColRange[period[nextColumn] || 0]
        const newIdx = newNextRange.indexOf(nextColVal)
        if (newIdx > -1) {
          period[nextColumn] = newIdx
        }
      }
      console.warn(period, newNextRange)
    }

    this.setState(state => {
      if (nextColRange) {
        state.timeArray[nextColumn] = newNextRange
      }
      state.period = period
      return state
    })
  }
  onSubmit(event) {
    console.log('e', event)
  }
  onReset(event) {
    console.log(event)
  }
  render() {
    return (
      <View className="wrapper">
        <View className="title">
          <Input
            type="text"
            placeholder="点击填写活动名称"
            value={this.state.form.title}
            onChange={this.inputChange.bind(this, 'title')}
          />
        </View>
        <View className="datetime">
          <View className="at-row">
            <View className="at-col">
              <Picker
                mode="date"
                onChange={this.stateChange.bind(this, 'date')}
              >
                <View className="date-picker">
                  <View className="day">{this.state.form.date.slice(5)}</View>
                  <View className="year">
                    {this.state.form.date.slice(0, 4)}
                  </View>
                </View>
              </Picker>
            </View>
            <View className="at-col">
              <Picker
                mode="multiSelector"
                rangeKey="me"
                onChange={this.stateChange.bind(this, 'period')}
                onColumnChange={this.dataColChange.bind(this, 'period')}
                range={this.state.timeArray}
                value={this.state.period}
              >
                <View className="time-picker">
                  <AtTimeline
                    items={[
                      {
                        title: (
                          (this.state.timeArray[0] || [])[
                            this.state.period[0]
                          ] || {}
                        ).me,
                        icon: 'clock'
                      },
                      {
                        title: (
                          (this.state.timeArray[1] || [])[
                            this.state.period[1]
                          ] || {}
                        ).me,
                        icon: 'clock'
                      }
                    ]}
                  />
                </View>
              </Picker>
            </View>
          </View>
        </View>
        <View />
        <View className="description">
          <Input
            name="标题"
            title="练习内容"
            type="text"
            placeholder="点击填写训练内容"
            value={this.state.form.description}
            onChange={this.inputChange.bind(this, 'description')}
          />
        </View>
        <View className="location">
          <AtIcon value="map-pin" size="20" color="#356" />
          <Text className="content">{this.state.form.location}</Text>
        </View>
        <View className="location-radio">
          <AtRadio
            options={locations}
            value={this.state.form.location}
            onClick={this.handleChange.bind(this, 'location')}
          />
        </View>
        <AtButton onSubmit={this.onSubmit.bind(this)} formType="submit">
          提交
        </AtButton>
        <AtButton onReset={this.onReset.bind(this)} formType="reset">
          重置
        </AtButton>
      </View>
    )
  }
}

export default Index
