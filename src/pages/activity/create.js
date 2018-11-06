import _ from 'lodash'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Picker, Button, Image } from '@tarojs/components'
import {
  AtButton,
  AtRadio,
  AtTimeline,
  AtIcon,
  AtActivityIndicator,
  AtNavBar
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

function dateString() {
  const year = today.getFullYear()
  const month = today.getMonth() + 1 + 100
  const day = today.getDate() + 100
  return `${year}-${('' + month).slice(1)}-${('' + day).slice(1)}`
}

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
        date: dateString(),
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
        if (validId(id)) {
          console.info('startSubscribe')
          wsActions.forEach(act => {
            this.state.client.subscribe(`/online/${id}/${act}`, handler(act))
          })
          await Promise.all(
            userGroup.map(async group => {
              const users = await api.getActivityPlayer(id, group)()
              this.setState(state => {
                const currentIds = state.wxUsers[group].map(user => user.id)
                state.wxUsers[group] = [
                  ...state.wxUsers[group],
                  ...users.filter(user => !currentIds.includes(user.id))
                ]
                return state
              })
            })
          )
        }
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
  back() {
    Taro.navigateBack()
  }
  home() {
    Taro.navigateTo({
      url: '/pages/main/index'
    })
  }
  render() {
    return (
      <View className="wrapper">
        <AtNavBar
          onClickLeftIcon={this.back.bind(this)}
          onClickRgIconSt={this.home.bind(this)}
          color="#000"
          title={this.state.editMode ? '发起活动' : this.state.form.title}
          rightFirstIconType="home"
          leftText="返回"
          leftIconType="chevron-left"
        />
        {this.state.loading && (
          <View className="mask">
            <AtActivityIndicator mode="center" />
          </View>
        )}
        {this.state.editMode && (
          <View className="title editable">
            <Input
              type="text"
              placeholder="点击填写活动名称"
              value={this.state.form.title}
              onChange={this.inputChange.bind(this, 'title')}
            />
          </View>
        )}
        <View className="datetime">
          <View className="at-row">
            <View className="at-col activity-date">
              {this.state.editMode ? (
                <Picker
                  className="date-picker"
                  mode="date"
                  onChange={this.inputChange.bind(this, 'date')}
                >
                  <View className="month">
                    {this.state.form.date.slice(5, 7)}月
                  </View>
                  <View className="day">
                    {this.state.form.date.slice(8, 10)}日
                  </View>
                </Picker>
              ) : (
                <View className="desc">
                  <View className="month">
                    {this.state.form.date.slice(5, 7)} 月
                  </View>
                  <View className="day">
                    {this.state.form.date.slice(8, 10)} 日
                  </View>
                </View>
              )}
            </View>
            {this.state.editMode ? (
              <View className="at-col">
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
              </View>
            ) : (
              <View className="at-col">
                <View className="desc">
                  <View>{this.state.form.detail || '多球练习'}</View>
                  <View>
                    {
                      (
                        (this.state.timeArray[0] || [])[this.state.period[0]] ||
                        {}
                      ).me
                    }
                    -
                    {
                      (
                        (this.state.timeArray[1] || [])[this.state.period[1]] ||
                        {}
                      ).me
                    }
                  </View>
                  <View>
                    <AtIcon value="map-pin" size="20" color="#356" />
                    <Text className="content">{this.state.form.location}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        <View />
        {this.state.editMode && (
          <View className="detail editable">
            <Input
              name="标题"
              title="练习内容"
              type="text"
              placeholder="点击填写训练内容、其他说明"
              value={this.state.form.detail}
              onChange={this.inputChange.bind(this, 'detail')}
            />
          </View>
        )}
        {this.state.editMode && (
          <View className="location-radio">
            <AtRadio
              options={locations}
              value={this.state.form.location}
              onClick={this.handleChange.bind(this, 'location')}
            />
          </View>
        )}
        {!this.state.editMode &&
          this.state.id && (
            <View className="user-groups">
              {[
                ['available', 'join', '已加入'],
                ['ask4off', 'ask4off', '请假']
              ].map((m, idx) => (
                <View
                  className={`users ${m[0]}`}
                  key={idx}
                  onClick={this.act.bind(this, m[1])}
                >
                  <Text className="label">{m[2]}</Text>
                  {this.state.wxUsers[m[0]].map(user => (
                    <View key={user.id} className="user">
                      <Image
                        style="width: 100%;height: 100%;"
                        src={user.avatarUrl}
                      />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

        {!this.state.editMode &&
          this.state.id && (
            <View className="share-block">
              <AtButton type="primary" open-type="share" size="normal" circle>
                <AtIcon value="share" size="16" color="#FFE" />
                {' 分享'}
              </AtButton>
              {/* {wsActions.map(actName => (
                <Button
                  key={actName}
                  className="share"
                  onClick={this.act.bind(this, actName)}
                >
                  {actName}
                </Button>
              ))} */}
            </View>
          )}

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
