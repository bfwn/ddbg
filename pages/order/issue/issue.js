// issue.js
const AV = require('../../../utils/av-weapp-min');
const PackInfo = require('../../../model/packinfo');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    realname:'',
    realname_placehold:'请输入姓名',
    realname_style:'',

    phone:'',
    phone_placehold:'请输入联系电话',
    phone_style:'',

    array_goAddr:['金唐','七里庄','航天桥','公主坟','北清路','东单北楼','东单南楼'],
    index_goAddr:0,

    array_arrAddr: ['金唐', '七里庄', '航天桥', '公主坟', '北清路', '东单北楼', '东单南楼'],
    index_arrAddr: 0,

    senddate:'',

    description:'',
    description_placehold:'请输入投递对象的描述',

    bonus:'',
    bonus_placehold:'可填写完成投递任务的奖励',

    lastTapDiffTime:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 真实姓名输入触发事件
   */
  bindInputName:function(e){
    console.log('realname输入变化，当前值为：', e.detail.value)
    this.setData({
      realname: e.detail.value
    })
  },

  /**
   * 联系电话输入触发事件
   */
  bindInputPhone:function(e){
    console.log('phone输入变化，当前值为：', e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 出发地选择器值改变触发事件
   */
  bindGoAddrChange:function(e){
    console.log('index_goAddr输入变化，当前值为', e.detail.value)
    this.setData({
      index_goAddr: e.detail.value,
    })
  },
  
  /**
   * 目的地选择器值改变触发事件
   */
  bindarrAddrChange: function (e) {
    console.log('index_arrAddr输入变化，当前值为', e.detail.value)
    this.setData({
      index_arrAddr: e.detail.value,
    })
  },

  /**
   *日期选择器值改变触发事件
   */
  bindSendDateChange:function(e){
    console.log('senddate输入变化，当前值为',e.detail.value)
    this.setData({
      senddate: e.detail.value,
    })
  },

  /**
   *物品描述输入完成后触发事件
   */
  bindInputDescription:function (e) {
    console.log('description输入变化，当前值为', e.detail.value)
    this.setData({
      description: e.detail.value,
    })
  },

  bindInputBonus: function (e) {
    console.log('bonus输入变化，当前值为', e.detail.value)
    this.setData({
      bonus: e.detail.value,
    })
  },
  

  bindIssueRequestBtn:function(e){
    var curTime = e.timeStamp;
    var lastTime = this.data.lastTapDiffTime;

    if (lastTime > 0 && (curTime - lastTime < 300)) {
      //两次时间间隔小于300毫秒，认为是双击事件
      console.log("===db tap");
      return;
    }
    this.setData({ lastTapDiffTime1: curTime });

    wx.showToast({
      title: '正在创建任务',
      icon: 'loading',
      duration: 3000
    });

    var realName = this.data.realname;
    var senderPhone = this.data.phone;
    var sendLocation = this.data.array_goAddr[this.data.index_goAddr];
    var desLocation = this.data.array_arrAddr[this.data.index_arrAddr];
    var sendDate = this.data.senddate;

    var content = this.data.description;
    var date = new Date(sendDate);

    console.log(date);
    console.log(content);

    var myPackInfo = new PackInfo();
    myPackInfo.set('realName', realName);
    myPackInfo.set('senderPhone', senderPhone);
    myPackInfo.set('sendLocation', sendLocation);
    myPackInfo.set('desLocation', desLocation);
    myPackInfo.set('sendDate', date);
    myPackInfo.set('content', content);
    myPackInfo.set('state', '0');

    myPackInfo.save().then(function (packInfo) {
      console.log('objectId is ' + packInfo.id);
      wx.switchTab({
        url: '../show/show',
        success: function (res) {
          // success
          setTimeout(function () {
            wx.showToast({
              title: '活动创建成功',
              icon: 'success',
              duration: 1000
            })
          }, 1000)
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }, function (error) {
      console.error(error);
    });

/*
    var acl = new AV.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(true);

    new PackInfo({
      'realName': realName,
      'senderPhone': senderPhone,
      'sendLocation': sendLocation,
      'desLocation': desLocation,
      'sendDate': sendDate,
      'content': content,
      'state':0
    }).setACL(acl).save().then((packinfo)=>{
      console.log('跳转');

      wx.switchTab({
        url: '../show/show',
        success: function (res) {
          // success
          setTimeout(function () {
            wx.showToast({
              title: '活动创建成功',
              icon: 'success',
              duration: 1000
            })
          }, 1000)
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    });
    */
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