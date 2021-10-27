// pages/announcement/announcement.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isSubmit: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const db = wx.cloud.database()
        const _ = db.command
        db.collection('config').where({
            type: 'announcement'
        }).get({
            success: res => {
                console.log("数据库成功", res)
                this.setData({
                    announcement: res.data[0].content
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
            type: 'fontSize'
        }).get({
            success: res => {
                console.log("数据库成功", res)
                this.setData({
                    fontSize: res.data[0].content
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
            type: 'redAnnouncement'
        }).get({
            success: res => {
                console.log("数据库成功", res)
                this.setData({
                    redAnnouncement: res.data[0].content
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
            type: 'redFontSize'
        }).get({
            success: res => {
                console.log("数据库成功", res)
                this.setData({
                    redFontSize: res.data[0].content
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
            type: 'blueAnnouncement'
        }).get({
            success: res => {
                console.log("数据库成功", res)
                this.setData({
                    blueAnnouncement: res.data[0].content
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
            type: 'blueFontSize'
        }).get({
            success: res => {
                console.log("数据库成功", res)
                this.setData({
                    blueFontSize: res.data[0].content
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

    bindFormSubmit: function (e) {
        this.data.isSubmit = true
        console.log(e)
        console.log(e.detail.value.textarea)
        const db = wx.cloud.database()
        const _ = db.command
        var _this = this
        try {
            _this.updateConfig(db, 'announcement', e.detail.value.textarea, res => {
                _this.updateConfig(db, 'redAnnouncement', e.detail.value.redAnnouncement, res => {
                    _this.updateConfig(db, 'blueAnnouncement', e.detail.value.blueAnnouncement, res => {
                        _this.updateConfig(db, 'fontSize', e.detail.value.fontSize, res => {
                            _this.updateConfig(db, 'redFontSize', e.detail.value.redFontSize, res => {
                                _this.updateConfig(db, 'blueFontSize', e.detail.value.blueFontSize, res => {
                                    wx.showToast({
                                        title: '成功',

                                    })
                                    wx.redirectTo({
                                        url: "/pages/index/index"
                                    })
                                })
                            })
                        })
                    })
                })
            })
        } catch (e) {
            console.error(e)
        }
    },


    updateConfig: function (db, type, content, successFunc) {
        console.log(type,content,successFunc)
        db.collection('config').where({
            type: type
        }).update({
            data: {
                content: content
            },
            success: successFunc,
            fail: res => {
                console.log(res)
                wx.showToast({
                    title: '失败了不知道为啥1 找Dulang',
                })
            }
        })
    }
})