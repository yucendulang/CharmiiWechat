const app = getApp()

Page({
  data: {
    myBookings: [{
      value: 'aaaa',
    },
    {
      value: 'bbbb',
    },
    ]
  },

  onLoad: function (options) {

    var d = new Date();
    d.setHours(0, 0, 0, 0);
      
    const db = wx.cloud.database()
    const _ = db.command

    db.collection('mahjong_table_schedule').where({
      start_time: _.gte(d),
      openid: app.globalData.openid,
    }).get({success: res => {
      try{
        var myBs=res.data
    
      this.setData({
        myBs
      }
      )
      }catch(e){
        console.log(e)
      }
    }})
  },
})