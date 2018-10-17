import Taro, { Component } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import {
  AtButton,
  AtCard,
  AtList,
  AtListItem,
  AtProgress,
  AtToast
} from "taro-ui";

import "./index.less";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canIUse: Taro.canIUse("button.open-type.getUserInfo"),
      toast: {
        visible: false,
        text: ""
      }
    };
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
  handleGetUserInfo(e) {
    const userInfo = e.detail.userInfo;
    if (!userInfo) {
      this.setState({ toast: { visible: true, text: "授权后才能参加活动" } });
    }
  }
  handleClose = () => {
    console.warn("close");
    this.setState({
      toast: { visible: false }
    });
  };
  render() {
    return (
      <View className="wrapper">
        <AtToast
          isOpened={this.state.toast.visible}
          text={this.state.toast.text}
          status="error"
          onClose={this.handleClose}
        />
        <View className="userBar">
          <View className="figure">
            <View className="avatarPlace">
              <open-data type="userAvatarUrl" />
            </View>
          </View>
          <View className="nick-name">
            <open-data type="userNickName" />
          </View>
          <View className="auth">
            {this.state.canIUse ? (
              <Button
                open-type="getUserInfo"
                onGetUserInfo={this.handleGetUserInfo}
              >
                授权登录
              </Button>
            ) : (
              <View>请升级微信版本</View>
            )}
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
