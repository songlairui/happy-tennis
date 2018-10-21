import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Picker, Button } from '@tarojs/components'
import {
  AtButton,
  AtRadio,
  AtTimeline,
  AtIcon,
  AtActivityIndicator
} from 'taro-ui'
import * as api from '../../api'

import './create.less'

const today = new Date()
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
      id: '',
      form: {
        title: '快乐网球召集',
        location: '华侨城网球中心',
        date: `${today.getFullYear()}-${today.getMonth() +
          1}-${today.getDate()}`,
        detail: ''
      },
      period: [4, 2],
      timeArray: [[...timeArray], timeArray.slice(start)],
      loading: true
    }
  }
  inputChange(key, e) {
    const value = e.detail.value
    this.dateChange(key, value)
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
  dateChange(key, value) {
    console.warn('key', key, value)
    this.setState(state => {
      Object.assign(state.form, { [key]: value })
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
  async onSubmit() {
    const payload = {
      ...this.state.form,
      start: ((this.state.timeArray[0] || [])[this.state.period[0]] || {}).me,
      end: ((this.state.timeArray[1] || [])[this.state.period[1]] || {}).me
    }
    const { data } = await api.newActivity(payload)
    console.warn('submit', this, data)
    this.setState({ id: data.id })
  }
  onReset(event) {
    console.log(event)
  }

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.state.form.title,
      path: `/page/create/index?id=${this.state.id}`
    }
  }

  async componentDidShow() {
    const { id } = this.$router.params
    console.warn('opening activity', id, this)
    const newState = { loading: false }
    if (id) {
      newState.id = id
      const { data } = await api.getActivity(id).catch(console.error)
      console.info('activity', data)
    }
    this.setState(newState)
  }
  render() {
    return this.state.loading ? (
      <View className="wrapper">
        <AtActivityIndicator mode="center" />
      </View>
    ) : (
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
                onChange={this.inputChange.bind(this, 'date')}
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
        <View className="detail">
          <Input
            name="标题"
            title="练习内容"
            type="text"
            placeholder="点击填写训练内容、其他说明"
            value={this.state.form.detail}
            onChange={this.inputChange.bind(this, 'detail')}
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
        <View className="location-radio">
          {this.state.id && <Button open-type="share">召集</Button>}
          <AtButton onClick={this.onSubmit.bind(this)} formType="submit">
            🎾 确定 🎾
          </AtButton>
        </View>
        <AtButton onClick={this.onReset.bind(this)} formType="reset">
          重置
        </AtButton>{' '}
      </View>
    )
  }
}

export default Index
