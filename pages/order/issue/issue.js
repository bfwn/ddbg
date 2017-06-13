// issue.js
const AV = require('../../../utils/av-weapp-min');
const PackInfo = require('../../../model/packinfo');
var app = getApp();

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
    index_goAddr:2,

    array_arrAddr: ['金唐', '七里庄', '航天桥', '公主坟', '北清路', '东单北楼', '东单南楼'],
    index_arrAddr: 0,

    arrAddr_reminder:'',
    arrAddr_reminder_style:'',

    senddate:'',
    senddate_style:'color:#999999;margin-right:20rpx;',
    senddate_placehold_style: 'color:grey;',
    senddate_placehold:'',

    description:'',
    description_placehold:'请输入投递对象的描述',

    bonus:'',
    bonus_placehold:'可填写完成投递任务的奖励',

    lastTapDiffTime:0,

    wxname:'',
    avatarurl:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var senddatedefault = this.getAdjustedFormaDate(date, 1);
    this.setData({
      wxname: app.globalData.userInfo.nickName,
      avatarurl: app.globalData.userInfo.avatarUrl,
      senddate: senddatedefault,
    });

  },

  /**
   * 真实姓名输入触发事件
   */
  bindInputName:function(e){
    console.log('realname输入变化，当前值为：', e.detail.value)
    this.setData({
      realname: e.detail.value,
      realname_style: '',
    })
  },

  /**
   * 联系电话输入触发事件
   */
  bindInputPhone:function(e){
    console.log('phone输入变化，当前值为：', e.detail.value)
    this.setData({
      phone: e.detail.value,
      phone_style: '',
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
      arrAddr_reminder:'',
      arrAddr_reminder_style:'',
    })
  },

  /**
   *日期选择器值改变触发事件
   */
  bindSendDateChange:function(e){
    console.log('senddate输入变化，当前值为',e.detail.value)
    this.setData({
      senddate: e.detail.value,
      senddate_placehold:'',
      senddate_placehold_style:'',
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

  /**
   *空值验证
   */
  checkEmpty:function(){
    var flag = true;
    if(!this.data.realname){
      this.setData({
        realname_style: 'border:2rpx solid red',
        realname_placehold:'请填写姓名'
      });
      flag = false;
    }
    if (!this.data.senddate){
      this.setData({
        senddate_placehold_style: 'border:2rpx solid red;color:grey;',
        senddate_placehold:'请选择时间',
      });
      flag = false;
    }
    return flag;
  },

  /**
   *投递时间有效性验证
   */
  checkDateValidity:function(){
    var flag = true;
    var currentDate = new Date();
    var sendDate = new Date(this.data.senddate);
    if((sendDate.getTime()-currentDate.getTime()) < 0){
      this.setData({
        senddate_placehold:'请输入有效时间',
        senddate_placehold_style: 'color:red; font-size: 30rpx;',
      });
      flag = false;
    }
    if ((sendDate.getTime() - currentDate.getTime()) > 24*3600*1000*30){
      this.setData({
        senddate_placehold: '投递时间需在30天以内',
        senddate_placehold_style: 'color:red; font-size: 30rpx;',
      });
     flag = false;
    }
    return flag;
  },

  /**
   *地点有效性验证
   */
  checkLocationValidity:function(){
    var flag = true;
    if (this.data.index_goAddr == this.data.index_arrAddr){
      this.setData({
        arrAddr_reminder: '目的地和出发地不能相同',
        arrAddr_reminder_style: 'color:red; font-size: 30rpx;',
      });
      flag = false;
    }
    return flag;
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
     
    //空值和投递时间有效性检查 
    var checkEmptyFlag = this.checkEmpty();
    var checkDateValidityFlag = this.checkDateValidity();
    var checkLocationValidityFlag = this.checkLocationValidity();
    if (!checkEmptyFlag || !checkDateValidityFlag || !checkLocationValidityFlag){
      return;
    }

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
    var date = new Date(sendDate);
    var content = this.data.description;
    var wxName = this.data.wxname;
    var sendImagUrl = this.data.avatarurl;
    var bonus = this.data.bonus;

    console.log("senddate is "+date);
    
    var myPackInfo = new PackInfo();
    myPackInfo.set('realName', realName);
    myPackInfo.set('senderPhone', senderPhone);
    myPackInfo.set('sendLocation', sendLocation);
    myPackInfo.set('desLocation', desLocation);
    myPackInfo.set('sendDate', date);
    myPackInfo.set('content', content);
    myPackInfo.set('state', '0');
    myPackInfo.set('bonus', bonus);
    myPackInfo.set('wxName', wxName);
    myPackInfo.set('sendImagUrl', sendImagUrl);

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

  },

  getAdjustedFormaDate:function(date, addDay){
    date.setDate(date.getDate()+addDay);
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
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