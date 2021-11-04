// js
var startX, endX;                    //首先创建2个变量 来记录触摸时的原点
var moveFlag = true;                 // 判断执行滑动事件
Page({
  data: {
    page:0,                  //判断第几周的数组weekList的下标  
    show: false,
    timelist:['8:00-9:45','10:05-11:50','14:00-15:45','16:05-17:50','18:40-20:25','20:45-22:30'],
    weekdaylist:['周一','周二','周三','周四','周五','周六','周日'],
    weekList: ['1','2','3','4','5','6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    wlist: [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    value:'',                                                      //清空输入框
    showpop:false,
    showColor:false,
    showIcon:[false,false,false,false,false,false],
    colorlist:['#FCB8AF','#81D2FC','#F8C77A','#90EE90','#DDA0DD','#C0C0C0'],
    field_arr:[
    {label: "课程名称",placeholder:"请输入课程名"},{label: "授课教师",placeholder:"请输入教师名"},
    {label: "课程类型",placeholder:"请输入'必'或'选'"},{label: "上课地点",placeholder:"请输入上课地点"},{label: "课程安排",placeholder:"如第3-18周输入'3-18'"},],
    addData:{ 
      color:'#81D2FC'
    },
    addClass:{ },
    database_count:0,                             //储存数据库中的原始数据条数
    animationData:''                            //动画效果
  },

  onLoad: function (options) {
    wx.cloud.init();
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:"query",
      data:{
        count:0
      }
    }).then((res) =>{
      let data = res.result.data
      this.Dataprogress(data)
      this.setData({
        database_count:data.length
      })
      wx.hideLoading()
    })

    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        })
      },
    })

  },

//云端请求数据后处理的函数
 Dataprogress:function(data){
  console.log(data)
  var temp = this.data.wlist
  for(var i = 0;i<data.length;i++){
    var j = 0
    let start = parseInt(data[i].week.substring(0,1))
    let end = parseInt(data[i].week.substring(2,4))
    let obj = {}
    obj = data[i]
    for(j=start;j<=end;++j){
      temp[j-1].push(obj)
    }
  }
  console.log("数据处理完成")
  this.setData({
    wlist:temp
  })
},

/*----左右滑动切换页面------*/
touchStart: function (e) {
  startX = e.touches[0].pageX; // 获取触摸时的原点

  moveFlag = true;

},
// 触摸移动事件
touchMove: function (e) {
  endX = e.touches[0].pageX; // 获取触摸时的原点
  if (moveFlag) {
    if (endX - startX > 50) {
      console.log("move right");
      this.moveright();
      moveFlag = false;
    }
    if (startX - endX > 50) {
      console.log("move left");
      this.moveleft();
      moveFlag = false;
    }
  }
},
// 触摸结束事件
touchEnd: function (e) {
  console.log("end",e)
  moveFlag = true; // 回复滑动事件
},

 //向左滑动操作
 moveleft() {
  var page = this.data.page
  if (page == 20) { 
    return
  }
  setTimeout( () => {
    this.setData({
      page: page+1, 
    });
  }, 300) 
},

//向右滑动操作
moveright() {
  var page = this.data.page
  if (page == 0) {
    return
  }
  setTimeout( () => {
    this.setData({
      page: page-1,
    });
  }, 300)
},


 //长按longpress添加自定义课程（第一层弹窗）
  showPopup:function(e){
    let id = e.currentTarget.dataset.id
    let row = parseInt(id/10)
    let column = id%10
    let timelist = this.data.timelist
    let weekdaylist = this.data.weekdaylist
    let temp = { }
    switch(row){
      case 1:
        temp.time = timelist[0]
        break;
      case 2:
        temp.time = timelist[1]
        break;
      case 3:
        temp.time = timelist[2]
        break;
      case 4:
        temp.time = timelist[3]
        break;
      case 5:
        temp.time = timelist[4]
      case 6:
        temp.time = timelist[5]
    }
    switch(column){
      case 1:
        temp.weekday = weekdaylist[0]
        break;
      case 2:
        temp.weekday = weekdaylist[1]
        break;
      case 3:
        temp.weekday = weekdaylist[2]
        break;
      case 4:
        temp.weekday = weekdaylist[3]
        break;
      case 5:
        temp.weekday = weekdaylist[4]
        break;
      case 6:
        temp.weekday = weekdaylist[5]
        break;
      case 7:
        temp.weekday = weekdaylist[6]
        break;
    }
    this.setData({ 
      showpop: true,
      addClass:temp,
      'addData.row':row,
      'addData.column':column
     });
     console.log(this.data.addClass)
  },

//长按longpress删除课程
 removeIt(e){
  var that =this
  var x = this.data.page
  var y = e.currentTarget.dataset.index
  this.data.wlist[x][y] = null
  var _id = e.currentTarget.dataset.id
  wx.showModal({
    title: '提示',
    content: '是否删除该门课程',
    success (res) {
      if (res.confirm) {
        wx.showLoading({
            title: '正在删除...',
          })
        wx.cloud.callFunction({
          name:'remove',
          data:{
            id:_id
          }
        }).then(() =>{
          that.setData({
            wlist:that.data.wlist
          })
          wx.hideLoading()
          console.log("删除成功")
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })

 },

  changeWeek:function(e){
    let page = e.currentTarget.dataset.week
    console.log(e.currentTarget.dataset)
    // var temp = this.data.wlist 看情况,也可以写在这里
    this.setData({
      page:page,
      // wlist:temp
    })
  },
//
  clickShow: function (e) {
    var that = this;
    that.setData({
      show: !that.data.show,
    })
  },

  clickHide: function (e) {
    var that = this
    that.setData({
      show: false
    })
  },


  showCardView: function (e) {
    console.log(e)
    console.log("查看课程详情")    //点击临时定义一个cardView对象e.currentTarget.dataset.wlist.object可以直接定位到数组属性,不用加数组下标
    let temp = e.currentTarget.dataset.wlist
    let cardView = {
      classname: temp.classname,
      color: temp.color,
      classroom: temp.classroom,
      teacher:temp.teacher,
      time:temp.time,
      plan:temp.plan,
      type:temp.type,
      color:temp.color
    }
    this.setData({
      cardView: cardView
    })
    this.util("open");
  },

  hideModal() {
    this.util("close");
  },

  util: function (currentStatu) {
    var animation = wx.createAnimation({
      duration: 100, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });
    this.animation = animation;
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation
      })

      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },

/*-------------以下是添加课程时的代码------------------*/
//点击<点击选择>按钮，点击后打开弹窗，选择课程颜色
colorChoose(){
  this.setData({
    showColor:true
  })
 },

 //添加课程时选择具体的6个颜色,拿到当前选择的颜色
 colorSelect:function(e){
  // console.log(e.currentTarget.dataset)
  let color = e.currentTarget.dataset.color
  let temp = [false,false,false,false,false,false]    //这里每次初始化均是false，那么可以直接实现当一个图标已经在其中一个组件上时，点击另一个可以把当前组件上的图标取消并赋给新的组件上
  switch(color){
    case '#FCB8AF':
      temp[0]=true
      break;
    case '#81D2FC':
      temp[1]=true
      break;
    case '#F8C77A':
      temp[2]=true
      break;
    case '#90EE90':
      temp[3]=true
      break;
    case '#DDA0DD':
      temp[4]=true
      break;
    case '#C0C0C0':
      temp[5]=true
      break;
  }
  this.setData({
    showIcon:temp,
    'addData.color':color
  })
 },

//点击右上角自带x关闭弹出层时触发（第一层弹窗）
onClose() {
  this.setData({ 
    showpop: false,
    value:''
   });
},

//点击右上角自带x关闭弹出层时触发（第二层弹窗）
onCloseColor() {
  this.setData({ showColor: false });
},

//拿到添加课程的表单数据
inputData(e){
  var id = e.currentTarget.dataset.id
  var addData = this.data.addData
  switch(id){
    case 0:
      addData.classname = e.detail.value
    break;
    case 1:
      addData.teacher = e.detail.value
    break
    case 2:
      addData.type = e.detail.value
    break;
    case 3:
      addData.classroom = e.detail.value
    break;
    case 4:
      addData.week = e.detail.value
    break;
  }
},

//第二层弹窗的确定事件函数
SureColor(){
  this.setData({ showColor: false })
},

//第二层弹窗的取消事件函数
CancelColor(){
  this.setData({ 
    showColor: false,
    showIcon:[false,false,false,false,false,false],
    'addData.color':''
  })
},

//第一层弹窗确定事件函数
SureAddData(){
  console.log(this.data.addData)
  var addData = this.data.addData
  var count = this.data.database_count
  wx.showLoading({
    title: '添加中...',
  })
  wx.cloud.callFunction({
    name:'addData',
    data:addData
  }).then(() =>{
    wx.cloud.callFunction({
      name:'query',
      data:{
        count:count
      }
    }).then((res) =>{
      let data = res.result.data
      this.Dataprogress(data)
        wx.hideLoading()
        console.log("添加成功")
    })
  })
  this.setData({ 
    showpop: false,
    value:''
   });
},

//第一层弹窗的取消事件函数
CancelAddData(){
  this.setData({ 
    showpop: false,
    value:'',
    addData:{}
   });
}
})
