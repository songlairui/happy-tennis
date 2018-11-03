import _ from 'lodash'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Picker, Button } from '@tarojs/components'
import {
  AtButton,
  AtRadio,
  AtTimeline,
  AtIcon,
  AtActivityIndicator
} from 'taro-ui'
import wsUtil from '../../utils/wsUtil'
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
const cache = {
  lastForm: {}
}

const wsActions = ['wander', 'join', 'bye', 'cancel', 'ask4off']
const userGroup = ['available', 'ask4off', 'traces', 'onlines']

const validId = id => !['', undefined, null].includes(id)

class Index extends Component {
  constructor(props) {
    super(props)
    const start = 4 // 20:00
    this.state = {
      client: wsUtil.genClient(),
      connected: false,
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
      loading: true,
      editMode: false,
      wxUsers: userGroup.reduce((r, k) => ((r[k] = []), r), {})
    }
  }
  async componentWillMount() {
    this.state.client.onConnect(() => {
      this.state.connected = true
    })
    this.state.client.onDisconnect(() => {
      this.state.connected = false
    })
  }
  async connect() {
    if (!this.state.connected) {
      this.state.connected = true
      await this.state.client.connect({
        auth: { headers: { authorization: Taro.getStorageSync('jwtInfo') } }
      })
    }
  }
  async componentDidMount() {
    console.info('set onUpdate')
    this.state.client.onUpdate = update => {
      console.info('update', update)
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
    this.setState({ loading: true })
    const newState = {}
    if (this.state.id) {
      if (!_.isEqual(cache.lastForm, this.state.form)) {
        await api.updateActivity(this.state.id, payload)
        api.report({ type: 'updateActivity', remark: 'this.state.id' })
      }
    } else {
      const activity = await api.newActivity(payload)
      newState.id = activity.id
      api.report({ type: 'newActivity', remark: '' })
    }
    newState.loading = false
    this.changeMode(newState)
  }
  changeMode(newState = {}) {
    if (!this.state.editMode) {
      cache.lastForm = _.cloneDeep(this.state.form)
    }
    this.setState({
      ...newState,
      editMode: !this.state.editMode
    })
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
      path: `/pages/activity/create?id=${this.state.id}`
    }
  }

  async componentDidShow() {
    console.info('didShow')
    await this.connect()
    const { id } = this.$router.params
    const newState = { loading: false, editMode: !validId(id) }
    if (id !== undefined) {
      const oldId = this.state.id
      newState.id = id
      const handler = act => update => {
        this.operate(act, update)
      }
      if (oldId !== id) {
        validId(oldId) &&
          wsActions.forEach(act => {
            this.state.client.unsubscribe(`/online/${oldId}/${act}`, null)
          })
          validId(id) &&
          wsActions.forEach(act => {
            this.state.client.subscribe(`/online/${id}/${act}`, handler(act))
          })
      }
      const activity = await api.getActivity(id).catch(console.error)

      if (activity) {
        const { title, location, date, detail } = activity
        newState.form = {
          title,
          location,
          date,
          detail
        }
        const [startIdx, endIdx] = ['start', 'end'].map(key =>
          Math.max(0, timeArray.findIndex(item => item.me === activity[key]))
        )
        newState.timeArray = [[...timeArray], timeArray.slice(startIdx)]
        newState.period = [startIdx, endIdx - startIdx]
      }
    }
    this.setState(newState)
    this.act('wander')
  }
  async componentWillUnmount() {
    const { id } = this.state
    console.info('umount', id)
    this.act('bye')

    setTimeout(() => {
      this.state.client.unsubscribe(`/online/${id}/wander`, null)
      this.state.client.disconnect()
    }, 500)
  }
  async componentDidHide() {
    console.info('componentDidHide')
  }
  operate(act, update) {
    let {
      wxUsers: { available, ask4off, traces, onlines }
    } = this.state
    const append = (arr, user) => {
      const newArr = arr.filter(({ id }) => id !== user.id)
      newArr.push(user)
      arr.splice(0, Infinity, ...newArr)
    }
    const remove = (arr, user) => {
      const newArr = arr.filter(({ id }) => id !== user.id)
      arr.splice(0, Infinity, ...newArr)
    }
    switch (act) {
      case 'wander':
        append(onlines, update)
        append(traces, update)
      case 'bye':
        remove(onlines, update)
        break
      case 'join':
        append(available, update)
        remove(ask4off, update)
        break
      case 'cancel':
        remove(available, update)
        break
      case 'ask4off':
        remove(available, update)
        append(ask4off, update)
        break
    }
    this.setState({ wxUsers: { available, ask4off, traces, onlines } })
  }
  async act(type) {
    const { id } = this.state
    if (validId(id)) {
      this.state.client.request(`/activity/${id}/event/${type}`)
    }
  }
  render() {
    return (
      <View className="wrapper">
        {this.state.loading && (
          <View className="mask">
            <AtActivityIndicator mode="center" />
          </View>
        )}
        <View className="title">
          {this.state.editMode ? (
            <Input
              type="text"
              placeholder="点击填写活动名称"
              value={this.state.form.title}
              onChange={this.inputChange.bind(this, 'title')}
            />
          ) : (
            <Text>{this.state.form.title}</Text>
          )}
        </View>
        <View className="datetime">
          <View className="at-row">
            <View className="at-col">
              {this.state.editMode ? (
                <Picker
                  className="date-picker"
                  mode="date"
                  onChange={this.inputChange.bind(this, 'date')}
                >
                  <View className="day">{this.state.form.date.slice(5)}</View>
                  <View className="year">
                    {this.state.form.date.slice(0, 4)}
                  </View>
                </Picker>
              ) : (
                <View className="date-picker">
                  <View className="day">{this.state.form.date.slice(5)}</View>
                  <View className="year">
                    {this.state.form.date.slice(0, 4)}
                  </View>
                </View>
              )}
            </View>
            <View className="at-col">
              {this.state.editMode ? (
                <Picker
                  className="time-picker"
                  mode="multiSelector"
                  rangeKey="me"
                  onChange={this.stateChange.bind(this, 'period')}
                  onColumnChange={this.dataColChange.bind(this, 'period')}
                  range={this.state.timeArray}
                  value={this.state.period}
                >
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
                </Picker>
              ) : (
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
              )}
            </View>
          </View>
        </View>
        <View />
        <View className="detail">
          {this.state.editMode ? (
            <Input
              name="标题"
              title="练习内容"
              type="text"
              placeholder="点击填写训练内容、其他说明"
              value={this.state.form.detail}
              onChange={this.inputChange.bind(this, 'detail')}
            />
          ) : (
            <Text>{this.state.form.detail || '多球练习'}</Text>
          )}
        </View>
        {this.state.editMode ? (
          <View className="location-radio">
            <AtRadio
              options={locations}
              value={this.state.form.location}
              onClick={this.handleChange.bind(this, 'location')}
            />
          </View>
        ) : (
          <View className="location">
            <AtIcon value="map-pin" size="20" color="#356" />
            <Text className="content">{this.state.form.location}</Text>
          </View>
        )}
        {!this.state.editMode &&
          this.state.id && (
            <View className="share-block">
              <Button className="share" open-type="share">
                召集
              </Button>
              {wsActions.map(actName => (
                <Button
                  key={actName}
                  className="share"
                  onClick={this.act.bind(this, actName)}
                >
                  {actName}
                </Button>
              ))}
            </View>
          )}

        <View className="users available">
          {this.state.wxUsers.available.map(user => (
            <View key={user.id} className="user">
              {user.id}
            </View>
          ))}
        </View>
        <View className="users ask4off">
          {this.state.wxUsers.ask4off.map(user => (
            <View key={user.id} className="user">
              {user.id}
            </View>
          ))}
        </View>
        <View className="users traces">
          {this.state.wxUsers.traces.map(user => (
            <View key={user.id} className="user">
              {user.id}
            </View>
          ))}
        </View>
        <View className="form-item fixed">
          {this.state.editMode ? (
            <AtButton onClick={this.onSubmit.bind(this)}>🎾 确定 🎾</AtButton>
          ) : (
            <AtButton onClick={this.changeMode.bind(this)}>修改</AtButton>
          )}
        </View>
      </View>
    )
  }
}

export default Index
