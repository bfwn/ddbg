const SERVER = require('./utils/av-weapp-min');
SERVER.init({
  appId: '6JAvVMjryBT6GenIU4esHw7o-gzGzoHsz',
  appKey: 'OaHU1PVUnIff2RmC5PBvKi7x',
});

App({
  onLaunch: function () {
    this.getUserInfo();
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            });
          }
          else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    currentTaskId: 0,
    packinfos: [],
    currentNo: null,
    hispackinfos: [],
  }
})