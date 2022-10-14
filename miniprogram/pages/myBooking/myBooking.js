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
    test: 'test'
  },

  onLoad: function (options) {

    var d = new Date();
    d.setHours(0, 0, 0, 0);

    const db = wx.cloud.database()
    const _ = db.command

    var opid

    opid = app.globalData.openid
    if (opid == null || opid == "") {
      wx.showToast({
        title: '网络差请重启',
      })
      return
    }

    db.collection('mahjong_table_schedule').where({
      start_time: _.gte(d),
      openid: opid,
      status: _.neq('C')
    }).get({
      success: res => {
        try {
          var myBs = res.data
          //console.log(myBs.start_time)
          for (var i = 0; i < myBs.length; i++) {
            //console.log(myBs.start_time)
            myBs[i].formatTime = this.formatTime(myBs[i].start_time)
            myBs[i].isOverNight = myBs[i].start_time.getHours() == 23 ? true : false
          }
          console.log('查到的openid:' + app.globalData.openid)
          console.log('我的预定的数据:', myBs)
          this.setData({
            myBs
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
    //return month + '-' + day + ' ' + xingqi + ' ' + hour + '点'
    return month + '-' + day + xingqi + hour + '点'
  },

  cancelOrder: function (event) {
    var id = event.target.dataset['id'];
    console.log(id)
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
          wx.redirectTo({
            url: '../myBooking/myBooking',
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
  }
})