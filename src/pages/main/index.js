import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtCard, AtList, AtListItem, AtProgress } from "taro-ui";

import "./index.less";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  config = {
    navigationBarTitleText: "MAIN"
  };

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handleChange(...x) {
    console.warn("handleChange", ...x);
  }
  handleGoto(target) {
    Taro.navigateTo({
      url: target
    });
  }
  render() {
    return (
      <View className="wrapper">
        <View className="userBar">
          <View className="figure">
            <View className="avatarPlace">
              <open-data type="userAvatarUrl" />
            </View>
          </View>
          <View className="nick-name">
            <open-data type="userNickName" />
          </View>
        </View>
        <View className="main">
          <View className="action create">
            <AtButton
              type="primary"
              onClick={this.handleGoto.bind(this, "/pages/activity/index")}
            >
              新建召集
            </AtButton>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
