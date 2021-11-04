const app = getApp();

Page({
  data: {
    cache: [
      { iconurl: '/images/icon/wx_app_clear.png', title: '缓存清理', tap: 'clearCache' }
    ],
    device: [
      { iconurl: '/images/icon/wx_app_cellphone.png', title: '系统信息', tap: 'showSystemInfo' },
      { iconurl: '/images/icon/wx_app_network.png', title: '网络状态', tap: 'showNetWork' },
      { iconurl: '/images/icon/wx_app_location.png', title: '地图显示', tap: 'showMap' },
      { iconurl: '/images/icon/wx_app_compass.png', title: '指南针', tap: 'showCompass' },
      { iconurl: '/images/icon/wx_app_lonlat.png', title: '当前位置、速度', tap: 'showLonLat' },
      { iconurl: '/images/icon/wx_app_scan_code.png', title: '二维码', tap: 'scanQRCode' }
    ],
    compassVal: 0,
    compassHidden: true,
  },

  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  //显示模态窗口
  showModal: function (title, content, callback) {
    wx.showModal({
      title: title,
      content: content,
      confirmColor: '#1F4BA5',
      cancelColor: '#7F8389',
      success: function (res) {
        if (res.confirm) {
          callback && callback();
        }
      }
    })
  },

  // 缓存清理
  clearCache: function () {
    this.showModal('缓存清理', '确定要清除本地缓存吗？\n清理后下次进入需要重新授权用户信息', function () {
      wx.clearStorage({
        success: function (msg) {
          wx.showToast({
            title: "缓存清理成功",
            duration: 1000,
            mask: true,
            icon: "success"
          })
        },
        fail: function (e) {
          console.log(e)
        }
      })
    });
  },

  //显示系统信息
  showSystemInfo: function () {
    wx.navigateTo({
      url: 'device/device'
    });
  },

  //网络状态
  showNetWork: function () {
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        var networkType = res.networkType
        that.showModal('网络状态', '您当前的网络：' + networkType);
      }
    })
  },

  //获取当前位置经纬度与当前速度
  getLonLat: function (callback) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy:true,
      highAccuracyExpireTim:3000,
      success: function (res) {
        console.log(res)
        callback(res.longitude, res.latitude, res.speed);
      }
    });
  },

  //显示当前位置坐标与当前速度
  showLonLat: function () {
    var that = this;
    this.getLonLat(function (lon, lat, speed) {
      var lonStr = lon >= 0 ? '东经' : '西经',
        latStr = lat >= 0 ? '北纬' : '南纬';
      lon = lon.toFixed(2);
      lat = lat.toFixed(2);
      lonStr += lon;
      latStr += lat;
      speed = (speed || 0).toFixed(2);
      that.showModal('当前位置和速度', '当前位置：' + lonStr + ',' + latStr + '。速度:' + speed + 'm/s');
    });
  },

  //在地图上显示当前位置
  showMap: function () {
    this.getLonLat(function (lon, lat) {
      wx.openLocation({
        latitude: lat,
        longitude: lon,
        scale: 15,
        name: "哈尔滨工业大学威海校区",
        address: "环翠区文化西路2号, 威海市",
        fail: function () {
          wx.showToast({
            title: "地图打开失败",
            duration: 1000,
            icon: "cancel"
          });
        }
      });
    });
  },

  //显示罗盘
  showCompass: function () {
    var that = this;
    this.setData({
      compassHidden: false
    })
    wx.onCompassChange(function (res) {
      console.log(res)
      if (!that.data.compassHidden) {
        that.setData({ compassVal: res.direction.toFixed(2) });
      }
    });
  },

  //隐藏罗盘
  hideCompass: function () {
    this.setData({
      compassHidden: true
    })
  },


  //扫描二维码
  scanQRCode: function () {
    var that = this;
    wx.scanCode({
      success: function (res) {
        console.log(res)
        that.showModal('扫描二维码', res.result, false);
      },
      fail: function (res) {
        that.showModal('扫描二维码', "扫描失败，请重试", false);
      }
    })
  },

})