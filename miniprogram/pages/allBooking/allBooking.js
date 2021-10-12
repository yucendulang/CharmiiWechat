const app = getApp()

Page({
  data: {
    myBookings: [{
        value: 'aaaa',
      },
      {
        value: 'bbbb',
      },
    ],
    openid: app.globalData.openid,
    test: 'test',
    myBs: {}
  },

  onLoad: function (options) {
    this.onLoadByDate(new Date())
  },

  onLoadByDate:function(d){
    d.setHours(0, 0, 0, 0);

    const db = wx.cloud.database()
    const _ = db.command

    var opid
    db.collection('mahjong_table_schedule').where({
      start_time: _.gte(d),
    }).get({
      success: res => {
        try {
          var myBs = res.data
          console.log("myBs", myBs)
          for (var i = 0; i < myBs.length; i++) {
            myBs[i].formatTime = this.formatTime(myBs[i].start_time)
            myBs[i].isTouchMove = false
            myBs[i].index = i
          }
          this.setData({
            myBs,
            role: app.globalData.role
          })
        } catch (e) {
          console.log(e)
        }
      }
    })
  },


  formatTime: function (date1) {
    var date = new Date(date1); //返回当前时间对象
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var myday = date.getDay() //注:0-6对应为星期日到星期六 
    var xingqi
    switch (myday) {
      case 0:
        xingqi = "周日";
        break;
      case 1:
        xingqi = "周一";
        break;
      case 2:
        xingqi = "周二";
        break;
      case 3:
        xingqi = "周三";
        break;
      case 4:
        xingqi = "周四";
        break;
      case 5:
        xingqi = "周五";
        break;
      case 6:
        xingqi = "周六";
        break;
      default:
        xingqi = "系统错误！"
    }
    return month + '-' + day + ' ' + xingqi + ' ' + hour + '点'
  },
  cancelOrder: function (id) {
    const db = wx.cloud.database()
    db.collection('mahjong_table_schedule').doc(id)
      .update({
        data: {
          status: 'C'
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          wx.showToast({
            title: '取消成功',
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '取消失败'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
  },


  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.myBs.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      myBs: this.data.myBs
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    /*
    console.log("touchmove", e)
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    var v = this.data.myBs[index]
    v.isTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;

    if (touchMoveX > startX) //右滑
    {
      console.log("右滑")
      v.isTouchMove = false
    } else { //左滑       
      console.log("左滑")
      v.isTouchMove = true
    }


    //更新数据
    that.setData({
      myBs: that.data.myBs
    })
    */
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  del:function(e){
    console.log('[del]',e)
    console.log(this)
    var that=this
    var id=e.target.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定要取消吗？',
      success: function (sm) {
        if (sm.confirm) {
          console.log(that)
          that.cancelOrder(id)
          that.onLoad()
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  },
  

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
        date: e.detail.value
    })
    this.onLoadByDate(new Date(e.detail.value))
},
})