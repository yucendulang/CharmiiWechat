//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function () {
    if (!wx.cloud) {
      console.log("!wx.cloud enter")
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    console.log("wx.cloud enter")

    wx.cloud.callFunction({
      name: 'getServeTime',
      data: {},
      success: res => {
        console.log('[云函数] [getServeTime] ServeTime: ', res.result, res.result.timeStamp)
        app.globalData.serveTime = res.result.timeStamp
        app.globalData.phoneTime = (new Date()).getTime()
        app.globalData.TimeDiff = res.result.timeStamp - app.globalData.phoneTime
        console.log('和服务器的时间差为 ', app.globalData.TimeDiff)
        var s = app.globalData.serveTime
        var p = app.globalData.phoneTime
        this.setData({
          serveTime: s,
          phoneTime: p
        })
        var diffTime = 10000
        var offset_GMT = new Date().getTimezoneOffset()
        if (app.globalData.TimeDiff > diffTime | app.globalData.TimeDiff < -diffTime | offset_GMT != -480) {
          console.log('进行跳转')
          wx.redirectTo({
            url: "/pages/timeError/timeError"
          })
        } else {
          this.onGetOpenid()
          this.onGetAnnounce()
        }

      },
      fail: err => {
        console.error('[云函数] [getServeTime] 调用失败', err)
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetRole: function () {
    const db = wx.cloud.database()
    const _ = db.command
    //console.log(app.globalData.openid)
    db.collection('role').where({
      openid: app.globalData.openid,
    }).get({
      success: res => {
        try {
          //console.log(res)
          //console.log(res.data)
          if (res.data != null) {
            app.globalData.role = res.data[0].role
            this.setData({
              role: res.data[0].role
            })
          }
          //console.log(app.globalData.role)
        } catch (e) {
          console.log(e)
        }
      }
    })
  },

  onGetAnnounce:function(){
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('config').where({
        type: _.eq('announcement').or(_.eq('redAnnouncement')).or(_.eq('blueAnnouncement'))
    }).get({
        success: res => {
            console.log("index Page read Announcement", res)
            this.setData({
                announcement: res.data.filter(i=>i.type=='announcement')[0].content,
                redAnnouncement: res.data.filter(i=>i.type=='redAnnouncement')[0].content,
                blueAnnouncement: res.data.filter(i=>i.type=='blueAnnouncement')[0].content,
            })
        },
        fail: err => {
            wx.showToast({
                icon: 'none',
                title: '查询记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
        }
    })

    db.collection('config').where({
        type: _.eq('fontSize').or(_.eq('redFontSize')).or(_.eq('blueFontSize'))
    }).get({
        success: res => {
            //console.log("index Page read Announcement fontSize", res)
            this.setData({
                fontSize: res.data.filter(i=>i.type=='fontSize')[0].content,
                redFontSize: res.data.filter(i=>i.type=='redFontSize')[0].content,
                blueFontSize: res.data.filter(i=>i.type=='blueFontSize')[0].content,
            })
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

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          dataReady: true
        })
        this.onGetRole()
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})