// rank.js
const AV = require('../../../utils/av-weapp-min');
const PackInfo = require('../../../model/packinfo');

//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    senderRank:[],
    deliverRank:[] 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log("On Load rank page")
    //console.log("hispackinfo: " )
    //console.log(app.globalData.hispackinfos)

    if (app.globalData.hispackinfos.length == 0)
    {
      wx.switchTab({
        url: '../show/show',
      })
    }
    this.getSenderRank()
    this.getDeliverRank()

  },


 getSenderRank: function(){
   var that = this
   var rankInfo = []
   var hispackcount = []
   var index = []


   for ( var i = 0; i < app.globalData.hispackinfos.length; i++){
    // console.log(app.globalData.hispackinfos[i])

     if (hispackcount[app.globalData.hispackinfos[i].realName] == null){
        hispackcount[app.globalData.hispackinfos[i].realName] = {
          realName: app.globalData.hispackinfos[i].realName,
          sendPack: 1,
          sendImagUrl: app.globalData.hispackinfos[i].sendImagUrl
        }
        index = index.concat(app.globalData.hispackinfos[i].realName)
     }else{
       hispackcount[app.globalData.hispackinfos[i].realName].sendPack++
     }
   }
   //console.log("after zhengli")
   //console.log(hispackcount)
   //console.log(index)
   for(var i = 0; i < index.length; i++){
     for(var j = 0; j < rankInfo.length; j++){
       if (hispackcount[index[i]].sendPack > rankInfo[j].sendPack){
         break
       }
     }
     rankInfo.splice(j, 0, hispackcount[index[i]])
   }

   //只取前3名
   console.log("Sender rankInfo:")
   console.log(rankInfo)
   that.setData({
     senderRank: rankInfo.slice(0,3)
   })
 },
 getDeliverRank: function(){
   var that = this
   var rankInfo = []
   var hispackcount = []
   var index = []

   //console.log(app.globalData.hispackinfos)

   for (var i = 0; i < app.globalData.hispackinfos.length; i++) {

     if (hispackcount[app.globalData.hispackinfos[i].delName] == null) {
       hispackcount[app.globalData.hispackinfos[i].delName] = {
         realName: app.globalData.hispackinfos[i].delName,
         sendPack: 1,
         delImagUrl: app.globalData.hispackinfos[i].delImagUrl
       }
       index = index.concat(app.globalData.hispackinfos[i].delName)
     } else {
       hispackcount[app.globalData.hispackinfos[i].delName].sendPack++
     }
   }
  // console.log(hispackcount)
  // console.log(index)
  // console.log(hispackcount[index[0]])
   for (var i = 0; i < index.length; i++) {
     for (var j = 0; j < rankInfo.length; j++) {
       if (hispackcount[index[i]].sendPack > rankInfo[j].sendPack) {
         break
       }
     }
     rankInfo.splice(j, 0, hispackcount[index[i]])
   }
   console.log("Deliever rankInfo:")
   console.log(rankInfo)
   //只取前3名
   that.setData({
     deliverRank: rankInfo.slice(0,3)
   })
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
    this.getSenderRank()
    this.getDeliverRank()
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