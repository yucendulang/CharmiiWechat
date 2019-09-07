const app = getApp()

Page({
  data: {
    mahjongtables: [{
        name: '八口麻将机',
        value: '1',
        checked: 'true'
      },
      {
        name: '四口麻将机',
        value: '2',
      },
    ],
    opacity: 0.4,
  },
  onLoad: function(options) {

    var tableTimeDisplays = new Array();
    var tid;
    for (tid = 1; tid < 1 + 2; tid++) {
      var timeDisplays = new Array();
      var i;

      for (i = 8; i < 23; i++) {
        timeDisplays[i] = {
          name: i + ':00-' + (i + 1) + ':00',
          value: i,
          booked: false,
          display: true,
          tableid: tid,
          selected: false
        }
      }
      tableTimeDisplays[tid] = timeDisplays;
    }


    var d = new Date();
    d.setHours(0, 0, 0, 0);
    var dateDisplays = new Array();
    for (i = 0; i < 14; i++) {
      dateDisplays[i] = {
        value: d.toLocaleDateString(),
        date: d
      }
      d = this.addDays(d, 1);
    }
    dateDisplays[1].checked = true;

    console.log('[打印] [准备插入时间和日期数据] 成功: ')

    this.setData({
      tableTimeDisplays,
      dateDisplays
    })

    this.queryBooking(dateDisplays[1].date, this)




  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.queryBooking(new Date(e.detail.value), this)
  },
  addDays: function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  queryBooking: function queryBooking(date, that) {
    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 预定
    console.log(date, '收到的Date如上')
    var onlyDate = new Date(date);
    onlyDate.setHours(0, 0, 0, 0);
    db.collection('mahjong_table_schedule').where({
      start_time: _.gte(onlyDate).and(_.lte(that.addDays(onlyDate, 1))),
      status: _.neq('C') 
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res.data)
        try {
          var fix = new Map();
          var ttd = that.data.tableTimeDisplays;
          for (var i = 0; i < ttd.length; i++) {
            if (ttd[i] == null) {
              continue;
            }
            for (var j = 0; j < ttd[i].length; j++) {
              if (ttd[i][j] == null) {
                continue;
              }
              if (ttd[i][j].booked == true) {
                fix['tableTimeDisplays[' + i + '][' + j + '].booked'] = false
              }
              if (ttd[i][j].selected == true) {
                fix['tableTimeDisplays[' + i + '][' + j + '].selected'] = false
              }
            }
          }

          console.log('数据库结果之前需要修正的[fix]:', fix)

          res.data.forEach(function(value, index, array) {

            var h = value.start_time.getHours();
            var l = value.last_time;
            var tid = value.table_id;

            var i;

            for (i = h; i < h + l; i++) {
              fix['tableTimeDisplays[' + tid + '][' + i + '].booked'] = true
              fix['tableTimeDisplays[' + tid + '][' + i + '].nickname'] = value.nick_name
              fix['tableTimeDisplays[' + tid + '][' + i + '].avatarurl'] = value.avatar_url
            }
          })

          console.log('所有的修正', fix);
          that.setData(fix)
          var isSubmitOk =false
          for (var i = 0; i < tableTimeDisplays.length;i++){
            for(var j=0;j<tableTimeDisplays[i].length;j++){
              if (tableTimeDisplays[i][j].selected==true){
                isSubmitOk=true
              }
            }
          }
          this.setData({
            opacity: isSubmitOk ? 1 : 0.4
          });
        } catch (e) {
          console.log(e);
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  selectBooking: function selectBooking(event) {

    var displayTimeIndex = event.currentTarget.dataset.id;
    var tableid = event.currentTarget.dataset.table;
    console.log(event.currentTarget);
    var fix = 'tableTimeDisplays[' + tableid + '][' + displayTimeIndex + '].selected';
    //console.log(this.data.tableTimeDisplays[tableid][displayTimeIndex].selected)
    this.setData({
      [fix]: this.data.tableTimeDisplays[tableid][displayTimeIndex].selected == false,
    });

    var isSubmitOk = this.data.tableTimeDisplays.flatMap(x => x).find(x => x.selected == true) != null
    this.setData({
      opacity: isSubmitOk ? 1 : 0.4
    });
  },

  submitBooking: function(event) {
    var that = this
    // 必须是在用户已经授权的情况下调用
    wx.getUserInfo({
      success: function(res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        that.bookMahjongTable(event, nickName, avatarUrl)
      }
    })
  },

  bookMahjongTable: function bookMahjongTable(event, nickName, avatarUrl) {
    const query = wx.createSelectorQuery();
    var phone=event.detail.value.phone
    console.log(phone);
    if (!(/^1[3456789]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '请输出正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var ttd = this.data.tableTimeDisplays;
    var ttdflat = ttd.filter(x => x != null)
      .flatMap(s => s)
      .filter(x => x != null)
      .filter(x => x.selected == true);
    var bookTimes = this.groupBy(ttdflat, ttdflat => ttdflat.tableid);
    if (bookTimes.length > 1) {
      wx.showToast({
        title: '请一次预定一桌',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    var bookTimesOneTable = bookTimes[0].sort((a, b) => a.value - b.value);
    console.log(bookTimesOneTable);
    if (bookTimesOneTable[bookTimesOneTable.length - 1].value - bookTimesOneTable[0].value != bookTimesOneTable.length - 1) {
      wx.showToast({
        title: '请预定连续时间段',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var d = new Date(event.detail.value.bookingdate);
    d.setHours(bookTimesOneTable[0].value);
    const db = wx.cloud.database()
    db.collection('mahjong_table_schedule').add({
      data: {
        last_time: bookTimesOneTable.length,
        openid: app.globalData.openid,
        start_time: d,
        table_id: bookTimesOneTable[0].tableid,
        phone: event.detail.value.phone,
        nick_name: nickName,
        avatar_url: avatarUrl
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id

        wx.showToast({
          title: '预定成功',
        })
        this.queryBooking(d, this)
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '预定失败'
        })
        this.queryBooking(d, this)
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })

  },
  groupBy: function groupBy(array, f) {
    let groups = {};
    array.forEach(function(o) {
      let group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function(group) {
      return groups[group];
    });
  }
})