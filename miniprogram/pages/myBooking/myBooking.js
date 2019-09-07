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
    test:'test'
  },

  onLoad: function (options) {

    var d = new Date();
    d.setHours(0, 0, 0, 0);
      
    const db = wx.cloud.database()
    const _ = db.command

    var opid

    opid = app.globalData.openid
    db.collection('mahjong_table_schedule').where({
      start_time: _.gte(d),
      openid: opid,
    }).get({
      success: res => {
        try {
          var myBs = res.data
          for (var i = 0; i < myBs.length; i++) {
          //console.log(myBs.start_time)
          myBs[i].formatTime = this.formatTime(myBs[i].start_time)
          }
          console.log('查到的openid:' + app.globalData.openid)
          console.log('我的预定的数据:', myBs)
          this.setData({
          myBs
          }
          )
        } catch (e) {
          console.log(e)
        }
      }
    }) 
  },

  formatTime :function (date1) {
    var date = new Date(date1); //返回当前时间对象
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var myday = date.getDay()//注:0-6对应为星期日到星期六 
    var xingqi
    switch (myday) {
      case 0: xingqi = "周日"; break;
      case 1: xingqi = "周一"; break;
      case 2: xingqi = "周二"; break;
      case 3: xingqi = "周三"; break;
      case 4: xingqi = "周四"; break;
      case 5: xingqi = "周五"; break;
      case 6: xingqi = "周六"; break;
      default: xingqi = "系统错误！"
    }
    return month + '-' + day + ' ' + xingqi + ' ' + hour + '点'
  }
})