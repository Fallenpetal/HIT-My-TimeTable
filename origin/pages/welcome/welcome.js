const app = getApp()
Page({

  onLoad:function(){
    if(wx.getStorageSync('hasUserInfo')){
      app.globalData.userInfo = wx.getStorageSync('userInfo')
    }
  },

  onTapJump: function (event) {
    if(!wx.getStorageSync('hasUserInfo')){
      wx.getUserProfile({
        desc: '用于个人信息展示',
        lang:'zh_CN',
        success:(res) =>{
          app.globalData.userInfo = res.userInfo
          wx.setStorageSync('hasUserInfo', true)
          wx.setStorageSync('userInfo', res.userInfo)
          wx.switchTab({
            url: "../index/index",
        });
        }
      })
    }
   else{
    wx.switchTab({
      url: "../index/index",
  })
   }
  }})