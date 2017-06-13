// show.js
const AV = require('../../../utils/av-weapp-min');
const PackInfo = require('../../../model/packinfo');

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    packinfos: [],
    idx_package: 0,
    hispackinfos: [],
    idx_hispackage: 0,

    //userImg: "",   //发单者头像
    //userInfo: {},

    lastTapDiffTime: 0,  //记录刷新的上一次点击时间 
  },

  bindGrabOrder: function(e) {
    console.log("当前选中的：" + e.currentTarget.dataset.num);

    this.data.idx_package = e.currentTarget.dataset.num;
    app.globalData.packinfos = this.data.packinfos[this.data.idx_package]
    console.log("任务id：" + this.data.packinfos[this.data.idx_package].objectId + "，发包人：" + this.data.packinfos[this.data.idx_package].realName);
    console.log("发包人头像url：" + this.data.packinfos[this.data.idx_package].sendImagUrl);

   // 更新全局的任务id
    app.globalData.currentTaskId = this.data.packinfos[this.data.idx_package].objectId;

    console.log("全局变量：" + app.globalData.currentTaskId);

   // 跳转到抢任务页面
    wx.navigateTo({
      url: '../grab/grab',
    })
  },

  bindHisOrder: function (e) {
    console.log("当前选中的：" + e.currentTarget.dataset.num);

    this.data.idx_hispackage = e.currentTarget.dataset.num;
    console.log("任务id：" + this.data.hispackinfos[this.data.idx_hispackage].objectId + "，发包人：" + this.data.hispackinfos[this.data.idx_hispackage].realName+",投递人为" + this.data.hispackinfos[this.data.idx_hispackage].delName);
    var titletext = this.data.hispackinfos[this.data.idx_hispackage].delName + "已完成任务,获得" + this.data.hispackinfos[this.data.idx_hispackage].bonus + "!"
    // 弹窗
    /*wx.showToast({
      title: titletext,
      icon: 'success',
      duration: 2000,
      mask: 'true'
    })*/
    wx.showModal({
      title: '任务已完成',
      content: "恭喜" + this.data.hispackinfos[this.data.idx_hispackage].delName + "获得" + this.data.hispackinfos[this.data.idx_hispackage].bonus + "!",
      showCancel: false,
    })
  },

  loadPacks: function () {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 3000,
      mask: 'true'
    });

    //查询当前有效的包裹信息
    var that = this;
    var l = [];
    new AV.Query('PackInfo')
      .equalTo('state', '0')
      .descending('createdAt')
      .find()
      .then(function (t) {
        console.log("待接单包裹共"+t.length+"件")

        for (var i = 0; i < t.length; i++) {
          console.log("第" + i + "件包裹为" + t[i].get('content') + ",发件人为" + t[i].get('realName'));
          if (!(t[i].get('sendDate'))) {
            t[i].sendDate = t[i].get('createdAt');
          } 
          var curdate = new Date();
          var deldate = t[i].get('sendDate');
          console.log("当前时间:" + curdate.valueOf() + ";派件时间:" + deldate.valueOf() );
          if (curdate.valueOf() > (deldate.valueOf() + 24*3600*1000) ) {
            console.log("当前时间:" + curdate.toLocaleDateString() + "大于派件时间:" + deldate.toLocaleDateString() + ",订单已经失效!");
            continue;
          }
            l = l.concat([{
              wxName: t[i].get('wxName'),
              updatedAt: t[i].get('updatedAt').toLocaleDateString() + " " + t[i].get('updatedAt').toLocaleTimeString(),
              state: t[i].get('state'),
              senderPhone: t[i].get('senderPhone'),
              sendLocation: t[i].get('sendLocation'),
              sendDate: t[i].get('sendDate').toLocaleDateString(),
              realName: t[i].get('realName'),
              objectId: t[i].get('objectId'),
              desLocation: t[i].get('desLocation'),
              delName: t[i].get('delName'),              
              createdAt: t[i].get('createdAt').toLocaleDateString() + " " + t[i].get('createdAt').toLocaleTimeString(),
              content: t[i].get('content'),
              bonus: t[i].get('bonus'),
              sendImagUrl: t[i].get('sendImagUrl'),
              delImagUrl: t[i].get('delImagUrl'),
            }]);

        }
        that.setData({
          packinfos: l,
        })

      }).catch(console.error);
    setTimeout(function () {
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })
    }, 3000)

    //查询历史的包裹信息
    var hisl = [];
    new AV.Query('PackInfo')
      .equalTo('state', '1')
      .descending('createdAt')
      .find()
      .then(function (t) {
        console.log("已完成包裹共" + t.length + "件")

        for (var i = 0; i < t.length; i++) {
          if (!(t[i].get('bonus'))) {
            t[i].bonus = "神马木有";
          } 
          if (!(t[i].get('sendDate'))) {
            t[i].sendDate = t[i].get('createdAt');
          } 
          console.log("第" + i + "件包裹为" + t[i].get('content') + ",发件人为" + t[i].get('realName') + ",投递人为" + t[i].get('delName'))
          hisl = hisl.concat([{
            wxName: t[i].get('wxName'),
            updatedAt: t[i].get('updatedAt').toLocaleDateString() + " " + t[i].get('updatedAt').toLocaleTimeString(),
            state: t[i].get('state'),
            senderPhone: t[i].get('senderPhone'),
            sendLocation: t[i].get('sendLocation'),
            sendDate: t[i].get('sendDate').toLocaleDateString(),
            realName: t[i].get('realName'),
            objectId: t[i].get('objectId'),
            desLocation: t[i].get('desLocation'),
            delName: t[i].get('delName'),
            createdAt: t[i].get('createdAt').toLocaleDateString() + " " + t[i].get('createdAt').toLocaleTimeString(),
            content: t[i].get('content'),
            bonus: t[i].get('bonus'),
            sendImagUrl: t[i].get('sendImagUrl'),
            delImagUrl: t[i].get('delImagUrl'),
          }]);
             
        }
        that.setData({
          hispackinfos: hisl
        })
        app.globalData.hispackinfos = that.data.hispackinfos;
      }).catch(console.error);
    setTimeout(function () {
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })
    }, 3000)


  },


  loginAndFetchPackinfos: function() {
    /*
    return new AV.Query('PackInfo')
      .descending('createdAt')
      .find()
      .then(this.setPackinfos)
      .catch(console.error);
    */
    console.log("获取宝贝信息...");
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user =>
      user ? user : AV.User.loginWithWeapp()
      ).then((user) => {
        console.log('uid', user.id);
        return new AV.Query(PackInfo)
          //.equalTo('user', AV.Object.createWithoutData('User', user.id))
          .descending('createdAt')
          .find()
          .then(this.setPackinfos)
      }).catch(error => console.error(error.message));
    
  },

  setPackinfos: function (packinfos) {
    //const activeTodos = todos.filter(todo => !todo.done);
    console.log("setPackinfos...");
    this.setData({
      packinfos,
      //activeTodos,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad...');
    //todo 替换为发单人头像. test,使用本地头像测试用
    //var that = this
    //调用应用实例的方法获取全局数据,（微信id，头像url，昵称等）
    /*wx.getUserInfo({
      success: function (res) {
        that.setData({
          userImg: res.userInfo.avatarUrl
        })
      }
    })
    console.log("userImg:" + that.data.userImg);*/
    //todo end

    //this.loginAndFetchPackinfos();
    this.loadPacks();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow...');
    //this.loadPacks();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉刷新...')
    var curTime = Date.now();
    var lastTime = this.data.lastTapDiffTime;

    if (lastTime > 0 && (curTime - lastTime < 5000)) {
      //两次时间间隔小于30000毫秒，认为是连击事件
      console.log("连续刷新时间在5s内,暂不刷新");
      return;
    }
    this.setData({ lastTapDiffTime: curTime });

    wx.showNavigationBarLoading();
    //this.loginAndFetchPackinfos();
    this.loadPacks();
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})