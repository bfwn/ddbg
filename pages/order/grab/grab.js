// grab.js
const AV = require('../../../utils/av-weapp-min');
const PackInfo = require('../../../model/packinfo');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: "",
    myOrder: [],
    //stat: "X",
    //name: "请输入姓名",
    name: '',
    name_placehold: '请输入姓名',
    name_style: '',
    userImg: "",
  },
  /*
  *给信息发布者打电话
  */
  bindCall: function (e) {
    var iphone = e.currentTarget.dataset.num;
    console.log("----phone :" + iphone);

    if (iphone != null) {
      wx.makePhoneCall({
        phoneNumber: iphone
      })
    }
  },
  /**
   * 接单人姓名输入
   */
  bindInputName: function (e) {

    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 返回触发
   */
  bindBackBtn: function (e) {
    console.log("返回上一级页面");

    wx.navigateBack();
  },
  /*
   *检查名字是否为空，为空提醒
   */
  checkName: function () {
    
    if (!(this.Trim(this.data.name, 'g'))) {
      this.setData({
        name_style: 'border:2rpx solid red',
        name_placehold: '请留姓名',
      })
      return false;
    } else {
      this.setData({
        name_style: 'border:0rpx',
      })
      return true;
    }
  },
  /**
   * 接单触发
   */
  bindAcceptBtn: function (e) {
    console.log('触发接单按钮')
    var that = this;

    var dName = this.data.name;
    /**
     * 本地存储接单人姓名
     */
    wx.setStorageSync('dName', this.data.name);

    if (!this.checkName()) {
      //如果名字为空
      return;
    }

    //弹出提示框，提示是否接单
    wx.showModal({
      title: '确认接单',
      content: '感谢您提供投递服务，请确认是否接单',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {//用户点击确定-start
          console.log('用户点击接单')
          //teamsts置Y 
          new AV.Query(PackInfo)
            .equalTo('objectId', app.globalData.currentTaskId)
            .descending('createdAt')
            .find()
            .then((t) => {
              console.log(t[0].get('state'));
              if (t[0].get('state') == '1') {
                wx.showModal({
                  title: '无法接单',
                  content: '已有同学接单',
                  showCancel: false
                })
                return;
              }
              else {
                //更新包裹状态
                t[0].set('state', '1').save();
                //获取并更新接单人
                t[0].set('delName', dName).save();
                t[0].set('delImagUrl', that.data.userImg).save();

                wx.showModal({
                  title: '接单成功',
                  content: '感谢' + dName + '提供服务,大赞！',
                  showCancel: false,
                  //页面定向到信息展示页面
                  success: function (res) {
                    if (res.confirm) {
                      console.log("跳转回show页面")
                      wx.switchTab({
                        url: '../show/show',
                      })
                    }
                  }
                })
              }
            }).catch(console.error);
        }//用户点击确定-end
        else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },

  /*
    fetchMyOrder: function () {
      return AV.Promise.resolve(AV.User.current()).then(user =>
        user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
      ).then(user =>
        user ? user : AV.User.loginWithWeapp()
        ).then((user) => {
          console.log('uid', user.id);
          return new AV.Query(PackInfo)
            .equalTo('objectId', this.data.orderId)
            .descending('createdAt')
            .find()
            .then(this.getOrderStat)
        }).catch(error => console.error(error.message));
    },
  
    getOrderStat: function (stat) {
      this.setData({
        stat,
      });
      //    console.log("我要抢的任务 发包人是：" + this.data.myOrder[0].realName);
      //    console.log("我要抢的任务 宝贝是：" + this.data.myOrder[0].content);
    },*/

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setData({ orderId: app.globalData.currentTaskId });
    console.log("全局变量测试：" + app.globalData.packinfos.realName);
    this.setData({ myOrder: app.globalData.packinfos });

    //this.fetchMyOrderStat();
    //console.log("包裹状态：" + this.data.stat);

    /**
     * 取本地存储的接单人姓名
     */
    var ddName = wx.getStorageSync('dName');
    this.setData({
      name: (this.Trim(ddName, 'g'))
    })

    console.log(app.globalData.userInfo);
    this.setData({ userImg: app.globalData.userInfo.avatarUrl });
    /*
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              //userInfo: res.userInfo,
              userImg: res.userInfo.avatarUrl
    
            })
          }
        })*/
  },

  Trim: function (str, is_global) {

    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() == "g") {
      result = result.replace(/\s/g, "");
    }
    return result;
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