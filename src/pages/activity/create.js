import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtRadio, AtTimeline } from 'taro-ui'

import './create.less'

const timeArray = new Array(7).fill(0).map((__, i) => ({
  val: i + 16,
  me: `${i + 16}:00`
}))

class Index extends Component {
  constructor(props) {
    super(props)
    const start = 4 // 20:00
    this.state = {
      form: {
        title: '快乐网球召集',
        location: 'default',
        date: new Date().toLocaleDateString().replace(/\//g, '-'),
        description: ''
      },
      period: [4, 2],
      timeArray: [[...timeArray], timeArray.slice(start)]
    }
  }

  handleChange(key, value) {
    console.warn({ key, value })
    this.setState(state => {
      Object.assign(state.form, { [key]: value })
      return state
    })
  }
  dateChange(key, e) {
    const value = e.detail.value
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
    console.log(event)
  }
  onReset(event) {
    console.log(event)
  }
  render() {
    return (
      <View className="wrapper">
        <AtForm
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <AtInput
            name="标题"
            title="标题"
            type="text"
            placeholder="快乐网球召集"
            value={this.state.form.title}
            onChange={this.handleChange.bind(this, 'title')}
          />
          <View>
            <Text className="form-item">活动时间：</Text>
            <View className="date-picker">
              <Picker mode="date" onChange={this.dateChange.bind(this, 'date')}>
                <View className="picker">{this.state.form.date}</View>
              </Picker>
            </View>
            <View className="time-picker">
              <Picker
                mode="multiSelector"
                rangeKey="me"
                onChange={this.dateChange.bind(this, 'period')}
                onColumnChange={this.dataColChange.bind(this, 'period')}
                range={this.state.timeArray}
                value={this.state.period}
              >
                <View className="at-row">
                  <View className="at-col">
                    <AtTimeline
                      items={[
                        {
                          title: (
                            (this.state.timeArray[0] || [])[
                              this.state.period[0]
                            ] || {}
                          ).me,
                          icon: 'clock'
                        }
                      ]}
                    />
                  </View>
                  <View className="at-col">
                    <AtTimeline
                      items={[
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
                </View>
              </Picker>
            </View>
          </View>
          <View>
            活动地点：
            <AtRadio
              options={[
                {
                  label: '华侨城网球中心',
                  value: 'default'
                },
                { label: '大学城体育场', value: 'daxuecheng' },
                { label: '其他', value: 'other', desc: '待通知' }
              ]}
              value={this.state.form.location}
              onClick={this.handleChange.bind(this, 'location')}
            />
          </View>

          <AtInput
            name="标题"
            title="练习内容"
            type="text"
            placeholder="第n课、对拉练习"
            value={this.state.form.description}
            onChange={this.handleChange.bind(this, 'description')}
          />
          <AtButton formType="submit">提交</AtButton>
          <AtButton formType="reset">重置</AtButton>
        </AtForm>
      </View>
    )
  }
}

export default Index
