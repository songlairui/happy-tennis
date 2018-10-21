import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'
import configStore from './store'
import './app.less'

if (process.env.TARO_ENV === 'weapp') {
  require('taro-ui/dist/weapp/css/index.css')
} else if (process.env.TARO_ENV === 'h5') {
  require('taro-ui/dist/h5/css/index.css')
}

const store = configStore()

class App extends Component {
  config = {
    pages: [
      'pages/main/index',
      'pages/activity/create',
      'pages/activity/all',
      'pages/activity/index',
      'pages/index/index',
      'pages/terms/index',
      'pages/terms/detail',
      'pages/today/index'
    ],
    window: {
      // navigationStyle: 'custom',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      navigationStyle: 'custom'
    }
  }

  componentDidMount() {}

  componentDidShow() {
    console.warn('App onShow', this.$router)
  }

  componentDidHide() {}

  componentCatchError() {}

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
